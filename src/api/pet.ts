import { api, type ApiResponse } from './client';

export type PetMood = 'happy' | 'excited' | 'neutral' | 'sad' | 'worried' | 'hungry' | 'sleepy';

/** @deprecated — use PetStatus from features/pet/types instead */
export type PetState = {
  _id: string;
  user_id: string;
  mood: PetMood;
  streak_count: number;
  level: number;
  xp: number;
  mood_reason?: string;
  bubble_message?: string;
  last_diary_at?: string;
  updated_at: string;
};

/** @deprecated — use fetchPetStatus from features/pet/services instead */
export const fetchPetState = async () => {
  const { data } = await api.get<ApiResponse<PetState>>('/pet/state');
  return data.data;
};

export type PetStatusResponse = {
  mood: PetMood;
  previousMood?: PetMood;
  streakCount: number;
  level: number;
  exp: number;
  lastDiaryDate?: string;
  missedDays: number;
  moodReason: string;
  bubbleMessage: string;
  updatedAt?: string;
};

/** Primary endpoint — returns full PetStatusResponse with recalculated mood. */
export const fetchPetStatus = async () => {
  const { data } = await api.get<ApiResponse<PetStatusResponse>>('/pet/status');
  return data.data;
};
