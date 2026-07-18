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

export type SnapUploadUrlResponse = {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  expiresIn: number;
};

export type SnapPhotoUploadResponse = {
  key: string;
  publicUrl: string;
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
  const { data } = await api.get<
    ApiResponse<FarmSnap & { comments?: FarmSnapComment[] }>
  >(`/snaps/${id}`);
  return data.data;
};

export const createSnap = async (payload: CreateSnapPayload) => {
  const { data } = await api.post<ApiResponse<FarmSnap>>(
    '/snaps',
    toCreateSnapBody(payload),
  );
  return data.data;
};

export const createSnapUploadUrl = async (file: File) => {
  const { data } = await api.post<ApiResponse<SnapUploadUrlResponse>>(
    '/snaps/upload-url',
    {
      contentType: file.type,
      fileName: file.name,
    },
  );
  return data.data;
};

export const uploadSnapPhoto = async (file: File) => {
  const upload = await createSnapUploadUrl(file);

  try {
    const response = await fetch(upload.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`R2 upload failed with status ${response.status}`);
    }

    return upload;
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }

    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<ApiResponse<SnapPhotoUploadResponse>>(
      '/snaps/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data.data;
  }
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

export const deleteSnap = async (id: string) => {
  await api.delete(`/snaps/${id}`);
};
