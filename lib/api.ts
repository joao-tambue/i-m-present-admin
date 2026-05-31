import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:2000/api/v1';

function getStoredToken() {
  if (typeof window === 'undefined') return null;

  const storedAuth = window.localStorage.getItem('auth-storage');
  if (!storedAuth) return null;

  try {
    const parsed = JSON.parse(storedAuth);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
