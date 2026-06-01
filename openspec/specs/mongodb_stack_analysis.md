# FarmDiaries AI - MongoDB-First Stack & Feature Analysis

## 1. Decision

FarmDiaries AI should use **MongoDB as the primary application database** because the product is centered on user-owned activity streams, flexible AI outputs, image scan metadata, chat sessions, reminders, and event logs. These domains fit document modeling better than a rigid relational-first model.

PostgreSQL and pgvector should not be part of the default backend requirement. If the team later needs relational reporting or another specialized store, add it behind repository interfaces after the MongoDB implementation is stable.

## 2. Recommended Stack

| Layer | Recommended stack | Reason |
|---|---|---|
| Frontend | React, Vite, TypeScript, Tailwind, PWA | Existing frontend stack; strong offline-first fit for farmers using mobile devices. |
| Backend | NestJS, TypeScript | Modular structure, DI, guards, pipes, testing, and clear ownership per feature module. |
| Primary DB | MongoDB Atlas | Required database; good fit for nested diary, chat, scan, reminder, and AI documents. |
| ODM | Mongoose or Typegoose | Mature NestJS integration, schema validation, indexes, hooks, and transaction support. |
| Vector search | MongoDB Atlas Vector Search | Keeps RAG documents, metadata, and embeddings in the same database. |
| Queue/cache | Redis + BullMQ | Rate limiting, delayed reminders, AI quota smoothing, retries, and background jobs. |
| Object storage | Cloudflare R2 | Low-cost private image storage with signed URLs. |
| Image pipeline | Sharp + file-type + pHash | Compression, blur/magic-byte validation, duplicate detection. |
| AI | Gemini Flash, Gemini Vision, text-embedding-004 | Chat, plant diagnosis, weekly insights, and embeddings. |
| Notifications | Web Push, Zalo OA/ZNS, Resend | Practical channels for Vietnamese farmers and fallback delivery. |
| Observability | Pino, Sentry, OpenTelemetry optional | Structured logs, error tracking, and production diagnostics. |

## 3. Why MongoDB Fits This Product

MongoDB is a strong default here because most records are aggregate documents owned by one user and read as a whole:

- A diary entry naturally contains crop info, notes, action flags, weather snapshot, image URLs, and location metadata.
- A plant scan contains image metadata, pHash, AI diagnosis JSON, warnings, model version, and cache fields.
- A chat session contains messages, citations, safety flags, and AI metadata.
- A pet state is one current document per user, with optional event history.
- Reminders and notification logs need flexible channel-specific payloads.
- AI features produce evolving JSON structures that should not require migrations for every prompt change.

MongoDB tradeoffs to manage:

- Cross-document transactions should be limited to flows that truly need atomicity, such as register user + initial pet state + refresh token.
- Many-to-many analytics should be modeled with denormalized read models or aggregation pipelines instead of heavy joins.
- Index design must be explicit from the start because query patterns are user/time based.
- Very large chat sessions should be split or archived before hitting MongoDB document size limits.

## 4. Feature-to-Collection Mapping

| Feature | Main collections | Data shape |
|---|---|---|
| Auth | `users`, `refresh_tokens`, `oauth_nonces` | User profile, auth provider links, token hash lineage, nonce TTL. |
| Diary | `diary_entries` | User-owned farm log document with embedded weather, photos, location, and action flags. |
| Pet | `pet_states`, `pet_events` | One current state per user; optional append-only history for milestones. |
| Plant scan | `plant_scans` | Image metadata, pHash, diagnosis JSON, model metadata, safety warnings. |
| AI chat | `chat_sessions` | Session document with bounded messages, citations, and AI safety metadata. |
| RAG | `knowledge_chunks`, `memory_embeddings` | Text chunks, source metadata, embeddings, crop/region tags, citations. |
| Reminders | `reminders` | Scheduled job definition, status, retry metadata, channel preference. |
| Notifications | `notification_subscriptions`, `notification_logs` | Push/Zalo/email destination data and delivery outcomes. |
| Insights | `weekly_insights` | Generated weekly report, source IDs, delivery state, user feedback. |
| Audit/events | `audit_logs`, `user_events` | Append-only compliance records and product analytics events. |

