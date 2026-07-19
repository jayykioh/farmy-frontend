 
import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const authMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const status = (action.payload as any)?.status;
    const data = (action.payload as any)?.data;

    // Trigger logout on 401 Unauthorized if token fails to rotate
    if (
      status === 401 ||
      data?.errorCode === 'AUTH_REFRESH_FAILED' ||
      data?.errorCode === 'AUTH_INVALID_TOKEN'
    ) {
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  }

  return next(action);
};
