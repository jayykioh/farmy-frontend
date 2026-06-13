import { api, type ApiResponse } from '../../../api/client';
import type { PetStatus } from '../types/pet.types';

/**
 * GET /api/v1/pet/status
 * Primary endpoint — returns full PetStatus with recalculated mood.
 */
export const fetchPetStatus = async (): Promise<PetStatus> => {
  const { data } = await api.get<ApiResponse<PetStatus>>('/pet/status');
  return data.data;
};

/**
 * POST /api/v1/pet/recalculate
 * Force-recalculate pet mood (e.g., after UI-level events like reminder dismiss).
 */
export const recalculatePetStatus = async (): Promise<PetStatus> => {
  const { data } = await api.post<ApiResponse<PetStatus>>('/pet/recalculate');
  return data.data;
};
