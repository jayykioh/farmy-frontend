import { useQuery } from '@tanstack/react-query';
import { fetchPetStatus } from '../services/pet.api';
import type { PetStatus } from '../types/pet.types';

export const PET_STATUS_QUERY_KEY = ['pet', 'status'] as const;

/**
 * Fetches the current pet status from the backend.
 * Refetches every 5 minutes and on window focus.
 */
export function usePetStatus() {
  return useQuery<PetStatus>({
    queryKey: PET_STATUS_QUERY_KEY,
    queryFn : fetchPetStatus,
    staleTime            : 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus : true,
    retry                : 1,
  });
}
