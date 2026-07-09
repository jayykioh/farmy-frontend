import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api/v1')) {
  API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/v1`;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type TokenRefreshSubscriber = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

type RefreshTokenResponse = {
  success: true;
  data: {
    access_token?: string;
    accessToken?: string;
  };
};

export type ApiResponse<T> = {
  success: true;
  data: T;
};

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: TokenRefreshSubscriber[] = [];

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  setAccessToken(null);
};

const processRefreshQueue = (error: unknown, accessToken?: string) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (accessToken) {
      resolve(accessToken);
      return;
    }

    reject(error);
  });

  refreshQueue = [];
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (!isUnauthorized || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((accessToken) => {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const accessToken = response.data.data.access_token ?? response.data.data.accessToken;

      if (!accessToken) {
        throw new Error('Refresh response did not include access token');
      }

      setAccessToken(accessToken);
      processRefreshQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processRefreshQueue(refreshError);
      clearAccessToken();
      window.location.href = '/';

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
