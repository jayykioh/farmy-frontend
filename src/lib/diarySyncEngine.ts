import type { AppDispatch } from '../store';
import { baseApi } from '../store/api/baseApi';
import { api } from '../api/client';
import { queryClient } from './queryClient';
import { PET_STATUS_QUERY_KEY } from '../features/pet/hooks/usePetStatus';
import {
  DIARY_SYNC_LOCK_KEY,
  claimSyncLease,
  heartbeatSyncLease,
  listSyncableDiaryDrafts,
  recoverStaleSyncingDrafts,
  releaseSyncLease,
  updateOfflineDiaryDraft,
  type OfflineDiaryDraft,
} from './indexedDB';

type NavigatorLock = {
  name: string;
  mode: 'exclusive' | 'shared';
};

type NavigatorWithLocks = Navigator & {
  locks?: {
    request: (
      name: string,
      options: { mode?: 'exclusive' | 'shared'; ifAvailable?: boolean },
      callback: (lock: NavigatorLock | null) => Promise<void>,
    ) => Promise<void>;
  };
};

type DiaryLogResponse = {
  data?: {
    _id?: string;
    logId?: string;
    id?: string;
  };
};

const HEARTBEAT_MS = 10_000;
const LEASE_MS = 30_000;
let activeUserId: string | null = null;
let inFlight = false;

export const stopDiarySync = () => {
  activeUserId = null;
};

const isRetryableError = (error: unknown) => {
  const status = (error as { response?: { status?: number } }).response?.status;
  const errorCode = (error as { response?: { data?: { errorCode?: string } } }).response?.data?.errorCode;
  if (!status) return true;
  if (status === 401) return 'pause';
  if (errorCode === 'IDEMPOTENCY_IN_PROGRESS') return true;
  return status === 408 || status === 429 || status >= 500;
};

const nextRetryAt = (attemptCount: number) => {
  return Date.now() + Math.min(5 * 60_000, 2 ** attemptCount * 5_000);
};

const invalidateDiaryData = (dispatch?: AppDispatch, diaryId?: string) => {
  if (!dispatch || !diaryId) return;

  dispatch(
    baseApi.util.invalidateTags([
      { type: 'DiaryLog', id: `LIST_${diaryId}` },
      { type: 'Diary', id: diaryId },
      { type: 'Diary', id: 'LIST' },
    ]),
  );
};

const syncDraft = async (draft: OfflineDiaryDraft, dispatch?: AppDispatch) => {
  await updateOfflineDiaryDraft(draft.id, (current) => ({
    ...current,
    status: 'syncing',
    syncStartedAt: Date.now(),
    lastError: undefined,
  }));

  try {
    const response = await api.post<DiaryLogResponse>(
      `/diaries/${draft.diaryId}/logs`,
      {
        activity_type: draft.activityType,
        content: draft.content,
        image_url: draft.imageUrls?.[0],
      },
      {
        headers: {
          'Idempotency-Key': draft.idempotencyKey,
          'X-Request-Hash': draft.requestHash,
        },
      },
    );

    const serverLogId =
      response.data.data?.logId ?? response.data.data?.id ?? response.data.data?._id;

    await updateOfflineDiaryDraft(draft.id, (current) => ({
      ...current,
      status: 'sync_confirming',
      syncStartedAt: undefined,
      serverLogId,
      nextRetryAt: undefined,
      lastError: undefined,
    }));
    invalidateDiaryData(dispatch, draft.diaryId);
    queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
    return true;
  } catch (error) {
    const retryStatus = isRetryableError(error);
    if (retryStatus === 'pause') {
      await updateOfflineDiaryDraft(draft.id, (current) => ({
        ...current,
        status: 'pending',
        syncStartedAt: undefined,
        lastError: 'Authentication required',
      }));
      return false; // Break queue
    }

    const retryable = !!retryStatus;
    const attemptCount = draft.attemptCount + 1;

    await updateOfflineDiaryDraft(draft.id, (current) => ({
      ...current,
      status: retryable ? 'failed_retryable' : 'failed_permanent',
      attemptCount,
      syncStartedAt: undefined,
      nextRetryAt: retryable ? nextRetryAt(attemptCount) : undefined,
      lastError: error instanceof Error ? error.message : 'Unable to sync diary draft',
    }));
    return true; // Continue queue
  }
  return true;
};

const processQueue = async (userId: string, dispatch?: AppDispatch) => {
  if (activeUserId !== userId) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  await recoverStaleSyncingDrafts(userId);
  const drafts = await listSyncableDiaryDrafts(userId);

  for (const draft of drafts) {
    if (activeUserId !== userId) return;
    const shouldContinue = await syncDraft(draft, dispatch);
    if (!shouldContinue) break;
  }
};

const processWithIdbLease = async (userId: string, dispatch?: AppDispatch) => {
  const ownerId = `${userId}:${crypto.randomUUID()}`;
  const claimed = await claimSyncLease(DIARY_SYNC_LOCK_KEY, ownerId, LEASE_MS);
  if (!claimed) return;

  const heartbeat = window.setInterval(() => {
    void heartbeatSyncLease(DIARY_SYNC_LOCK_KEY, ownerId, LEASE_MS);
  }, HEARTBEAT_MS);

  try {
    await processQueue(userId, dispatch);
  } finally {
    window.clearInterval(heartbeat);
    await releaseSyncLease(DIARY_SYNC_LOCK_KEY, ownerId);
  }
};

export const runDiarySync = async (userId: string, dispatch?: AppDispatch) => {
  activeUserId = userId;
  if (inFlight) return;

  inFlight = true;
  try {
    const locks = (navigator as NavigatorWithLocks).locks;
    if (locks) {
      await locks.request(
        DIARY_SYNC_LOCK_KEY,
        { mode: 'exclusive', ifAvailable: true },
        async (lock) => {
          if (!lock) return;
          await processQueue(userId, dispatch);
        },
      );
      return;
    }

    await processWithIdbLease(userId, dispatch);
  } finally {
    inFlight = false;
  }
};

export const makeEditedDiaryDraft = (
  draft: OfflineDiaryDraft,
  requestHash: string,
): OfflineDiaryDraft => ({
  ...draft,
  idempotencyKey: crypto.randomUUID(),
  requestHash,
  status: 'pending',
  attemptCount: 0,
  nextRetryAt: undefined,
  syncStartedAt: undefined,
  serverLogId: undefined,
  updatedAt: Date.now(),
});
