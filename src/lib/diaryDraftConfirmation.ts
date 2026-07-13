import type { OfflineDiaryDraft } from './indexedDB';

export type RemoteDiaryLogIdentity = {
  _id?: string;
  logId?: string;
  idempotencyKey?: string;
};

export const getRemoteLogId = (log: RemoteDiaryLogIdentity) => log.logId ?? log._id;

export const getConfirmedOfflineDraftIds = (
  drafts: OfflineDiaryDraft[],
  logs: RemoteDiaryLogIdentity[],
) => {
  const remoteIds = new Set(logs.map(getRemoteLogId).filter(Boolean));
  const remoteKeys = new Set(logs.map((log) => log.idempotencyKey).filter(Boolean));

  return drafts
    .filter((draft) => draft.status === 'sync_confirming')
    .filter(
      (draft) =>
        (draft.serverLogId !== undefined && remoteIds.has(draft.serverLogId)) ||
        remoteKeys.has(draft.idempotencyKey),
    )
    .map((draft) => draft.id);
};

export const filterVisibleOfflineDrafts = (
  drafts: OfflineDiaryDraft[],
  logs: RemoteDiaryLogIdentity[],
) => {
  const confirmedIds = new Set(getConfirmedOfflineDraftIds(drafts, logs));
  return drafts.filter((draft) => !confirmedIds.has(draft.id));
};
