## 1. Foundation — Hook & Query Key

- [x] 1.1 Update `src/features/pet/hooks/usePetStatus.ts`: change `queryKey` from `['pet-status']` to `['pet', 'status']`
- [x] 1.2 Create `src/features/pet/hooks/useInvalidatePetStatus.ts`: export hook that returns `useCallback(() => queryClient.invalidateQueries({ queryKey: ['pet', 'status'] }), [queryClient])`
- [x] 1.3 Verify `src/features/pet/services/pet.api.ts` `fetchPetStatus` hits `/pet/status` (confirm, no change expected)
- [x] 1.4 Create `PET_STATUS_FALLBACK` constant in `src/features/pet/types/pet.types.ts` with default values (mood: 'neutral', streakCount: 0, level: 1, exp: 0, bubbleMessage: 'Chào chủ vườn!')


## 2. Page Migration — Remove useGetPetStateQuery, Add usePetStatus

- [x] 2.1 **Home.tsx**: Remove `useGetPetStateQuery` import and `petState` variable; remove duplicate `usePetStatus` import if already present; replace `petState?.mood_reason` (line ~108) with `petStatus?.moodReason`; use `PET_STATUS_FALLBACK` during loading/error.
- [x] 2.2 **Sidebar.tsx**: Replace `useGetPetStateQuery` with `usePetStatus`; rename `petState` → `petStatus`; update `petState?.level` → `petStatus?.level`; use `PET_STATUS_FALLBACK`.
- [x] 2.3 **Profile.tsx**: Replace `useGetPetStateQuery` with `usePetStatus`; rename all references: `petState?.level` → `petStatus?.level`, `petState?.xp` → `petStatus?.exp`, `petState?.streak_count` → `petStatus?.streakCount`; update `isLoading` name if renamed; use `PET_STATUS_FALLBACK`.
- [x] 2.4 **Shop.tsx**: Replace `useGetPetStateQuery` with `usePetStatus`; remap: `petState?.level` → `petStatus?.level`, `petState?.xp` → `petStatus?.exp`, `petState?.mood` → `petStatus?.mood`; use `PET_STATUS_FALLBACK`.
- [x] 2.5 **Reminders.tsx**: Replace `useGetPetStateQuery` with `usePetStatus`; remap `petState?.mood` → `petStatus?.mood`; remove unused `petLoading` if not used elsewhere; use `PET_STATUS_FALLBACK`.

## 3. Cross-Store Invalidation Wiring

- [x] 3.1 **Reminders.tsx**: Import `useInvalidatePetStatus`; call `invalidatePetStatus()` in the `completeReminder` handler after `.unwrap()` resolves successfully
- [x] 3.2 **CreateDiary.tsx (or diary log creation component)**: Import `useInvalidatePetStatus`; call `invalidatePetStatus()` after `createDiaryLog` mutation `.unwrap()` resolves — verify which file handles diary log submission
- [x] 3.3 Confirm no other mutation sites need invalidation (check `useCreateDiaryMutation` call sites — diary creation also triggers `updateStreakAndMoodOnDiaryCreated` on backend)

## 4. RTK Pet Endpoint Cleanup

- [x] 4.1 **farmApi.ts**: Remove the `getPetState` builder endpoint block (lines ~120–125)
- [x] 4.2 **farmApi.ts**: Remove `useGetPetStateQuery` from the export destructure (line ~141)
- [x] 4.3 **farmApi.ts**: Remove `{ type: 'Pet' }` from `useCompleteReminderMutation` `invalidatesTags` array
- [x] 4.4 **farmApi.ts**: Remove `'Pet'` from the `TagTypes` array in `baseApi` (if defined there — check `src/store/api/baseApi.ts`)

## 5. Deprecation Annotations

- [x] 5.1 **src/api/farm.ts**: Add `/** @deprecated Use PetStatus from src/features/pet/types/pet.types.ts */` JSDoc to `PetState` interface
- [x] 5.2 **src/api/farm.ts**: Add `/** @deprecated Use fetchPetStatus from src/features/pet/services/pet.api.ts */` JSDoc to `getPetState` function
- [x] 5.3 **src/api/pet.ts**: Verify `fetchPetState` already has `@deprecated` annotation (line ~19–20); add if missing

## 6. Verification

- [x] 6.1 Run `npx tsc --noEmit` — fix any TypeScript errors surfaced by removing `useGetPetStateQuery`
- [x] 6.2 Grep for remaining `useGetPetStateQuery` usages: `grep -r "useGetPetStateQuery" src/` — expect zero results
- [x] 6.3 Grep for `pet/state` in API calls: `grep -r "pet/state" src/` — expect zero active usages. (Note: grep `pet/state` is allowed only in deprecated compatibility functions with `@deprecated` JSDoc. No page, hook, RTK endpoint, or active component may call `/pet/state`).
- [x] 6.4 Grep for remaining `petState?.xp` or `petState?.streak_count` or `petState?.mood_reason`: expect zero
- [x] 6.5 Grep for old query key: `grep -r "pet-status" src/` — expect zero
- [x] 6.6 Manual smoke test: load Home, Profile, Shop, Reminders, Sidebar — confirm streak, XP, level, mood all display correctly (non-zero/non-undefined values when logged in)
- [x] 6.7 Manual smoke test: complete a reminder → verify mascot mood updates after the action
- [x] 6.8 Manual smoke test: create a diary log → verify streak increments and mascot reflects new mood
