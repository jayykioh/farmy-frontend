import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApi } from '../../../api/shop';
import { PET_STATUS_QUERY_KEY } from '../../pet/hooks/usePetStatus';

export const useShopItems = () => {
  return useQuery({
    queryKey: ['shopItems'],
    queryFn: shopApi.getItems,
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
      // Invalidate pet status to refresh equipped items
      queryClient.invalidateQueries({ queryKey: PET_STATUS_QUERY_KEY });
    },
  });
};
