import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (token expired)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if we are in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
