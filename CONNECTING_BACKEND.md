# Backend Connection Guide

This FE repo is a Vite React app. Backend connection should follow the current backend contract from branch `C11-environment-config-api-base-url`.

## Environment

Create `.env.local` in the FE root:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Vite only exposes env vars prefixed with `VITE_`. The local env files are ignored by git, so keep committed defaults in `.env.example`.

## Backend Requirements

The NestJS backend should allow the FE dev origin and cookies:

```ts
app.enableCors({
  origin: ['http://localhost:5173'],
  credentials: true,
});
```

The FE API client is configured with `withCredentials: true`, because refresh tokens are expected to be delivered through httpOnly cookies.

## Auth Contract

Use camelCase token fields from backend responses:

```json
{
  "accessToken": "jwt",
  "user": {
    "id": "user-id",
    "email": "farmer@example.com"
  }
}
```

FE stores the access token under `localStorage.accessToken` and sends it as:

```http
Authorization: Bearer <accessToken>
```

Refresh flow:

- Any protected request returning `401` triggers `POST /auth/refresh`.
- The refresh request uses cookies via `withCredentials: true`.
- The expected refresh response is `{ "accessToken": "jwt" }`.
- If refresh fails, FE clears the access token and redirects to `/`.

## Implemented FE Base

The baseline integration files are now present:

- `src/api/client.ts`: shared Axios client, Bearer injection, refresh queue, cookie support.
- `src/api/auth.ts`: login/register/me/logout helpers.
- `src/api/diaries.ts`: initial diary helpers using `/diaries`.
- `src/main.tsx`: wraps the app with `QueryClientProvider`.

## Endpoint Names To Use

The backend status says these names should be treated as current:

| Feature | Endpoint |
| --- | --- |
| Login | `POST /auth/login` |
| Register | `POST /auth/register` |
| Refresh token | `POST /auth/refresh` |
| Current user | `GET /auth/me` |
| Logout | `POST /auth/logout` |
| Diary list/create | `GET /diaries`, `POST /diaries` |
| Diary detail | `GET /diaries/:id` |

Avoid older examples that used `access_token`, `/users/me`, `/profile/me`, or `/diary`.

## Next FE Migration Work

The UI screens are still mostly mock/static. Migrate page by page using React Query:

1. Auth screens: wire `WelcomeAuth` to `login` or `register`.
2. Home/Profile: load `GET /auth/me` and pet/profile endpoints once confirmed.
3. Diary list/create: replace static content with `fetchDiaries` and `createDiary`.
4. Chat/scan/reminders/snaps: wait for exact backend DTOs before wiring forms.

There are also route mismatches to clean up before deep-link testing:

- Some code navigates to `/chat/active`, but `App.tsx` currently defines `/chat`.
- Some code navigates to `/diary/history`, but `App.tsx` currently defines `/diary-history`.
- `Reminders.tsx` navigates to `/reminder/create`, but `App.tsx` defines `/reminders/create`.
