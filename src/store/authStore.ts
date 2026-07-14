import { create } from 'zustand';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '../api/auth';
import { clearAccessToken, getAccessToken, setAccessToken } from '../api/client';
import { store } from './index';
import { baseApi } from './api/baseApi';

type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

type AuthState = {
  accessToken: string | null;
  error: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  user: AuthUser | null;
  clearSession: () => void;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  setSession: (session: { accessToken?: string | null; user: AuthUser }) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  error: null,
  isAuthenticated: false,
  status: 'idle',
  user: null,

  setSession: ({ accessToken, user }) => {
    if (accessToken) {
      setAccessToken(accessToken);
    }

    set({
      accessToken: accessToken ?? get().accessToken,
      error: null,
      isAuthenticated: true,
      status: 'authenticated',
      user,
    });
  },

  clearSession: () => {
    clearAccessToken();
    store.dispatch(baseApi.util.resetApiState());
    set({
      accessToken: null,
      error: null,
      isAuthenticated: false,
      status: 'unauthenticated',
      user: null,
    });
  },

  initialize: async () => {
    if (get().status === 'checking') {
      return;
    }

    set({ error: null, status: 'checking' });

    try {
      const user = await getCurrentUser();
      get().setSession({ accessToken: getAccessToken(), user });
    } catch (error) {
      clearAccessToken();
      set({
        accessToken: null,
        error: error instanceof Error ? error.message : 'Unable to initialize auth session',
        isAuthenticated: false,
        status: 'unauthenticated',
        user: null,
      });
    }
  },

  login: async (payload) => {
    set({ error: null, status: 'checking' });

    try {
      const auth = await loginRequest(payload);
      get().setSession({ accessToken: auth.accessToken, user: auth.user });
    } catch (error) {
      get().clearSession();
      set({ error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  },

  register: async (payload) => {
    set({ error: null, status: 'checking' });

    try {
      const auth = await registerRequest(payload);
      get().setSession({ accessToken: auth.accessToken, user: auth.user });
    } catch (error) {
      get().clearSession();
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      get().clearSession();
    }
  },
}));
