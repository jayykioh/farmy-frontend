import { api, clearAccessToken, setAccessToken, setRefreshToken, clearRefreshToken, type ApiResponse } from './client';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  phoneNumber?: string;
  region?: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresIn?: number;
  user: AuthUser;
};

type LoginResponseData = {
  access_token?: string;
  accessToken?: string;
  expires_in?: number;
  expiresIn?: number;
  user?: AuthUser;
};

type RegisterResponseData = LoginResponseData & {
  user_id?: string;
  email?: string;
  name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
};

const normalizeAuthResponse = (data: LoginResponseData | RegisterResponseData): AuthResponse => {
  const accessToken = data.access_token ?? data.accessToken;

  if (!accessToken) {
    throw new Error('Auth response did not include access token');
  }

  const rawUser = data.user ?? {
    id: 'user_id' in data && data.user_id ? data.user_id : '',
    email: 'email' in data && data.email ? data.email : '',
    name: 'name' in data ? data.name : undefined,
  };

  const user: AuthUser = {
    ...rawUser,
  };

  return {
    accessToken,
    expiresIn: data.expires_in ?? data.expiresIn,
    user,
  };
};

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<LoginResponseData>>('/auth/login', payload);
  const auth = normalizeAuthResponse(data.data);
  setAccessToken(auth.accessToken);
  // Also store the raw refresh_token from the body as an in-memory fallback.
  const rawRefreshToken = (data.data as Record<string, unknown>).refresh_token as string | undefined;
  if (rawRefreshToken) setRefreshToken(rawRefreshToken);
  return auth;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', payload);
  const auth = normalizeAuthResponse(data.data);
  setAccessToken(auth.accessToken);
  const rawRefreshToken = (data.data as Record<string, unknown>).refresh_token as string | undefined;
  if (rawRefreshToken) setRefreshToken(rawRefreshToken);
  return auth;
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
    clearRefreshToken();
  }
};

export const updatePushSubscription = async (payload: { endpoint: string; keys: { p256dh: string; auth: string } }) => {
  const { data } = await api.post('/auth/push-subscription', payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/users/me');
  return data;
};

export const exportUserData = async () => {
  const response = await api.get('/users/me/export', { responseType: 'blob' });
  return response.data;
};

export const updateProfile = async (payload: { name?: string; location?: string; avatarUrl?: string }) => {
  const { data } = await api.patch<ApiResponse<AuthUser>>('/users/me', payload);
  return data.data;
};

export const testEmailNotification = async () => {
  const { data } = await api.post('/auth/email-notification/test');
  return data;
};


