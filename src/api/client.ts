import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_VERSION_PATH = '/api/v1';

const normalizeApiBaseUrl = (apiUrl?: string) => {
  const baseUrl = (apiUrl || 'http://localhost:3000')
    .trim()
    .replace(/[;\s]+$/g, '')
    .replace(/\/+$/g, '');

  return baseUrl.endsWith(API_VERSION_PATH)
    ? baseUrl
    : `${baseUrl}${API_VERSION_PATH}`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

// ─── API Logger ──────────────────────────────────────────────────────────────
// Always-on logger for debugging FE ↔ BE integration across different DNS/envs.
const LOG_PREFIX = '[API]';

const logger = {
  request: (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'GET').toUpperCase();
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    const token = config.headers?.Authorization as string | undefined;
    const maskedToken = token
      ? `Bearer ${token.replace('Bearer ', '').slice(0, 8)}...`
      : 'none';

    console.group(
      `%c${LOG_PREFIX} ▶ ${method} ${url}`,
      'color: #4ade80; font-weight: bold;',
    );
    console.log('⏰ Time      :', new Date().toISOString());
    console.log('🌐 Base URL  :', config.baseURL);
    console.log('🛤️  Endpoint  :', config.url);
    console.log('📡 Method    :', method);
    console.log('🔑 Auth Token:', maskedToken);
    console.log('🛡️  CSRF Token:', config.headers?.['X-XSRF-TOKEN'] ? 'present' : 'not set');
    if (config.params && Object.keys(config.params).length > 0) {
      console.log('🔍 Params    :', config.params);
    }
    if (config.data) {
      try {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        // mask password fields
        const safeBody = { ...body };
        if (safeBody.password) safeBody.password = '***';
        console.log('📦 Body      :', safeBody);
      } catch {
        console.log('📦 Body      :', config.data);
      }
    }
    console.log('⚙️  Timeout   :', config.timeout, 'ms');
    console.groupEnd();
  },

  response: (status: number, method: string, url: string, data: unknown, durationMs: number) => {
    const isOk = status >= 200 && status < 300;
    console.group(
      `%c${LOG_PREFIX} ✅ ${status} ${method.toUpperCase()} ${url} (${durationMs}ms)`,
      `color: ${isOk ? '#60a5fa' : '#fbbf24'}; font-weight: bold;`,
    );
    console.log('⏰ Time      :', new Date().toISOString());
    console.log('📊 Status    :', status);
    console.log('⏱️  Duration  :', `${durationMs}ms`);
    console.log('📨 Response  :', data);
    console.groupEnd();
  },

  error: (error: AxiosError) => {
    const method = (error.config?.method ?? 'UNKNOWN').toUpperCase();
    const url = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
    const status = error.response?.status ?? 'NO_RESPONSE';

    console.group(
      `%c${LOG_PREFIX} ❌ ${status} ${method} ${url}`,
      'color: #f87171; font-weight: bold;',
    );
    console.log('⏰ Time       :', new Date().toISOString());
    console.log('🌐 URL        :', url);
    console.log('📡 Method     :', method);
    console.log('📊 Status     :', status);
    console.log('💬 Message    :', error.message);
    if (error.response) {
      console.log('📨 Resp Data  :', error.response.data);
      console.log('📋 Resp Headers:', error.response.headers);
    } else if (error.request) {
      console.warn('⚠️  No response received — possible CORS, DNS, or network issue');
      console.log('📤 Request    :', error.request);
    } else {
      console.log('🔧 Setup Error:', error.message);
    }
    console.log('🔗 Config     :', {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout,
      withCredentials: error.config?.withCredentials,
    });
    console.groupEnd();
  },
};
// ─────────────────────────────────────────────────────────────────────────────

console.log(

  `%c${LOG_PREFIX} 🚀 API Client initialized`,
  'color: #a78bfa; font-weight: bold;',
  '\n  Base URL:', API_BASE_URL,
  '\n  Env:', import.meta.env.MODE,
);

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

type CsrfTokenResponse = ApiResponse<{
  csrfToken: string;
}>;

let accessToken: string | null = localStorage.getItem('farmdiaries_access_token');
let isRefreshing = false;
let refreshQueue: TokenRefreshSubscriber[] = [];
let csrfToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('farmdiaries_access_token', token);
  } else {
    localStorage.removeItem('farmdiaries_access_token');
  }
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('farmdiaries_access_token');
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

const isUnsafeMethod = (method?: string) =>
  ['post', 'put', 'patch', 'delete'].includes(method?.toLowerCase() ?? '');

const isCsrfExemptUrl = (url?: string) =>
  Boolean(
    url?.includes('/auth/login') ||
    url?.includes('/auth/register') ||
    url?.includes('/auth/refresh') ||
    url?.includes('/csrf-token'),
  );

export const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await axios.get<CsrfTokenResponse>(
    `${API_BASE_URL}/csrf-token`,
    { withCredentials: true },
  );

  csrfToken = response.data.data.csrfToken;
  return csrfToken;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Track request start times for duration calculation
const requestTimestamps = new Map<string, number>();

api.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // When sending FormData, override the default 'application/json' Content-Type.
  // Axios v1+ will auto-append the multipart boundary when Content-Type is 'multipart/form-data'.
  if (config.data instanceof FormData) {
    config.headers.set('Content-Type', 'multipart/form-data');
  }

  if (
    config.headers &&
    isUnsafeMethod(config.method) &&
    !isCsrfExemptUrl(config.url)
  ) {
    config.headers['X-XSRF-TOKEN'] = await getCsrfToken();
  }

  // Log the outgoing request
  logger.request(config);

  // Store timestamp keyed by method+url for duration tracking
  const key = `${config.method}-${config.url}-${Date.now()}`;
  (config as InternalAxiosRequestConfig & { _logKey?: string })._logKey = key;
  requestTimestamps.set(key, Date.now());

  return config;
});

api.interceptors.response.use(
  (response) => {
    const config = response.config as InternalAxiosRequestConfig & { _logKey?: string };
    const key = config._logKey ?? '';
    const startTime = requestTimestamps.get(key) ?? Date.now();
    requestTimestamps.delete(key);
    const duration = Date.now() - startTime;

    logger.response(
      response.status,
      config.method ?? 'GET',
      `${config.baseURL ?? ''}${config.url ?? ''}`,
      response.data,
      duration,
    );

    return response;
  },
  async (error: AxiosError) => {
    // Log every error response immediately
    logger.error(error);

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
