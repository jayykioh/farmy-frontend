import { api, type ApiResponse } from './client';

export type ReminderType = 'diary' | 'water' | 'fertilize' | 'weekly_insight' | 'streak_milestone' | 'plant_alert';
export type ScheduleSlot = 'morning' | 'noon' | 'afternoon' | 'evening';
export type RepeatType = 'none' | 'daily' | 'weekly';

export type Reminder = {
  _id: string;
  user_id: string;
  title: string;
  remind_at: string;
  diary_id?: string;
  type?: ReminderType;
  schedule_slot?: ScheduleSlot;
  action_type?: string;
  action_detail?: string;
  repeat?: RepeatType;
  status: 'pending' | 'completed' | 'cancelled';
  job_id?: string;
  created_at: string;
  updated_at: string;
};

export type CreateReminderPayload = {
  title: string;
  remind_at: string;
  diary_id?: string;
  type?: ReminderType;
  schedule_slot?: ScheduleSlot;
  action_type?: string;
  action_detail?: string;
  repeat?: RepeatType;
};

export type UpdateReminderPayload = Partial<CreateReminderPayload>;

export const fetchReminders = async (params?: { status?: string }) => {
  const { data } = await api.get<ApiResponse<Reminder[]>>('/reminders', { params });
  return data.data;
};

export const fetchPendingReminders = async () => {
  const { data } = await api.get<ApiResponse<Reminder[]>>('/reminders/pending');
  return data.data;
};

export const createReminder = async (payload: CreateReminderPayload) => {
  const { data } = await api.post<ApiResponse<Reminder>>('/reminders', payload);
  return data.data;
};

export const updateReminder = async (id: string, payload: UpdateReminderPayload) => {
  const { data } = await api.put<ApiResponse<Reminder>>(`/reminders/${id}`, payload);
  return data.data;
};

export const completeReminder = async (id: string) => {
  const { data } = await api.patch<ApiResponse<Reminder>>(`/reminders/${id}/complete`);
  return data.data;
};

export const cancelReminder = async (id: string) => {
  const { data } = await api.patch<ApiResponse<Reminder>>(`/reminders/${id}/cancel`);
  return data.data;
};

export const deleteReminder = async (id: string) => {
  await api.delete(`/reminders/${id}`);
};
