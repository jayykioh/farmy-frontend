import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApi } from '../../../api/shop';
import { PET_STATUS_QUERY_KEY } from '../../pet/hooks/usePetStatus';

import { useAuthStore } from '../../../store/authStore';

export const useShopItems = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['shopItems'],
    queryFn: shopApi.getItems,
    enabled: isAuthenticated,
  });
};

export const useBuyItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shopApi.buyItem,
    onSuccess: () => {
      // Invalidate both shop and pet status to refresh XP and owned items
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
    },
  });
};

export const useEquipItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shopApi.equipItem,
    onSuccess: () => {
      // Invalidate both pet status (equipped items) and shop items (for UI sync)
      queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    },
  });
};

/** Semantic alias — same toggle endpoint, used for explicit unequip actions */
export const useUnequipItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shopApi.unequipItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
    },
  });
};
