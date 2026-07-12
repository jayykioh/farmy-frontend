import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export type SyncStatus =
  | 'draft'
  | 'pending'
  | 'syncing'
  | 'failed_retryable'
  | 'failed_permanent'
  | 'sync_confirming';

export type OfflineDiaryDraft = {
  id: string;
  userId: string;
  diaryId: string;
  cropType?: string;
  activityType: string;
  content: string;
  diaryDate: string;
  status: SyncStatus;
  attemptCount: number;
  nextRetryAt?: number;
  syncStartedAt?: number;
  idempotencyKey: string;
  requestHash: string;
  serverLogId?: string;
  imageBlobs: Blob[];
  imageDigests: string[];
  imageUrls?: string[];
  createdAt: number;
  updatedAt: number;
  lastError?: string;
};

export type SyncMetadata = {
  key: string;
  ownerId: string;
  leaseUntil: number;
  heartbeatAt: number;
};

interface FarmyOfflineDB extends DBSchema {
  offline_diary_drafts: {
    key: string;
    value: OfflineDiaryDraft;
    indexes: {
      'by-user': string;
      'by-user-diary': [string, string];
      'by-status': SyncStatus;
    };
  };
  sync_metadata: {
    key: string;
    value: SyncMetadata;
  };
}

const DB_NAME = 'farmy-offline';
const DB_VERSION = 1;
export const DIARY_SYNC_LOCK_KEY = 'diary-sync';
export const OFFLINE_DIARY_DRAFTS_CHANGED = 'offline-diary-drafts-changed';

let dbPromise: Promise<IDBPDatabase<FarmyOfflineDB>> | undefined;

const emitDraftChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OFFLINE_DIARY_DRAFTS_CHANGED));
  }
};

export const getOfflineDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<FarmyOfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline_diary_drafts')) {
          const drafts = db.createObjectStore('offline_diary_drafts', { keyPath: 'id' });
          drafts.createIndex('by-user', 'userId');
          drafts.createIndex('by-user-diary', ['userId', 'diaryId']);
          drafts.createIndex('by-status', 'status');
        }

        if (!db.objectStoreNames.contains('sync_metadata')) {
          db.createObjectStore('sync_metadata', { keyPath: 'key' });
        }
      },
    });
  }

  return dbPromise;
};

export const saveOfflineDiaryDraft = async (draft: OfflineDiaryDraft) => {
  const db = await getOfflineDB();
  await db.put('offline_diary_drafts', draft);
  emitDraftChange();
};

export const updateOfflineDiaryDraft = async (
  id: string,
  updater: (draft: OfflineDiaryDraft) => OfflineDiaryDraft,
) => {
  const db = await getOfflineDB();
  const tx = db.transaction('offline_diary_drafts', 'readwrite');
  const store = tx.objectStore('offline_diary_drafts');
  const current = await store.get(id);
  if (!current) {
    await tx.done;
    return undefined;
  }

  const next = updater(current);
  await store.put({ ...next, updatedAt: Date.now() });
  await tx.done;
  emitDraftChange();
  return next;
};

export const deleteOfflineDiaryDraft = async (id: string) => {
  const db = await getOfflineDB();
  await db.delete('offline_diary_drafts', id);
  emitDraftChange();
};

export const listOfflineDiaryDraftsByUser = async (
  userId: string,
  diaryId?: string,
): Promise<OfflineDiaryDraft[]> => {
  const db = await getOfflineDB();
  const drafts = diaryId
    ? await db.getAllFromIndex('offline_diary_drafts', 'by-user-diary', [userId, diaryId])
    : await db.getAllFromIndex('offline_diary_drafts', 'by-user', userId);

  return drafts.sort((a, b) => b.createdAt - a.createdAt);
};

export const listSyncableDiaryDrafts = async (userId: string, now = Date.now()) => {
  const drafts = await listOfflineDiaryDraftsByUser(userId);
  return drafts
    .filter((draft) => draft.status === 'pending' || draft.status === 'failed_retryable')
    .filter((draft) => !draft.nextRetryAt || draft.nextRetryAt <= now)
    .sort((a, b) => a.createdAt - b.createdAt);
};

export const recoverStaleSyncingDrafts = async (
  userId: string,
  staleBefore = Date.now() - 5 * 60 * 1000,
) => {
  const drafts = await listOfflineDiaryDraftsByUser(userId);
  const staleDrafts = drafts.filter(
    (draft) =>
      draft.status === 'syncing' &&
      draft.syncStartedAt !== undefined &&
      draft.syncStartedAt < staleBefore,
  );

  await Promise.all(
    staleDrafts.map((draft) =>
      updateOfflineDiaryDraft(draft.id, (current) => ({
        ...current,
        status: 'pending',
        syncStartedAt: undefined,
        nextRetryAt: undefined,
      })),
    ),
  );

  return staleDrafts.length;
};

export const claimSyncLease = async (
  key: string,
  ownerId: string,
  leaseMs = 30_000,
  now = Date.now(),
) => {
  const db = await getOfflineDB();
  const tx = db.transaction('sync_metadata', 'readwrite');
  const store = tx.objectStore('sync_metadata');
  const existing = await store.get(key);

  if (existing && existing.leaseUntil > now && existing.ownerId !== ownerId) {
    await tx.done;
    return false;
  }

  await store.put({
    key,
    ownerId,
    leaseUntil: now + leaseMs,
    heartbeatAt: now,
  });
  await tx.done;
  return true;
};

export const heartbeatSyncLease = async (
  key: string,
  ownerId: string,
  leaseMs = 30_000,
  now = Date.now(),
) => {
  const db = await getOfflineDB();
  const tx = db.transaction('sync_metadata', 'readwrite');
  const store = tx.objectStore('sync_metadata');
  const existing = await store.get(key);

  if (!existing || existing.ownerId !== ownerId) {
    await tx.done;
    return false;
  }

  await store.put({
    ...existing,
    leaseUntil: now + leaseMs,
    heartbeatAt: now,
  });
  await tx.done;
  return true;
};

export const releaseSyncLease = async (key: string, ownerId: string) => {
  const db = await getOfflineDB();
  const tx = db.transaction('sync_metadata', 'readwrite');
  const store = tx.objectStore('sync_metadata');
  const existing = await store.get(key);

  if (existing?.ownerId === ownerId) {
    await store.delete(key);
  }

  await tx.done;
};
