import axios from 'axios';

export const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`,
    headers: {
        'Content-Type': 'application/json',
        'x-platform': process.env.NEXT_PUBLIC_API_PLATFORM || 'web',
        'x-client-version': process.env.NEXT_PUBLIC_API_CLIENT_VERSION || '1.0.0',
        'x-app-language': process.env.NEXT_PUBLIC_API_APP_LANGUAGE || 'es-CL',
        'x-channel': process.env.NEXT_PUBLIC_API_CHANNEL || 'web',
        'x-environment-id': process.env.NEXT_PUBLIC_API_ENVIRONMENT_ID || '',
        'x-environment': process.env.NEXT_PUBLIC_API_ENVIRONMENT || 'development',
    },
});



// Add token to all requests (unless skipAuth flag is present)
apiClient.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};

    if ((config as any).skipAuth) {
        return config;
    }

    const hasAuthHeader = Boolean((config.headers as any).Authorization);
    const token = !hasAuthHeader && typeof window !== 'undefined'
        ? localStorage.getItem('beyond-tcg-token')
        : null;

    if (token) {
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (token expired)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('beyond-tcg-token');
            localStorage.removeItem('beyond-tcg-user');
            // Only redirect if we are in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
