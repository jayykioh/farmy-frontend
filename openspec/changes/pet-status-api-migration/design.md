## Context

FarmDiaries AI has a virtual pet mascot ("Bé Thóc") whose mood, streak, XP, and level are computed server-side by `PetService` in the NestJS backend. The backend exposes two HTTP endpoints:

| Endpoint | Status | Response shape |
|---|---|---|
| `GET /api/v1/pet/status` | ✅ Current | camelCase `PetStatusResponse` |
| `GET /api/v1/pet/state` | ⚠️ Deprecated | same data + `bubble_message` alias |

The frontend has a clean `features/pet/` module that already calls `/pet/status` via React Query (`usePetStatus()`). However, five files bypass this module and call `/pet/state` via an RTK Query hook (`useGetPetStateQuery()`). Because the RTK hook expects snake_case field names (`streak_count`, `xp`, `mood_reason`, etc.) while the actual API now returns camelCase, those pages show broken values. The task is to complete the in-progress migration: remove the RTK pet hook, redirect all consumers to `usePetStatus()`, and add cross-store invalidation so the React Query cache stays fresh after RTK mutations.

---

## Goals / Non-Goals

**Goals:**
- Single source of truth for pet data in the frontend: `usePetStatus()` → `GET /api/v1/pet/status`
- All UI fields rendered from the canonical `PetStatus` camelCase interface
- Pet cache invalidated after any mutation that changes pet state (complete reminder, create diary log)
- Deprecated hooks and types removed from active code paths
- Zero backend changes required

**Non-Goals:**
- Migrating other RTK Query endpoints to React Query (diaries, reminders, plots remain in RTK)
- Adding new pet features (equip items, shop, XP bonuses)
- Changing the `/pet/status` API contract
- Removing the `@deprecated` backend `/pet/state` endpoint (can be done later by backend team)

---

## Decisions

### Decision 1 — Replace in-place, no adapter layer

**Choice:** Migrate each consumer directly to `usePetStatus()` and remap field names at the call site.

**Rationale:** Scope is small (5 files, ~30 field references). An adapter hook that returns snake_case internally would hide the bug without fixing the contract mismatch, creating a second migration later. Direct replacement finishes the job cleanly.

**Alternative considered:** `usePetState()` adapter returning snake_case from `/pet/status` internally — rejected because it perpetuates the wrong mental model and delays cleanup.

---

### Decision 2 — React Query key standardized to `['pet', 'status']`

**Current state:** `usePetStatus.ts` uses `['pet-status']` (single-segment string key).

**Choice:** Change to `['pet', 'status']` (two-segment array).

**Rationale:** React Query best practice is hierarchical array keys. `['pet']` alone can be used to invalidate all pet-related queries at once (e.g., future `['pet', 'events']`). Also aligns with how TanStack recommends scoped invalidation (`invalidateQueries({ queryKey: ['pet'] })` would catch both).

**Impact:** Update key in `usePetStatus.ts` and all `queryClient.invalidateQueries` call sites.

---

### Decision 3 — Cross-store invalidation via a dedicated helper hook

**Problem:** RTK Query mutations (complete reminder, create diary log) live in `farmApi.ts`. They currently invalidate RTK's `'Pet'` tag, which no longer does anything useful since React Query is the actual pet data store.

**Choice:** Create `src/features/pet/hooks/useInvalidatePetStatus.ts` — a single-purpose hook that returns a stable callback:

```ts
export function useInvalidatePetStatus() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['pet', 'status'] }),
    [queryClient]
  );
}
```

Call sites (`Reminders.tsx`, `CreateDiary.tsx`) call this after a successful RTK mutation via `.unwrap().then(invalidate)`.

**Rationale:** Keeps the bridge logic in one place. No need to wrap RTK mutations themselves. The hook is reusable and testable independently.

**Alternative considered:** Wrapping each RTK mutation in a custom hook that internally calls invalidate — rejected as unnecessary complexity for this migration scope.

**Alternative considered:** Removing RTK entirely for reminders/diaries — out of scope; too large a change.

---

### Decision 4 — Deprecation trail, not hard deletion, for legacy types

**Choice:**
- `PetState` (snake_case) in `src/api/farm.ts` → keep type but add JSDoc `@deprecated`; remove active usages
- `getPetState` function in `src/api/farm.ts` → same
- `src/api/pet.ts → fetchPetState` → already marked `@deprecated`, no active usages remain after migration
- `farmApi.ts → getPetState endpoint` → **fully remove** (endpoint + `useGetPetStateQuery` export)

**Rationale:** Keeping deprecated types with JSDoc preserves type history without forcing a big-bang deletion. The RTK endpoint itself is removed because it is the root of the bug.

---

### Decision 5 — Field mapping reference (xp → exp)

The most subtle field name change is `xp` (snake_case API v1) → `exp` (camelCase `PetStatus`). All UI labels still display "XP" to users, but the field accessed in code must be `.exp`.

Full mapping table:

| Old (snake_case) | New (camelCase) | Note |
|---|---|---|
| `mood` | `mood` | unchanged |
| `streak_count` | `streakCount` | |
| `level` | `level` | unchanged |
| `xp` | `exp` | ⚠️ different name |
| `bubble_message` | `bubbleMessage` | |
| `mood_reason` | `moodReason` | |
| — | `previousMood` | new, optional |
| — | `missedDays` | new, optional |
| — | `lastDiaryDate` | new, optional |

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Missed field rename (`xp → exp`)** causes silent `undefined` in UI | Spec document lists all 9 field mappings; tasks include explicit find-replace verification |
| **Invalidation race condition** — mutation succeeds but invalidation fires before server recalculates mood | `/pet/status` recalculates mood on every call (confirmed in `pet.service.ts`), so any refetch after write gets fresh data |
| **RTK `'Pet'` tag invalidation becomes a no-op** after migration | Remove `providesTags: ['Pet']` and `invalidatesTags: [{ type: 'Pet' }]` from farmApi simultaneously; `useInvalidatePetStatus` replaces this signal |
| **Home.tsx dual-fetch becomes a single fetch** — previously two cache entries, now one | Lower memory usage, one fewer network request; only positive effect |
| **TypeScript catches missed usages** if `useGetPetStateQuery` is deleted before all consumers are migrated | Delete export last, after all consumers are migrated; compiler errors will surface any missed usages |

---

## Migration Plan

The migration is entirely frontend-only and non-breaking (no API changes). Safe to merge to main without a feature flag.

**Sequence:**
1. Update `usePetStatus.ts` query key → `['pet', 'status']`
2. Create `useInvalidatePetStatus.ts` helper
3. Migrate `Home.tsx` (already partially done — remove dual fetch, consolidate)
4. Migrate `Sidebar.tsx` (smallest consumer)
5. Migrate `Profile.tsx`
6. Migrate `Shop.tsx`
7. Migrate `Reminders.tsx` + wire `useInvalidatePetStatus` after `completeReminder`
8. Wire `useInvalidatePetStatus` in `CreateDiary.tsx` after diary log creation
9. Remove `getPetState` endpoint from `farmApi.ts` + `useGetPetStateQuery` export
10. Remove `'Pet'` tag references from `farmApi.ts`
11. Deprecate `PetState` type and `getPetState` function in `src/api/farm.ts`
12. Verify TypeScript compiles clean (`tsc --noEmit`)

**Rollback:** Any single step is independently revertable. No data migrations, no server deploys needed.

---

## Open Questions

- None blocking implementation. All decisions above are settled by the user's confirmed direction.
