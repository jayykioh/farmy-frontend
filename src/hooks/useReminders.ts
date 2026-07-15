import { useQuery } from '@tanstack/react-query';
import { fetchReminders, fetchPendingReminders } from '../api/reminders';
import { useAuthStore } from '../store/authStore';

export const useReminders = (filter?: { status?: 'pending' | 'completed' | 'cancelled' | 'all' }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['reminders', filter],
    queryFn: () => {
      if (filter?.status === 'pending') {
        return fetchPendingReminders();
      }
      return fetchReminders(filter?.status !== 'all' ? filter : undefined);
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
};
