import axios from 'axios';

let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (baseUrl && !baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
}

const API_URL = baseUrl
    ? `${baseUrl}/api`
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on 401
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

// Notes API
export const notesApi = {
    getAll: (params = {}) => api.get('/notes', { params }),
    getById: (id) => api.get(`/notes/${id}`),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.put(`/notes/${id}`, data),
    delete: (id) => api.delete(`/notes/${id}`),
};

// Bookmarks API
export const bookmarksApi = {
    getAll: (params = {}) => api.get('/bookmarks', { params }),
    getById: (id) => api.get(`/bookmarks/${id}`),
    create: (data) => api.post('/bookmarks', data),
    update: (id, data) => api.put(`/bookmarks/${id}`, data),
    delete: (id) => api.delete(`/bookmarks/${id}`),
};

// Auth API
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

export default api;
