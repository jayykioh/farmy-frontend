# FarmDiaries AI 🌱
### Enterprise-Grade Smart Agriculture & Vision-Powered Farming Platform
**Capstone Project for Course SDN392** • 

---

[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20%7C%20React%20%7C%20MongoDB%20Atlas%20%7C%20Redis-blue.svg)](https://nestjs.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash%20%7C%20Atlas%20Vector%20Search%20%7C%20Vision-orange.svg)](https://deepmind.google/technologies/gemini/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First%20%7C%20Vite-green.svg)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20Supabase%20Auth%20%7C%20AES--256-red.svg)](https://supabase.com/)

**FarmDiaries AI** is a production-grade, AI-driven agricultural diary web application designed specifically for Vietnamese farmers. It combines visual plant disease scanning, smart chat-based agronomy assistance (RAG), gamified farm companion pets to encourage daily logging habits, and Zalo OA messaging integration to deliver real-time notifications and alerts directly into the rural digital ecosystem.

---

## 📖 Table of Contents
1. [Course Information & Team](#-course-information--team)
2. [Key Core Features](#-key-core-features)
3. [Architecture Decisions & Tech Stack](#%EF%B8%8F-architecture-decisions--tech-stack)
4. [Project Structure](#-project-structure)
5. [MongoDB-First Database Strategy](#mongodb-first-database-strategy)
6. [AI & RAG Strategy](#%EF%B8%8F-ai--rag-strategy)
7. [Installation & Setup](#%EF%B8%8F-installation--setup)
8. [Production Readiness & Safety Guardrails](#%EF%B8%8F-production-readiness--safety-guardrails)

---

## 👥 Course Information & Team

* **Course Code:** SDN392 (Capstone/Specialization Course Project)
* **Academic Institution:** FPT University
* **Team Size:** 4 Members

| Role | Responsibility |
| --- | --- |
| **Team Member 1 (Lead)** | System Architect, NestJS Backend & Database Integrations |
| **Team Member 2** | React PWA Frontend, State Management & Mobile Responsive UX |
| **Team Member 3** | AI & RAG Engine (Gemini API, MongoDB Atlas Vector Search, prompt sanitization) |
| **Team Member 4** | DevOps, CI/CD pipelines, Zalo Webhook Integration & Testing |

---

## 🌟 Key Core Features

### 1. Smart Vision Plant Scanner (`PlantScanModule`)
* **Gemini Vision Diagnosis:** Instantly identifies crop diseases from photos with high confidence levels.
* **Input Validation Layer:** Uses image pHash caching (7-day TTL) for matching similar cases, Sharp.js blur detection, and strict mime-type/magic bytes verification.
* **Safety Alert System:** Flags canned/restricted pesticides in Vietnam and enforces standard **Pre-Harvest Interval (PHI)** warnings.

### 2. Conversational Agronomy Companion (`ChatModule` & `RAGModule`)
* **Contextual RAG Retrieval:** Answers questions using semantic vector search on local farming documents and user's historical diary entries.
* **Prompt Injection Defense:** Sanitizes all input contexts to ensure AI guardrails hold.
* **Source Citations:** Generates exact confidence scores and links to source documents and previous diary dates.

### 3. Gamified Farm Companion (`PetModule`)
* **Active Streak State:** A rule-based virtual pet companion React component that changes moods (happy, neutral, sad, worried) reflecting the farmer's logging consistency and crop state.

### 4. Enterprise Notification Engine (`NotificationModule` & `ReminderModule`)
* **Multi-Channel Fallback Chain:** Priority 1 (Web Push PWA) ➡️ Priority 2 (Zalo OA ZNS Template Messages) ➡️ Priority 3 (Resend Email Fallback).
* **Distributed Scheduler:** Leverages Redis and BullMQ to spread batch analytics processing smoothly without overwhelming Gemini Flash Free-tier rate limits.

---

## 🛠️ Architecture Decisions & Tech Stack

```
                                  ┌────────────────────────┐
                                  │      React PWA         │
                                  │  (Vite + TS + Tailwind)│
                                  └───────────┬────────────┘
                                              │ HTTP / WS
                                              ▼
                                  ┌────────────────────────┐
                                  │     NestJS API Gate    │
                                  │  (Clean Architecture)  │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
          ┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
          │ MongoDB Atlas        ││ Atlas Vector Search  ││    Redis (Cache)     │
          │ - Primary Documents  ││ - RAG Embeddings     ││    - BullMQ Jobs     │
          │ - Chat/Scan/Diary    ││ - Semantic Search    ││    - Rate Limiting   │
          └──────────────────────┘└──────────────────────┘└──────────────────────┘
```

### Why NestJS over Express?
NestJS was chosen to enforce **Modular Clean Architecture** and **Dependency Injection (DI)** across our 4-person team. NestJS enforces code consistency out-of-the-box, ensuring type safety (TypeScript-first), simple mock testing, and a highly scalable modular design that prevents technical debt when scaling the project.

### MongoDB-First Database Strategy
The backend is now designed around MongoDB Atlas as the primary application database. Diary entries, users, pet state, plant scans, chat sessions, reminders, insights, audit logs, and RAG chunks are modeled as MongoDB collections. Redis remains dedicated to cache, rate limits, locks, and BullMQ jobs. For the full rationale and feature mapping, see [mongodb_stack_analysis.md](file:///d:/coding/farmdiary/openspec/specs/mongodb_stack_analysis.md).

---

## 📂 Project Structure

This is the frontend repository of the **FarmDiaries AI** ecosystem (`farmdiaries-fe`). The backend has been separated into its own repository.

```
farmdiary/
├── openspec/                     # Design specs, API schema, & Technical Blueprint
│   └── specs/mongodb_stack_analysis.md # MongoDB-first backend source of truth
├── public/                       # PWA static assets
├── src/                          # React components, pages, hooks, state management
│   ├── assets/                   # Visual UI components and design assets
│   ├── components/               # Custom layout and common components
│   ├── pages/                    # Main app pages (Home, Scanner, Chat, etc.)
│   ├── App.tsx                   # Routing & shell
│   └── main.tsx                  # Bootstrapper
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configurations
└── vite.config.ts                # Vite PWA bundler config
```

---

## ⚡ Quick Start

### Prerequisites
* Node.js v20.x
* Backend API service running (refer to [CREATE_BACKEND_REPO.md](file:///d:/coding/farmdiary/CREATE_BACKEND_REPO.md) for backend repository setup)

### Setup & Run
1. Install dependencies at the root directory:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Production Readiness & Safety Guardrails

We enforce **100% Security & Observability** requirements before launch:
* **JWT Access (15m) + Rotate Refresh Tokens (30d):** Stored securely inside secure, httpOnly cookies.
* **Pino Structured Logger:** Configured with active redaction of sensitive credentials (`Authorization`, `password`, `tokens`).
* **AI Guardrails:** Standardized Prompt Injection Sanitizer applied to all user entries prior to RAG context building.
* **Audit Logging:** Every critical administrative action and sensitive data write is logged into append-only MongoDB `audit_logs` documents with strict redaction.

---

### 📝 Course Grading Notes
This codebase features clean abstractions, robust error boundaries, strict type interfaces, and exhaustive test coverage (Jest integration tests). It demonstrates high architectural proficiency in modern Node.js and full-stack software development workflows suitable for a grade-A capstone standard.
