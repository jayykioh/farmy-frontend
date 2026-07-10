## MODIFIED Requirements

### Requirement: Pet Mascot Module endpoint usage
The frontend SHALL call `GET /api/v1/pet/status` as the canonical endpoint for pet mascot state. The deprecated `GET /api/v1/pet/state` endpoint SHALL NOT be called by any active UI component or query hook.

Response type expected by frontend:
```typescript
// GET /api/v1/pet/status → PetStatus (camelCase)
{
  mood: 'happy' | 'excited' | 'neutral' | 'sad' | 'worried' | 'sleepy' | 'hungry';
  previousMood?: PetMood;
  streakCount: number;
  level: number;
  exp: number;
  lastDiaryDate?: string | null;
  missedDays?: number;
  moodReason?: string;
  bubbleMessage: string;
  updatedAt?: string;
}
```

#### Scenario: Frontend calls /pet/status exclusively
- **WHEN** any component needs pet state data
- **THEN** the HTTP request SHALL target `GET /api/v1/pet/status`
- **THEN** no active component SHALL make requests to `GET /api/v1/pet/state`

#### Scenario: Reminder completion invalidates pet status
- **WHEN** `PATCH /reminders/:id/complete` returns 2xx
- **THEN** the frontend SHALL invalidate its pet status cache
- **THEN** a background refetch of `GET /api/v1/pet/status` SHALL be triggered
- **THEN** the mascot SHALL reflect the updated mood on next render

#### Scenario: Diary log creation invalidates pet status
- **WHEN** `POST /diaries/:diaryId/logs` returns 2xx
- **THEN** the frontend SHALL invalidate its pet status cache
- **THEN** a background refetch of `GET /api/v1/pet/status` SHALL be triggered
- **THEN** the mascot streak and mood SHALL update on next render

## REMOVED Requirements

### Requirement: Snake_case pet API contract (GET /pet/state)
**Reason:** The `/pet/state` endpoint is marked `@deprecated` in the backend (`pet.controller.ts`). Its snake_case response fields (`streak_count`, `xp`, `mood_reason`, `bubble_message`) caused UI bugs when the frontend's `PetState` type drifted from the actual response. The camelCase `/pet/status` endpoint is the canonical replacement.

**Migration:** All API calls to `/pet/state` are replaced by calls to `/pet/status`. The `getPetState` RTK endpoint in `farmApi.ts` is removed. The `useGetPetStateQuery` hook is deleted. The `PetState` type in `src/api/farm.ts` is marked `@deprecated`.
