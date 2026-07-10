## ADDED Requirements

### Requirement: Single canonical pet data source
The frontend SHALL retrieve all pet mascot data (mood, streak, XP, level, bubble message) exclusively from `GET /api/v1/pet/status` via the `usePetStatus()` React Query hook. No other hook, function, or RTK endpoint SHALL be used as the primary source for pet display data.

#### Scenario: Page loads and renders pet data
- **WHEN** any page or component that displays pet mood, streak, XP, or level mounts
- **THEN** it SHALL source its data from `usePetStatus()` returning `PetStatus`
- **THEN** it SHALL NOT call `useGetPetStateQuery()` or `GET /api/v1/pet/state`

#### Scenario: Pet data unavailable during initial load
- **WHEN** `usePetStatus()` is in loading or error state
- **THEN** the UI SHALL render fallback values: `mood = 'neutral'`, `streakCount = 0`, `level = 1`, `exp = 0`, `bubbleMessage = 'Chào chủ vườn!'`
- **THEN** the UI SHALL NOT crash or render `undefined` as text

---

### Requirement: Canonical PetStatus camelCase contract
The frontend type `PetStatus` SHALL be the single authoritative interface for pet data. All component props, local variables, and destructured values SHALL use camelCase field names.

#### Scenario: Field name mapping is enforced
- **WHEN** a developer accesses pet streak data
- **THEN** they SHALL use `petStatus.streakCount` (NOT `petState.streak_count`)

#### Scenario: XP field name used correctly
- **WHEN** a developer accesses pet experience points
- **THEN** they SHALL use `petStatus.exp` (NOT `petStatus.xp` or `petState.xp`)
- **THEN** any UI label displaying the value MAY still read "XP" to users, but the field accessor MUST be `.exp`

#### Scenario: Bubble message field name used correctly
- **WHEN** a developer accesses the speech bubble text
- **THEN** they SHALL use `petStatus.bubbleMessage` (NOT `petState.bubble_message`)

---

### Requirement: Standardized React Query key
The React Query key for pet status SHALL be `['pet', 'status']` (two-segment array).

#### Scenario: Query key consistency across codebase
- **WHEN** `usePetStatus()` is defined
- **THEN** its `queryKey` SHALL be `['pet', 'status']`

#### Scenario: Invalidation uses consistent key
- **WHEN** any code invalidates the pet status cache
- **THEN** it SHALL call `queryClient.invalidateQueries({ queryKey: ['pet', 'status'] })`
- **THEN** it SHALL NOT use the old key `['pet-status']`

---

### Requirement: Cross-store invalidation after pet-affecting mutations
The system SHALL invalidate the React Query pet status cache after any RTK Query mutation that causes the backend to recalculate pet state.

#### Scenario: Complete reminder triggers pet cache invalidation
- **WHEN** `useCompleteReminderMutation` succeeds (`.unwrap()` resolves)
- **THEN** `queryClient.invalidateQueries({ queryKey: ['pet', 'status'] })` SHALL be called
- **THEN** `usePetStatus()` SHALL refetch and return the updated mood/XP within the next render cycle

#### Scenario: Create diary log triggers pet cache invalidation
- **WHEN** `useCreateDiaryLogMutation` succeeds (`.unwrap()` resolves)
- **THEN** `queryClient.invalidateQueries({ queryKey: ['pet', 'status'] })` SHALL be called
- **THEN** `usePetStatus()` SHALL refetch and return the updated streak/mood

#### Scenario: Mutation fails — no spurious invalidation
- **WHEN** `useCompleteReminderMutation` or `useCreateDiaryLogMutation` throws or rejects
- **THEN** pet status cache SHALL NOT be invalidated
- **THEN** displayed pet data SHALL remain unchanged

---

### Requirement: useInvalidatePetStatus helper hook
The codebase SHALL expose a single reusable hook `useInvalidatePetStatus()` that encapsulates the React Query cache invalidation call for the pet status key.

#### Scenario: Hook returns stable callback
- **WHEN** `useInvalidatePetStatus()` is called in a component
- **THEN** it SHALL return a stable function that, when called, invokes `queryClient.invalidateQueries({ queryKey: ['pet', 'status'] })`
- **THEN** the returned function SHALL be stable across re-renders (memoized via `useCallback`)

---

### Requirement: RTK pet endpoint removed from active code
The RTK Query endpoint `getPetState` and its generated hook `useGetPetStateQuery` SHALL be removed from `farmApi.ts`. The `'Pet'` RTK cache tag SHALL be removed from all `providesTags` and `invalidatesTags` declarations.

#### Scenario: No active consumer of useGetPetStateQuery
- **WHEN** `useGetPetStateQuery` is searched across the codebase
- **THEN** zero import or call-site results SHALL be found in non-deprecated files

#### Scenario: Pet tag removed from RTK invalidation chains
- **WHEN** `useCompleteReminderMutation` succeeds
- **THEN** it SHALL NOT attempt to invalidate a `'Pet'` RTK tag
- **THEN** pet data refresh SHALL be handled exclusively via React Query invalidation

---

### Requirement: Legacy types marked deprecated, not deleted
The snake_case types `PetState` (in `src/api/farm.ts`) and `fetchPetState` (in `src/api/pet.ts`) SHALL be marked with `@deprecated` JSDoc annotations. They SHALL NOT be used in any actively rendered component.

#### Scenario: Deprecated type has JSDoc annotation
- **WHEN** a developer views `PetState` in `src/api/farm.ts`
- **THEN** it SHALL have a JSDoc `@deprecated` comment referencing `PetStatus` as the replacement

#### Scenario: No UI component imports deprecated types
- **WHEN** any page or UI component renders pet data
- **THEN** it SHALL import from `src/features/pet/types/pet.types` (PetStatus)
- **THEN** it SHALL NOT import `PetState` from `src/api/farm.ts` for rendering purposes
