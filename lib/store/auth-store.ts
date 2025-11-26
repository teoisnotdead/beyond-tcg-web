import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import type { User } from '@/types/api';

const AUTH_TOKEN_KEY = 'beyond-tcg-token';
const AUTH_USER_KEY = 'beyond-tcg-user';
const AUTH_SESSION_KEY = 'beyond-tcg-session';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

function readStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };

  const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!storedToken || !storedUser) {
    return { user: null, token: null };
  }

  try {
    const parsedUser = JSON.parse(storedUser) as User;
    return { user: parsedUser, token: storedToken };
  } catch {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    return { user: null, token: null };
  }
}

function persistAuth(token: string, user: User) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
}

function clearPersistedAuth() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  initialized: false,

  initialize: () => {
    if (typeof window === 'undefined') return;

    const { user, token } = readStoredAuth();
    set({
      user,
      token,
      isLoading: false,
      initialized: true,
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });

      // El backend responde como { success: true, data: { access_token, user } }
      const payload = (data as any)?.data ?? data;

      const newToken: string = payload.access_token;
      const newUser: User = payload.user;

      persistAuth(newToken, newUser);

      set({
        user: newUser,
        token: newToken,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });

      // El backend responde como { success: true, data: { access_token, user } }
      const payload = (data as any)?.data ?? data;

      const newToken: string = payload.access_token;
      const newUser: User = payload.user;

      persistAuth(newToken, newUser);

      set({
        user: newUser,
        token: newToken,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearPersistedAuth();
    set({
      user: null,
      token: null,
      isLoading: false,
    });
  },
}));

export const AUTH_KEYS = {
  TOKEN: AUTH_TOKEN_KEY,
  USER: AUTH_USER_KEY,
  SESSION: AUTH_SESSION_KEY,
} as const;


