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
  loginWithGoogle: (googleToken?: string) => Promise<void>;
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

function unwrapResponse<T>(data: any): T {
  return (data as any)?.data ?? data;
}

function extractToken(payload: any): string | null {
  const candidate =
    payload?.access_token ?? payload?.token ?? payload?.accessToken ?? null;

  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate;
  }

  const urlCandidate =
    typeof payload === 'string'
      ? payload
      : typeof payload?.url === 'string'
        ? payload.url
        : null;

  if (urlCandidate) {
    try {
      const parsed = new URL(urlCandidate);
      const tokenFromUrl = parsed.searchParams.get('token');
      if (tokenFromUrl) return tokenFromUrl;
    } catch {
      // ignore parse error
    }

    const tokenMatch = urlCandidate.match(/token=([^&]+)/);
    if (tokenMatch?.[1]) {
      return tokenMatch[1];
    }
  }

  return null;
}

function consumeUrlToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) {
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
    return token;
  } catch {
    return null;
  }
}

async function fetchCurrentUser(token: string): Promise<User> {
  const { data } = await apiClient.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const parsed = unwrapResponse<any>(data);
  const user = parsed?.user ?? parsed;
  return user as User;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  initialized: false,

  initialize: () => {
    if (typeof window === 'undefined') return;

    const { user, token } = readStoredAuth();
    const urlToken = consumeUrlToken();

    if (token && user) {
      set({
        user,
        token,
        isLoading: false,
        initialized: true,
      });
      return;
    }

    if (urlToken) {
      set({ isLoading: true });
      fetchCurrentUser(urlToken)
        .then((fetchedUser) => {
          persistAuth(urlToken, fetchedUser);
          set({
            user: fetchedUser,
            token: urlToken,
            isLoading: false,
            initialized: true,
          });
        })
        .catch(() => {
          clearPersistedAuth();
          set({
            user: null,
            token: null,
            isLoading: false,
            initialized: true,
          });
      });
      return;
    }

    // Si hay token persistido pero falta el usuario, lo cargamos
    if (token && !user) {
      set({ isLoading: true });
      fetchCurrentUser(token)
        .then((fetchedUser) => {
          persistAuth(token, fetchedUser);
          set({
            user: fetchedUser,
            token,
            isLoading: false,
            initialized: true,
          });
        })
        .catch(() => {
          clearPersistedAuth();
          set({
            user: null,
            token: null,
            isLoading: false,
            initialized: true,
          });
        });
      return;
    }

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

      const payload = unwrapResponse<any>(data);

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

      const payload = unwrapResponse<any>(data);

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

  loginWithGoogle: async (googleToken?: string) => {
    // Si no traemos un token, redirigimos al flujo externo de Google
    if (!googleToken) {
      if (typeof window === 'undefined') {
        throw new Error('La redireccion de Google solo funciona en el navegador.');
      }

      const baseUrl = apiClient.defaults.baseURL?.replace(/\/$/, '') ?? '';
      set({ isLoading: true });
      window.location.href = `${baseUrl}/auth/google`;
      return;
    }

    // Si recibimos un token explicito (por ejemplo desde otra fuente), lo procesamos
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get(
        '/auth/google',
        {
          params: { token: googleToken },
          skipAuth: true,
        } as any
      );

      const payload = unwrapResponse<any>(data);
      const newToken = extractToken(payload) ?? googleToken;

      if (!newToken) {
        throw new Error('El endpoint de Google no devolvio un token de sesion.');
      }

      const newUser = await fetchCurrentUser(newToken);

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




