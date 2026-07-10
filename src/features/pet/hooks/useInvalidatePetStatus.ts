import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { PET_STATUS_QUERY_KEY } from './usePetStatus';

export function useInvalidatePetStatus() {
  const queryClient = useQueryClient();
  
  return useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
  }, [queryClient]);
}
