# 🔗 Backend Connection Guide (CONNECTING_BACKEND.md)

This document provides a highly structured technical playbook and boilerplate code for connecting this React PWA frontend (`farmdiaries-fe`) to the separated NestJS backend service.

---

## 1. 🌐 Environment Configuration

Vite uses `import.meta.env` to expose environment variables. To configure the API endpoints:

1. Create a `.env.local` file at the root of `farmdiaries-fe`:
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   ```
2. In production, update this to your deployed domain (e.g., `https://api.farmdiaries.ai/api/v1`).

---

## 2. 🚀 Step-by-Step API Client Implementation

To handle secure communication, automatic JWT token injection, and **automatic access token refresh (token rotation)**, implement an Axios client in `src/api/client.ts`.

### Create `src/api/client.ts`
Here is a premium boilerplate implementation:

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create a configured Axios Instance
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for receiving httpOnly refresh token cookies
});

// Request Interceptor: Automatically inject Bearer JWT Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Rotation (Rotate on 401 Unauthorized)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect 401 from expired Access Token (skip refresh endpoint to avoid loops)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Trigger NestJS AuthModule Refresh endpoint (cookies supply original refresh token)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        processQueue(null, access_token);
        isRefreshing = false;
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh token expired: clear local credentials and redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🗺️ 3. Endpoint Specifications Mapping

Below are the mapped routes matching the API Spec documents in `openspec/specs/*`:

| Feature Area | Endpoint | HTTP Method | Payload Details | Headers |
| :--- | :--- | :---: | :--- | :--- |
| **Auth** | `/auth/login` | `POST` | `{ email, password }` | Public |
| **Auth** | `/auth/zalo` | `GET` | Zalo OA Webhook / Auth Callback | Public |
| **Diary** | `/diary` | `GET` | Paginated query `?page=1&limit=10` | Bearer Token |
| **Diary** | `/diary` | `POST` | `{ title, notes, cropType, weather }` | Bearer Token |
| **Diary** | `/diary/:id` | `GET` / `PUT` | Read / Update specific diary entry | Bearer Token |
| **Pet** | `/pet/state` | `GET` | Retrieves `{ streak_count, mood, xp }` | Bearer Token |
| **Pet** | `/pet/feed` | `POST` | `{ itemType }` to increase XP | Bearer Token |
| **Plant Scan** | `/plant-scan` | `POST` | `FormData` carrying plant image file | Bearer Token, `multipart/form-data` |
| **AI Chat** | `/chat` | `POST` | `{ question }` (RAG Agronomy search) | Bearer Token |

---

## ⚡ 4. Code Sample: Migrating React components (Zustand / React Query)

To replace static mocks with real backend endpoints using `@tanstack/react-query` and `Zustand`:

### Example: Replacing Mock Snaps in `Home.tsx`

#### 1. Define Fetch Function (`src/api/diary.ts`)
```typescript
import { api } from './client';

export interface DiaryEntry {
  id: string;
  title: string;
  notes: string;
  cropType: string;
  createdAt: string;
  imageUrl?: string;
}

export const fetchRecentDiaries = async (): Promise<DiaryEntry[]> => {
  const { data } = await api.get<DiaryEntry[]>('/diary?limit=5');
  return data;
};
```

#### 2. Implement with React Query in `src/pages/Home.tsx`
```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchRecentDiaries } from '../api/diary';

// Inside Home Component:
const { data: diaries, isLoading, error } = useQuery({
  queryKey: ['recentDiaries'],
  queryFn: fetchRecentDiaries,
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

---

## 📱 5. PWA PUSH Notifications Connection

For standard web push, once the user grants permissions:

1. Obtain the **VAPID Public Key** from the backend.
2. In the frontend, subscribe to push notifications:
   ```typescript
   const registration = await navigator.serviceWorker.ready;
   const subscription = await registration.pushManager.subscribe({
     userVisibleOnly: true,
     applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
   });
   ```
3. POST the `subscription` JSON payload to `/notifications/subscribe` to bind it to the authenticated User entity.
