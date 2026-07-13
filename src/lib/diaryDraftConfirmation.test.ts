import { describe, expect, it } from 'vitest';
import type { OfflineDiaryDraft } from './indexedDB';
import { filterVisibleOfflineDrafts, getConfirmedOfflineDraftIds } from './diaryDraftConfirmation';

const draft = (overrides: Partial<OfflineDiaryDraft>): OfflineDiaryDraft => ({
  id: 'draft-1',
  userId: 'user-a',
  diaryId: 'diary-1',
  cropType: 'Rice',
  activityType: 'Water',
  content: 'Done',
  diaryDate: '2026-07-12T03:30:00.000Z',
  status: 'pending',
  attemptCount: 0,
  idempotencyKey: 'key-1',
  requestHash: 'hash-1',
  imageBlobs: [],
  imageDigests: [],
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe('diaryDraftConfirmation', () => {
  it('keeps sync_confirming drafts visible until the remote log confirms them', () => {
    const confirming = draft({
      status: 'sync_confirming',
      serverLogId: 'server-1',
    });

    expect(filterVisibleOfflineDrafts([confirming], [])).toEqual([confirming]);
    expect(filterVisibleOfflineDrafts([confirming], [{ _id: 'server-2' }])).toEqual([confirming]);
  });

  it('identifies confirmed drafts by logId or idempotencyKey', () => {
    const byServerId = draft({
      id: 'draft-server',
      status: 'sync_confirming',
      serverLogId: 'server-1',
    });
    const byKey = draft({
      id: 'draft-key',
      status: 'sync_confirming',
      idempotencyKey: 'key-2',
    });

    expect(
      getConfirmedOfflineDraftIds(
        [byServerId, byKey],
        [{ logId: 'server-1' }, { idempotencyKey: 'key-2' }],
      ),
    ).toEqual(['draft-server', 'draft-key']);
  });
});
