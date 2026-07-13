import { api } from './client';

export type WeeklyInsight = {
  id: string;
  user_id: string;
  week_start_date: string;
  insight_text: string;
  created_at: string;
};

// Check standard response wrapper if applicable. If standard API returns `{ data: T, message: string }`, we adapt it.
// Here we assume standard axios returns { data: responseBody } and nestjs returns array directly.
export const fetchWeeklyInsights = async (limit: number = 10): Promise<WeeklyInsight[]> => {
  const { data } = await api.get('/weekly-insights', {
    params: { limit },
  });
  // Adjust if backend wraps it in { data: ... }
  return data.data ? data.data : data; 
};
