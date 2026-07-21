import { useQuery } from '@tanstack/react-query';
import { fetchPetStatus } from '../services/pet.api';
import type { PetStatus } from '../types/pet.types';
import { useAuthStore } from '../../../store/authStore';

export const PET_STATUS_QUERY_KEY = ['pet', 'status'] as const;

/**
 * Fetches the current pet status from the backend.
 * Refetches every 5 minutes and on window focus.
 */
export function usePetStatus() {
  const user = useAuthStore((state) => state.user);

  return useQuery<PetStatus>({
    queryKey: [...PET_STATUS_QUERY_KEY, user?.id ?? 'guest'],
    queryFn : fetchPetStatus,
    staleTime            : 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus : true,
    retry                : 1,
    enabled              : !!user?.id,
  });
}
