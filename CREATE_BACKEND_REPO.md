# How to Create and Bootstrap the Backend Repository

Use the prompt below in a new AI assistant session, inside a fresh backend repository folder, to bootstrap the backend of **FarmDiaries AI** according to the current requirement: **MongoDB is the primary application database**.

---

## Copy & Paste Prompt for the Backend AI Assistant

Copy the markdown block below and paste it to start building your backend repository:

```markdown
You are an expert backend engineer specializing in NestJS, TypeScript, clean architecture, MongoDB document modeling, Redis queues, and AI product backends.

We are building the backend monolithic service for **FarmDiaries AI**, a production-grade, AI-driven agricultural diary web application designed for Vietnamese farmers.

Important architecture requirement:
- MongoDB is the required primary application database.
- Do not design PostgreSQL as the primary database.
- Prefer MongoDB collections, embedded documents, change streams, TTL indexes, compound indexes, and Atlas Search / Atlas Vector Search where they fit the feature.
- Use Redis only for cache, rate limiting, locks, and BullMQ job queues.

### Tech Stack & Architecture
- **Framework:** NestJS (TypeScript, modular clean architecture, dependency injection).
- **Primary Database:** MongoDB Atlas with Mongoose or Typegoose.
- **Search & RAG:** MongoDB Atlas Vector Search for embeddings and semantic retrieval. If Atlas Vector Search is unavailable in local development, define a repository interface and provide a simple fallback adapter for tests.
- **In-Memory Cache & Queues:** Redis with BullMQ for rate limiting, job caching, reminder scheduling, and AI quota smoothing.
- **Image Processing & Storage:** Cloudflare R2 object storage with pre-signed URLs, `sharp` for image compression and validation, and pHash matching.
- **AI Providers:** Google Gemini Flash / Vision and `text-embedding-004`.
- **Notifications:** PWA Web Push, Zalo OA/ZNS, and Resend Email fallback.

### MongoDB-First Feature Mapping
- **AuthModule:** `users`, `refresh_tokens`, `oauth_nonces`, and optional `login_events`.
  - Store refresh token hashes, token family lineage, device metadata, revocation state, and expiry timestamps.
  - Add TTL index for expired refresh tokens and one-time OAuth nonce records.
- **DiaryModule:** `diary_entries`.
  - Store crop type, growth stage, notes, photo URLs, GPS/location metadata, weather snapshot, and farming action flags in one document.
  - Index `{ userId: 1, createdAt: -1 }`, `{ userId: 1, cropType: 1, createdAt: -1 }`.
- **PetModule:** `pet_states` and optional `pet_events`.
  - Store the current pet state as one document per user.
  - Append behavior/milestone events separately only when audit/history is needed.
- **PlantScanModule:** `plant_scans`.
  - Store image metadata, pHash, diagnosis JSON, safety warnings, crop type, model version, and cache expiry.
  - Index `{ userId: 1, createdAt: -1 }`, `{ pHash: 1, createdAt: -1 }`, and TTL for short-lived cache records if required.
- **ChatModule:** `chat_sessions`.
  - Store a session document with bounded embedded `messages`; archive or split messages if a session grows too large.
  - Add TTL index for temporary chat history if privacy rules require deletion after 90 days.
- **RAGModule:** `knowledge_chunks` and `memory_embeddings`.
  - Store text chunks, source metadata, embedding vector, crop category, region, quality score, and citations.
  - Use Atlas Vector Search indexes for semantic retrieval.
- **ReminderModule / NotificationModule:** `reminders`, `notification_subscriptions`, `notification_logs`.
  - Store scheduled reminders in MongoDB; use BullMQ for execution, retry, backoff, and delayed jobs.
- **InsightModule:** `weekly_insights`.
  - Store generated insights, source diary IDs, model metadata, delivery status, and user feedback.
- **Audit & Events:** `audit_logs` and `user_events`.
  - Use append-only documents, TTL where appropriate, and strict redaction for sensitive fields.

### Key Backend Modules to Scaffold
1. **AuthModule:** JWT-based stateless authentication with 15m access tokens, 30d rotating refresh tokens in secure cookies, and Zalo OA OAuth integration.
2. **DiaryModule:** CRUD for daily farming logs, weather snapshots, image references, offline sync conflict handling, and crop milestones.
3. **PetModule:** Rules-based virtual pet companion calculating streak metrics and mood transitions (`happy`, `neutral`, `sad`, `worried`, `excited`).
4. **PlantScanModule:** Image uploads, Sharp.js image verification, Gemini Vision disease diagnosis, pHash duplicate detection, and Vietnam pesticide/PHI warnings.
5. **ChatModule & RAGModule:** RAG-powered chatbot using `text-embedding-004`, MongoDB Atlas Vector Search, citation metadata, and prompt-injection defenses.
6. **NotificationModule & ReminderModule:** Multi-channel notification pipeline with PWA Web Push, Zalo OA/ZNS messages, Resend Email fallback, and BullMQ scheduling.
7. **InsightModule:** Weekly farm insights generated from diary entries, plant scans, and chat context with AI quota spreading.

### Instructions for Bootstrapping
1. Initialize a new NestJS project.
2. Configure Mongoose or Typegoose for MongoDB Atlas.
3. Configure Redis and BullMQ.
4. Scaffold this folder structure:
   ```
   src/
   |-- common/             # guards, filters, interceptors, pipes, decorators
   |-- config/             # env validation, mongo, redis, r2, gemini, zalo config
   |-- database/           # mongoose connection, plugins, index setup, transactions helpers
   `-- modules/
       |-- auth/
       |-- users/
       |-- diary/
       |-- pet/
       |-- plant-scan/
       |-- chat/
       |-- rag/
       |-- reminders/
       |-- notifications/
       `-- insights/
   ```
5. Create Mongoose schemas, DTOs, repository interfaces, service classes, controllers, and e2e test skeletons.
6. Configure ESLint, Prettier, `.env.example`, and docker-compose for local development containing:
   - MongoDB
   - Redis
7. Implement initial endpoint specs, types, and DTOs according to the OpenSpec documents.
8. Add a short `docs/data-model.md` explaining collection ownership, indexes, TTL policies, and which features use MongoDB transactions.

Let's begin by initializing the project shell and setting up the configurations.
```

---

## Backend Project Structure Recommendations

When initializing the backend repository, copy the `openspec/` folder from this frontend repo into the backend repo. Start with:

- `openspec/specs/mongodb_stack_analysis.md`
- `openspec/specs/core_features_spec.md`
- `openspec/specs/auth_spec.md`
- `openspec/specs/ai_chat_spec.md`
- `openspec/specs/architecture.md`

Treat `mongodb_stack_analysis.md` as the source of truth when older specs still mention PostgreSQL or pgvector.
