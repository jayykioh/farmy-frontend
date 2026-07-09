import { api, type ApiResponse } from './client';
import type {
  CreateSnapPayload,
  FarmSnap,
  FarmSnapComment,
  SnapCondition,
  SnapReactionType,
} from '../types/farmSnap';

export type SnapFeedParams = {
  limit?: number;
  cursor?: string;
  condition?: SnapCondition;
  mine?: boolean;
};

export type SnapFeedResponse = {
  data: FarmSnap[];
  nextCursor: string | null;
};

const toCreateSnapBody = (payload: CreateSnapPayload) => ({
  imageUrl: payload.imageUrl,
  cropType: payload.cropType,
  condition: payload.condition,
  conditionNote: payload.conditionNote,
  caption: payload.caption,
  location: payload.location,
  weather: payload.weather,
  capturedAt: payload.capturedAt,
});

export const fetchSnapFeed = async (params: SnapFeedParams = {}) => {
  const { data } = await api.get<ApiResponse<SnapFeedResponse>>('/snaps/feed', {
    params,
  });
  return data.data;
};

export const fetchSnap = async (id: string) => {
  const { data } = await api.get<ApiResponse<FarmSnap & { comments?: FarmSnapComment[] }>>(
    `/snaps/${id}`,
  );
  return data.data;
};

export const createSnap = async (payload: CreateSnapPayload) => {
  const { data } = await api.post<ApiResponse<FarmSnap>>(
    '/snaps',
    toCreateSnapBody(payload),
  );
  return data.data;
};

export const reactToSnap = async (id: string, type: SnapReactionType) => {
  const { data } = await api.post<
    ApiResponse<{ reactions: FarmSnap['reactions'] }>
  >(`/snaps/${id}/react`, { type });
  return data.data.reactions;
};

export const fetchSnapComments = async (id: string) => {
  const { data } = await api.get<ApiResponse<FarmSnapComment[]>>(
    `/snaps/${id}/comments`,
  );
  return data.data;
};

export const createSnapComment = async (id: string, content: string) => {
  const { data } = await api.post<ApiResponse<FarmSnapComment>>(
    `/snaps/${id}/comments`,
    { content },
  );
  return data.data;
};
