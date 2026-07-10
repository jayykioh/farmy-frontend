## MODIFIED Requirements

### Requirement: Pet module frontend contract
The frontend SHALL use exclusively `PetStatus` (camelCase) from `src/features/pet/types/pet.types.ts` as the data contract for all pet mascot display. The deprecated `PetState` (snake_case) type SHALL NOT be used in active UI components.

The canonical `PetStatus` interface is:
```typescript
export interface PetStatus {
  mood: PetMood;
  previousMood?: PetMood;
  streakCount: number;
  level: number;
  exp: number;                      // ⚠️ NOT xp
  lastDiaryDate?: string | null;
  missedDays?: number;
  moodReason?: string;
  bubbleMessage: string;
  updatedAt?: string;
}
```

#### Scenario: Pet mood displayed on Home page
- **WHEN** the Home page renders
- **THEN** it SHALL use `petStatus?.mood` (from `usePetStatus()`) for mascot state
- **THEN** it SHALL use `petStatus?.bubbleMessage` for the speech bubble text
- **THEN** it SHALL use `petStatus?.streakCount` for the streak badge
- **THEN** it SHALL NOT reference `petState?.mood_reason` from `useGetPetStateQuery()`

#### Scenario: Pet level and XP displayed on Profile page
- **WHEN** the Profile page renders
- **THEN** it SHALL use `petStatus?.level` and `petStatus?.exp` from `usePetStatus()`
- **THEN** it SHALL use `petStatus?.streakCount` for the streak display
- **THEN** it SHALL NOT use `petState?.xp` or `petState?.streak_count`

#### Scenario: Pet mood displayed on Shop page
- **WHEN** the Shop page renders the mascot
- **THEN** it SHALL use `petStatus?.mood` from `usePetStatus()`
- **THEN** it SHALL use `petStatus?.level` and `petStatus?.exp` for XP display
- **THEN** it SHALL NOT use `petState?.mood` from `useGetPetStateQuery()`

#### Scenario: Pet mood displayed on Reminders page
- **WHEN** the Reminders page renders
- **THEN** it SHALL use `petStatus?.mood` from `usePetStatus()` for the mascot state
- **THEN** it SHALL NOT use `petState?.mood` from `useGetPetStateQuery()`

#### Scenario: Pet level displayed in Sidebar
- **WHEN** the Sidebar renders the user footer
- **THEN** it SHALL use `petStatus?.level` from `usePetStatus()`
- **THEN** it SHALL NOT use `petState?.level` from `useGetPetStateQuery()`

## REMOVED Requirements

### Requirement: RTK Query pet state endpoint active usage
**Reason:** The RTK Query `useGetPetStateQuery()` hook (calling `/pet/state`) caused broken UI because the response fields no longer matched the expected snake_case types. The endpoint itself is deprecated on the backend. All consumers are migrated to `usePetStatus()` (React Query → `/pet/status`).

**Migration:** Replace `useGetPetStateQuery()` with `usePetStatus()` from `src/features/pet/hooks/usePetStatus`. Map field names using the canonical table in design.md.
