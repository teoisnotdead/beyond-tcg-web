import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/api';
import { apiClient } from '@/lib/api/client';

interface AuthState {
    user: User | null;
    token: string | null;
    hasHydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            hasHydrated: false,
            login: async (email, password) => {
                const { data } = await apiClient.post('/auth/login', { email, password });
                set({ token: data.access_token, user: data.user });
                document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth-token', data.access_token);
                }
            },
            register: async (name, email, password) => {
                const { data } = await apiClient.post('/auth/register', { name, email, password });
                set({ token: data.access_token, user: data.user });
                document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth-token', data.access_token);
                }
            },
            logout: () => {
                set({ token: null, user: null });
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-token');
                    window.location.href = '/login';
                }
            },
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ token: state.token, user: state.user }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

// Initialize store hydration on client
if (typeof window !== 'undefined') {
    useAuthStore.persist.rehydrate();
}
