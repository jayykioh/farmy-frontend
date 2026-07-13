## Context

The frontend application is moving towards an offline-first architecture for diary creation. Asynchronous syncing introduces edge cases: concurrent sync loops, duplicate items in UI during transitions, request mutations, and stale syncing locks. 

## Goals / Non-Goals

**Goals:**
- Reliable offline storage using IndexedDB (`idb`).
- Single-flight synchronization with `navigator.locks` and a global atomic IDB lease fallback (`sync_metadata` store).
- Safe deduplication in UI (preventing items from disappearing during the remote fetch gap using a `sync_confirming` state).
- Exact agreement on canonical hashing with the backend to ensure payload integrity.
- Safe cross-user boundary (logout stops sync and hides drafts, scoped by user_id).

**Non-Goals:**
- Using Workbox runtime cache as a DB (Service Worker is only for static assets/fallback).
- Background Sync API (Workbox sync is out of scope/optional).

## Decisions

1. **Storage: IndexedDB (via `idb`)**
   - *Rationale*: We use `idb` with two stores:
     1. `offline_diary_drafts`: Schema includes `SyncStatus` (`draft`, `pending`, `syncing`, `failed_retryable`, `failed_permanent`, `sync_confirming`).
     2. `sync_metadata`: Schema holds global sync locks (e.g., `key: 'diary-sync', ownerId, leaseUntil, heartbeatAt`). 

2. **Single-flight App-level Sync Engine**
   - *Rationale*: Protected primarily by `navigator.locks` with fallback to the global `sync_metadata` store using an atomic `readwrite` transaction (claim if absent/expired, heartbeat during sync, release at end if owner matches). 
   - *Recovery*: If a draft is stuck in `syncing` for >5 minutes (`syncStartedAt < now - 5 mins`), it is recovered back to `pending`.

3. **User Isolation & Logout**
   - *Rationale*: Drafts are strictly scoped by `userId`. Logout stops the sync engine and hides drafts, but does NOT auto-clear them. User A's drafts will not sync or display when User B logs in.

4. **UI Deduplication & The `sync_confirming` State**
   - *Rationale*: When sync succeeds (200/201), the status becomes `sync_confirming` and stores `serverLogId`. `DiaryHistory` MUST continue rendering `sync_confirming` items (deduped by ID) to prevent UI flashing. The local draft is ONLY deleted after the remote refetch confirms the `serverLogId` (or `idempotencyKey`) is present. This requires the `DiaryHistory` API to explicitly expose `logId`.

5. **Edit Draft Mutations**
   - *Rationale*: When a user edits ANY draft, generate BOTH a new `idempotencyKey` and a new `requestHash`.
