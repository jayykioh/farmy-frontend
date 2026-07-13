## 1. Storage & Schema (IndexedDB)

- [x] 1.1 Update `src/lib/indexedDB.ts` to include TWO stores: `offline_diary_drafts` and `sync_metadata`.
- [x] 1.2 `offline_diary_drafts` schema: `status` (including `sync_confirming`), `attemptCount`, `nextRetryAt`, `syncStartedAt`, `diaryId`, `userId`, `idempotencyKey`, `requestHash`, `serverLogId`, and Blobs.
- [x] 1.3 `sync_metadata` schema: `key: string`, `ownerId: string`, `leaseUntil: number`, `heartbeatAt: number`.

## 2. PWA Configuration

- [x] 2.1 Configure `vite-plugin-pwa`: Setup manifest, icons, installability, precache app shell, and navigation offline fallback.
- [x] 2.2 Exclude API calls (`POST`, `PUT`, `PATCH`, `DELETE`, `/api/*`) and Supabase/Auth endpoints from Workbox runtime cache. 

## 3. Core Sync Logic & Canonical Hashing

- [x] 3.1 Implement Canonical Hash function (fields: `diaryId, activityType, content, diaryDate, cropType, imageDigests`). Apply NFC, ISO UTC, strict A-Z sorting, UTF-8, and SHA-256 lowercase hex.
- [x] 3.2 Implement `CreateDiary.tsx` offline flow: `storage.estimate()`, catch `QuotaExceededError`, `storage.persist()`, resize/compress image, save IDB FIRST (`pending`), then trigger sync.
- [x] 3.3 Implement Atomic Global Lock fallback in `SyncEngine.ts`: Use a `readwrite` IDB transaction to claim lease ONLY if absent/expired. Emit heartbeats. Release if `ownerId` matches.
- [x] 3.4 Implement stale `syncing` recovery: If `syncStartedAt < Date.now() - 5 * 60 * 1000`, reset draft to `pending`.

## 4. User Isolation & UI Deduplication

- [x] 4.1 Filter all IDB draft queries by the active `userId`. Stop sync on logout. Do NOT auto-clear drafts.
- [x] 4.2 Update `DiaryHistory.tsx` to explicitly render `sync_confirming` items from IDB.
- [x] 4.3 After remote query resolves (expecting `logId` and `idempotencyKey` in response), delete IDB draft once confirmed present remotely.

## 5. Test Matrix (Frontend)

- [x] 5.1 Test: Offline save flow persists to IDB first before network request.
- [x] 5.2 Test: Canonical hash EXACTLY matches the shared JSON fixture.
- [x] 5.3 Test: IDB global lease `sync_metadata` uses atomic claim and heartbeat.
- [x] 5.4 Test: Stale `syncing` draft (> 5 mins) automatically recovers to `pending`.
- [x] 5.5 Test: User A drafts do not sync or display when logged in as User B. Logout does not clear drafts.
- [x] 5.6 Test: 200/201 transitions to `sync_confirming` and is NOT deleted until remote confirms via `logId`.
- [x] 5.7 Test: Edit draft creates new key + hash.
