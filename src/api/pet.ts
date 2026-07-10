import { api, type ApiResponse } from './client';
import type { PetStatus } from '../features/pet/types/pet.types';

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

/** Primary endpoint — returns full PetStatus with recalculated mood. */
export const fetchPetStatus = async () => {
  const { data } = await api.get<ApiResponse<PetStatus>>('/pet/status');
  return data.data;
};
