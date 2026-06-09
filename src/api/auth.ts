import { api, clearAccessToken, setAccessToken, type ApiResponse } from './client';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresIn?: number;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
  setAccessToken(data.data.accessToken);
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
  return data.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
};
