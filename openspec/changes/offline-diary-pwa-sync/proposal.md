## Why

Farmy users often work in the field where internet connectivity is poor or nonexistent. When they create a diary entry (often with photos), failing to save due to network issues causes frustration and data loss. This change enables true offline-first diary creation so users can log their work reliably anywhere.

## What Changes

- Configure `vite-plugin-pwa` for manifest, app shell, and offline fallback (excluding any API/POST requests).
- Implement an IndexedDB-based durable storage queue using `idb` for offline diary drafts and images.
- Build a single-flight app-level Sync Engine that orchestrates queue processing upon app startup, login, and `online` events, protected by `navigator.locks`.
- Update `DiaryHistory` to display pending offline drafts with clear visual indicators and perform deduplication during syncs.
- **BREAKING**: Send a **required** `Idempotency-Key` and `X-Request-Hash` header with sync requests to safely retry without creating duplicates.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `feature_diary`: Add requirements for offline draft persistence, robust queue management, request hashing, and UI state deduplication.

## Impact

- `CreateDiary.tsx` and `DiaryHistory.tsx` UI flows
- New storage layer (`idb`)
- PWA setup (`vite.config.ts`, `manifest`)
- `farmApi.ts` endpoints (adding `Idempotency-Key` and `X-Request-Hash` headers)
- Cache invalidation layer (Pet, Diary)
