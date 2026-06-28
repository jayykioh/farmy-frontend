/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './client';

export interface FarmPlot {
  _id: string;
  user_id: string;
  name: string;
  area_size: number;
  description?: string;
}

export interface Diary {
  _id: string;
  plot_id: string;
  crop_type: string;
  start_date: string;
  status: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
  plot_name?: string; // populated locally or in UI
}

export interface DiaryLog {
  _id: string;
  diary_id: string;
  activity_type: string;
  content: string;
  image_url?: string;
  created_at: string;
}

export interface Reminder {
  _id: string;
  user_id: string;
  diary_id?: string;
  title: string;
  remind_at: string;
  is_sent: boolean;
  repeat?: 'none' | 'daily' | 'weekly';
}

// 1. Plots API
export const getPlots = async (): Promise<FarmPlot[]> => {
  const { data } = await api.get<{ data: FarmPlot[] }>('/plots');
  return data.data;
};

export const createPlot = async (plot: Omit<FarmPlot, '_id' | 'user_id'>): Promise<FarmPlot> => {
  const { data } = await api.post<{ data: FarmPlot }>('/plots', plot);
  return data.data;
};

// 2. Diaries API
export const getDiaries = async (): Promise<Diary[]> => {
  const { data } = await api.get<{ data: Diary[] }>('/diaries');
  return data.data;
};

export const getDiaryDetail = async (id: string): Promise<Diary> => {
  const { data } = await api.get<{ data: Diary }>(`/diaries/${id}`);
  return data.data;
};

export const createDiary = async (diary: { plot_id: string; crop_type: string; start_date: string }): Promise<Diary> => {
  const { data } = await api.post<{ data: Diary }>('/diaries', diary);
  return data.data;
};

// 3. Diary Logs API
export const getDiaryLogs = async (diaryId: string): Promise<DiaryLog[]> => {
  const { data } = await api.get<{ data: DiaryLog[] }>(`/diaries/${diaryId}/logs`);
  return data.data;
};

export const createDiaryLog = async (
  diaryId: string,
  log: { activity_type: string; content: string; image_url?: string }
): Promise<DiaryLog> => {
  const { data } = await api.post<{ data: DiaryLog }>(`/diaries/${diaryId}/logs`, log);
  return data.data;
};

// 4. Reminders API
export const getPendingReminders = async (): Promise<Reminder[]> => {
  const { data } = await api.get<{ data: Reminder[] }>('/reminders/pending');
  return data.data;
};

export const completeReminder = async (id: string): Promise<Reminder> => {
  const { data } = await api.patch<{ data: Reminder }>(`/reminders/${id}/complete`);
  return data.data;
};

export const createReminder = async (reminder: { title: string; remind_at: string; diary_id?: string; repeat?: 'none' | 'daily' | 'weekly' }): Promise<Reminder> => {
  const { data } = await api.post<{ data: Reminder }>('/reminders', reminder);
  return data.data;
};

// 5. Pet API
export interface PetState {
  mood: 'happy' | 'neutral' | 'sad' | 'worried' | 'excited';
  streak_count: number;
  level: number;
  xp: number;
  bubble_message: string;
  mood_reason?: string;
}

export const getPetState = async (): Promise<PetState> => {
  const { data } = await api.get<{ data: PetState }>('/pet/state');
  return data.data;
};
