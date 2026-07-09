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

  const user = data.user ?? {
    id: 'user_id' in data && data.user_id ? data.user_id : '',
    email: 'email' in data && data.email ? data.email : '',
    name: 'name' in data ? data.name : undefined,
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
  return auth;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', payload);
  const auth = normalizeAuthResponse(data.data);
  setAccessToken(auth.accessToken);
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
  }
};
