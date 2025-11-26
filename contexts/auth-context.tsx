'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { User } from '@/types/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (googleToken: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await apiClient.post('/auth/login', { email, password });

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `token=${data.access_token}; path=/; max-age=86400`; // 1 day

        setToken(data.access_token);
        setUser(data.user);
    };

    const loginWithGoogle = async (googleToken: string) => {
        const { data } = await apiClient.post('/auth/google', { token: googleToken });

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `token=${data.access_token}; path=/; max-age=86400`; // 1 day

        setToken(data.access_token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setToken(null);
        setUser(null);
        // Optional: redirect to login
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, loginWithGoogle, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
