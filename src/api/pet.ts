import { api, type ApiResponse } from './client';

export type PetMood = 'happy' | 'excited' | 'neutral' | 'sad' | 'worried';

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

export const fetchPetState = async () => {
  const { data } = await api.get<ApiResponse<PetState>>('/pet/state');
  return data.data;
};
