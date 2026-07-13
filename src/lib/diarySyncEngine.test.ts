import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OfflineDiaryDraft } from './indexedDB';

vi.mock('../api/client', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('../store/api/baseApi', () => ({
  baseApi: {
    util: {
      invalidateTags: vi.fn((tags) => ({ type: 'invalidateTags', payload: tags })),
    },
  },
}));

vi.mock('./indexedDB', () => ({
  DIARY_SYNC_LOCK_KEY: 'diary-sync',
  claimSyncLease: vi.fn(),
  heartbeatSyncLease: vi.fn(),
  listSyncableDiaryDrafts: vi.fn(),
  recoverStaleSyncingDrafts: vi.fn(),
  releaseSyncLease: vi.fn(),
  updateOfflineDiaryDraft: vi.fn(),
}));

import { api } from '../api/client';
import { baseApi } from '../store/api/baseApi';
import {
  claimSyncLease,
  listSyncableDiaryDrafts,
  recoverStaleSyncingDrafts,
  releaseSyncLease,
  updateOfflineDiaryDraft,
} from './indexedDB';
import { makeEditedDiaryDraft, runDiarySync, stopDiarySync } from './diarySyncEngine';

const baseDraft: OfflineDiaryDraft = {
  id: 'draft-1',
  userId: 'user-a',
  diaryId: 'diary-1',
  cropType: 'Rice',
  activityType: 'Water',
  content: 'Watered today',
  diaryDate: '2026-07-12T03:30:00.000Z',
  status: 'pending',
  attemptCount: 0,
  idempotencyKey: 'idem-1',
  requestHash: 'hash-1',
  imageBlobs: [],
  imageDigests: [],
  imageUrls: ['https://example.test/image.jpg'],
  createdAt: 1,
  updatedAt: 1,
};

describe('diarySyncEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stopDiarySync();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    Object.defineProperty(navigator, 'locks', { value: undefined, configurable: true });
  });

  it('uses the IDB lease fallback and syncs only the active user queue', async () => {
    let current = { ...baseDraft };
    const updates: OfflineDiaryDraft[] = [];

    vi.mocked(claimSyncLease).mockResolvedValue(true);
    vi.mocked(recoverStaleSyncingDrafts).mockResolvedValue(1);
    vi.mocked(listSyncableDiaryDrafts).mockResolvedValue([baseDraft]);
    vi.mocked(updateOfflineDiaryDraft).mockImplementation(async (_id, updater) => {
      current = updater(current);
      updates.push(current);
      return current;
    });
    vi.mocked(api.post).mockResolvedValue({
      data: {
        data: {
          _id: 'server-log-1',
        },
      },
    });

    const dispatch = vi.fn();
    await runDiarySync('user-a', dispatch);

    expect(recoverStaleSyncingDrafts).toHaveBeenCalledWith('user-a');
    expect(listSyncableDiaryDrafts).toHaveBeenCalledWith('user-a');
    expect(claimSyncLease).toHaveBeenCalledWith('diary-sync', expect.stringContaining('user-a:'), 30000);
    expect(api.post).toHaveBeenCalledWith(
      '/diaries/diary-1/logs',
      {
        activity_type: 'Water',
        content: 'Watered today',
        image_url: 'https://example.test/image.jpg',
      },
      {
        headers: {
          'Idempotency-Key': 'idem-1',
          'X-Request-Hash': 'hash-1',
        },
      },
    );
    expect(updates[0]).toMatchObject({ status: 'syncing' });
    expect(updates[1]).toMatchObject({ status: 'sync_confirming', serverLogId: 'server-log-1' });
    expect(releaseSyncLease).toHaveBeenCalled();
    expect(baseApi.util.invalidateTags).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'invalidateTags' }));
  });

  it('regenerates idempotency key and hash when editing a draft', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

    expect(makeEditedDiaryDraft(baseDraft, 'new-hash')).toMatchObject({
      idempotencyKey: '00000000-0000-4000-8000-000000000001',
      requestHash: 'new-hash',
      status: 'pending',
      attemptCount: 0,
      serverLogId: undefined,
    });
  });
});
