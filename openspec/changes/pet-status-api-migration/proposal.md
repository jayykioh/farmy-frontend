## Why

The frontend currently operates in a split state: `PetMascot` and the Home page hero use `usePetStatus()` (React Query → `/pet/status`, camelCase), while `Profile`, `Shop`, `Reminders`, and `Sidebar` still use the RTK Query hook `useGetPetStateQuery()` (→ `/pet/state`, snake_case). Because the backend's `/pet/state` response fields no longer match the snake_case `PetState` type expected by those pages, they display broken values — undefined XP, `Lv.1` always, `0-day streak`. The backend has already shipped a complete, modern `/pet/status` endpoint; the fix is to finish the frontend migration and retire the deprecated path.

## What Changes

- **Remove** `useGetPetStateQuery()` from `src/store/api/farmApi.ts` (and **deprecate** its supporting `PetState` snake_case type in `src/api/farm.ts`)
- **Migrate** all five affected files to `usePetStatus()` and the canonical `PetStatus` camelCase contract:
  - `src/pages/Home.tsx`
  - `src/pages/Profile.tsx`
  - `src/pages/Shop.tsx`
  - `src/pages/Reminders.tsx`
  - `src/components/layout/Sidebar.tsx`
- **Standardize** the React Query key for pet status to `['pet', 'status']` across the codebase
- **Bridge cross-store invalidation**: after any RTK Query mutation that affects pet state (complete reminder, create diary log), call `queryClient.invalidateQueries({ queryKey: ['pet', 'status'] })` so the React Query cache stays fresh
- **Deprecate** `src/api/pet.ts → fetchPetState` (keep file but mark clearly, remove active usages)
- **No backend changes required** — `/pet/status` is already implemented and stable

## Capabilities

### New Capabilities

- `pet-status-wiring`: Unified frontend wiring layer — single React Query hook `usePetStatus()` as the sole data source for all mascot mood, streak, XP, and level display across the app; cross-store invalidation bridge ensuring RTK Query mutations keep React Query pet cache fresh

### Modified Capabilities

- `feature_pet`: Requirement change — frontend contract is now exclusively camelCase `PetStatus` from `/pet/status`; snake_case `PetState` and `/pet/state` are fully retired from active UI
- `api_wiring`: Pet Mascot section updated — `useGetPetStateQuery` removed, `usePetStatus` elevated to canonical; invalidation contract added for diary/reminder mutations

## Impact

**Files modified (frontend only):**
- `src/store/api/farmApi.ts` — remove `getPetState` endpoint + `useGetPetStateQuery` export
- `src/api/farm.ts` — remove or deprecate `PetState` interface and `getPetState` function
- `src/api/pet.ts` — deprecate `fetchPetState` (keep file, remove active usages)
- `src/pages/Home.tsx` — remove `useGetPetStateQuery`, consolidate onto `usePetStatus`
- `src/pages/Profile.tsx` — replace `useGetPetStateQuery` with `usePetStatus`, remap field names
- `src/pages/Shop.tsx` — replace `useGetPetStateQuery` with `usePetStatus`, remap field names
- `src/pages/Reminders.tsx` — replace `useGetPetStateQuery` with `usePetStatus`, remap field names
- `src/components/layout/Sidebar.tsx` — replace `useGetPetStateQuery` with `usePetStatus`
- `src/features/pet/hooks/usePetStatus.ts` — update query key to `['pet', 'status']`
- `src/features/pet/services/pet.api.ts` — verify/add `recalculatePetStatus` call sites
- **New file**: `src/features/pet/hooks/useInvalidatePetStatus.ts` — helper hook wrapping `queryClient.invalidateQueries`

**No backend changes.** No database migrations. No API schema changes.