## 5. Core Index Plan

```ts
// users
{ email: 1 }, { unique: true, sparse: true }
{ zaloUserId: 1 }, { unique: true, sparse: true }

// refresh_tokens
{ userId: 1, createdAt: -1 }
{ tokenHash: 1 }, { unique: true }
{ expiresAt: 1 }, { expireAfterSeconds: 0 }

// diary_entries
{ userId: 1, createdAt: -1 }
{ userId: 1, cropType: 1, createdAt: -1 }
{ userId: 1, isDeleted: 1, createdAt: -1 }

// pet_states
{ userId: 1 }, { unique: true }
{ nextReminderAt: 1 }

// plant_scans
{ userId: 1, createdAt: -1 }
{ pHash: 1, createdAt: -1 }
{ cropType: 1, diseaseKey: 1, createdAt: -1 }

// chat_sessions
{ userId: 1, updatedAt: -1 }
{ sessionId: 1 }, { unique: true }
{ expiresAt: 1 }, { expireAfterSeconds: 0 }

// reminders
{ status: 1, scheduledAt: 1 }
{ userId: 1, scheduledAt: -1 }

// knowledge_chunks / memory_embeddings
// Use Atlas Vector Search index on `embedding`.
{ cropType: 1, region: 1, qualityScore: -1 }
```

## 6. Module Design Guidance

Use repository interfaces even though MongoDB is the only required database. This keeps business services testable and prevents Mongoose query details from leaking into controllers.

Recommended pattern per module:

```txt
modules/diary/
  dto/
  schemas/
  repositories/
  services/
  controllers/
  diary.module.ts
```

Service rules:

- Controllers validate transport input and call services only.
- Services own business decisions and emit domain events.
- Repositories own MongoDB queries, projection, pagination, and transactions.
- Background workers consume events and update derived data such as pet mood, weekly insights, and notification logs.

## 7. MongoDB Transactions

Use MongoDB transactions only for short, important workflows:

- Register user, create initial `pet_states`, and store first refresh token.
- Rotate refresh token and revoke the previous token in the same token family.
- Create diary entry and update pet state when the UI requires both changes to appear atomically.
- Delete account and mark owned documents as deleted/anonymized.

Avoid long transactions around AI calls, image uploads, email/Zalo sends, or BullMQ jobs. Persist a pending record first, perform the external call, then update status.

## 8. RAG Without PostgreSQL

Use MongoDB Atlas Vector Search for RAG:

1. Normalize source documents into `knowledge_chunks`.
2. Generate embeddings with `text-embedding-004`.
3. Store the vector and metadata in the same chunk document.
4. Query top-k chunks with Atlas Vector Search.
5. Filter by crop type, region, source quality, and safety classification.
6. Return citations from stored metadata.

If local development cannot run Atlas Vector Search, keep the RAG repository interface and implement a deterministic test adapter that returns seeded chunks.

## 9. Suggested Implementation Priority

| Priority | Work item | Reason |
|---|---|---|
| P0 | NestJS project, config validation, MongoDB connection, Redis connection | Foundation. |
| P0 | Auth, users, refresh token rotation | Required for every protected feature. |
| P0 | Diary CRUD and image URL contract | Core user workflow and source data for insights. |
| P0 | Pet state engine | Product retention loop. |
| P1 | Plant scan pipeline | High-value AI feature, but depends on R2 and Gemini. |
| P1 | Chat and RAG collections | AI assistant and knowledge retrieval. |
| P1 | Reminder/notification workers | Engagement and farming task support. |
| P2 | Weekly insights | Useful once diary and scan data exist. |
| P2 | Audit/event analytics | Improves operations and future product decisions. |

## 10. Final Recommendation

Choose a **MongoDB-first NestJS backend**:

- MongoDB Atlas for all primary data and vector search.
- Mongoose/Typegoose for schemas and indexes.
- Redis/BullMQ for asynchronous execution.
- Cloudflare R2 for images.
- Gemini for AI.

This keeps the project aligned with the MongoDB requirement while still supporting the product's AI, PWA, notification, and gamification features cleanly.
