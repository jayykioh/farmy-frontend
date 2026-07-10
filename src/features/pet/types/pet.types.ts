// ─── Pet Mood Types ───────────────────────────────────────────────────────────

export type PetMood =
  | 'excited'
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'worried'
  | 'sleepy'
  | 'hungry';

export type PetMoodReason =
  | 'STREAK_MILESTONE'
  | 'USER_LOGGED_DIARY_TODAY'
  | 'MISSED_MULTIPLE_DAYS'
  | 'MISSED_ONE_DAY'
  | 'LATE_DAY_NO_DIARY'
  | 'NEEDS_DAILY_DIARY'
  | 'DEFAULT_STATE';

// ─── API Response Shape ───────────────────────────────────────────────────────

export interface PetStatus {
  mood: PetMood;
  previousMood?: PetMood;
  streakCount: number;
  level: number;
  exp: number;
  lastDiaryDate?: string;
  missedDays: number;
  moodReason: PetMoodReason | string;
  bubbleMessage: string;
  updatedAt?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PET_STATUS_FALLBACK: PetStatus = {
  mood: 'neutral',
  streakCount: 0,
  level: 1,
  exp: 0,
  missedDays: 0,
  moodReason: 'DEFAULT_STATE',
  bubbleMessage: 'Chào chủ vườn!',
};

// ─── UI Transition State ──────────────────────────────────────────────────────

export interface PetTransitionState {
  /** Mood currently being rendered */
  displayMood: PetMood;
  /** True during the 1000ms crossfade period */
  isTransitioning: boolean;
  /** Mood before transition started (used for exit animation) */
  transitionFrom?: PetMood;
  /** Target mood after transition completes */
  transitionTo?: PetMood;
  /** Absolute path to the current SVG asset */
  animationSrc: string;
  /** Contextual bubble message */
  moodMessage: string;
}
