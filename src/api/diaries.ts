import { api, type ApiResponse } from './client';

// === DIARIES ===

export type Diary = {
  _id: string;
  user_id: string;
  plot_id: string;
  crop_type: string;
  start_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateDiaryPayload = {
  plot_id: string;
  crop_type: string;
  start_date: string;
};

export type UpdateDiaryPayload = Partial<CreateDiaryPayload> & {
  status?: string;
};

export type DiaryListResponse = {
  data: Diary[];
  total?: number;
};

export const fetchDiaries = async () => {
  const { data } = await api.get<ApiResponse<DiaryListResponse | Diary[]>>('/diaries');
  // Handle both possible pagination wrappers just in case
  if (Array.isArray(data.data)) return data.data;
  return data.data.data;
};

export const fetchDiary = async (id: string) => {
  const { data } = await api.get<ApiResponse<Diary>>(`/diaries/${id}`);
  return data.data;
};

export const createDiary = async (payload: CreateDiaryPayload) => {
  const { data } = await api.post<ApiResponse<Diary>>('/diaries', payload);
  return data.data;
};

export const updateDiary = async (id: string, payload: UpdateDiaryPayload) => {
  const { data } = await api.put<ApiResponse<Diary>>(`/diaries/${id}`, payload);
  return data.data;
};

export const deleteDiary = async (id: string) => {
  await api.delete(`/diaries/${id}`);
};

// === DIARY LOGS ===

export type DiaryLog = {
  _id: string;
  diary_id: string;
  activity_type: string;
  content: string;
  image_url?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
};

export type CreateDiaryLogPayload = {
  activity_type: string;
  content: string;
  image_url?: string;
  photo_urls?: string[];
};

export const fetchDiaryLogs = async (diaryId: string) => {
  const { data } = await api.get<ApiResponse<DiaryLog[]>>(`/diaries/${diaryId}/logs`);
  return data.data;
};

export const createDiaryLog = async (diaryId: string, payload: CreateDiaryLogPayload) => {
  const { data } = await api.post<ApiResponse<DiaryLog>>(`/diaries/${diaryId}/logs`, payload);
  return data.data;
};

export const deleteDiaryLog = async (logId: string) => {
  await api.delete(`/diaries/logs/${logId}`);
};
