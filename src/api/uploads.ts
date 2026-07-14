import axios from 'axios';
import { api, type ApiResponse } from './client';
import type { SnapCondition } from '../types/farmSnap';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type UploadTarget = 'diary' | 'snap';

export type SignedUpload = {
  signedUrl: string;
  publicUrl: string;
  imageKey?: string;
};

type SignedUploadResponse = SignedUpload | ApiResponse<SignedUpload>;

export type CreateSnapRequest = {
  imageUrl: string;
  imageKey: string;
  cropType: string;
  condition: SnapCondition;
  conditionNote?: string;
  caption?: string;
  location?: { lat: number; lng: number };
  weather?: { temp: number; humidity: number; condition: string };
  capturedAt: string;
};

const unwrapUploadResponse = (response: SignedUploadResponse): SignedUpload => {
  if ('data' in response && response.data) {
    const dataObj = response.data as Record<string, unknown>;
    return {
      signedUrl: String(dataObj.signedUrl || dataObj.uploadUrl || ''),
      publicUrl: String(dataObj.publicUrl || ''),
      imageKey: String(dataObj.imageKey || dataObj.key || ''),
    };
  }

  const rawObj = response as unknown as Record<string, unknown>;
  return {
    signedUrl: String(rawObj.signedUrl || rawObj.uploadUrl || ''),
    publicUrl: String(rawObj.publicUrl || ''),
    imageKey: String(rawObj.imageKey || rawObj.key || ''),
  };
};

export const validateImageFile = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Ảnh quá lớn, tối đa 10MB.');
  }
};

export const requestSignedUploadUrl = async (target: UploadTarget, file: File) => {
  validateImageFile(file);

  const endpoint = target === 'diary' ? '/diaries/upload-url' : '/snaps/upload-url';
  const { data } = await api.post<SignedUploadResponse>(endpoint, {
    filename: file.name,
    contentType: file.type,
  });

  return unwrapUploadResponse(data);
};

export const uploadImageToR2 = async (target: UploadTarget, file: File) => {
  const signedUpload = await requestSignedUploadUrl(target, file);

  await axios.put(signedUpload.signedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    withCredentials: false,
  });

  return signedUpload;
};

export const createSnap = async (payload: CreateSnapRequest) => {
  const { data } = await api.post('/snaps', payload);
  return data;
};

export const dataUrlToImageFile = async (dataUrl: string, filename: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const type = blob.type || 'image/jpeg';

  return new File([blob], filename, { type });
};
