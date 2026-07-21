import { useAuthStore } from '@/store/authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5222/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_STOREFRONT_API_KEY || 'taphoa-sf-key-2026-secure-random';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().token;
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
  }
  return {};
};

const buildHeaders = (options?: RequestInit) => {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  // API Key for storefront security
  headers.set('X-API-Key', API_KEY);

  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    headers.set('Authorization', authHeader.Authorization);
  }
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 401 && typeof window !== 'undefined') {
    useAuthStore.getState().logout();
  }

  if (res.status === 429) {
    throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) {
    return {} as T;
  }
  return res.json() as Promise<T>;
};

export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: buildHeaders(options),
    });
    return handleResponse<T>(res);
  },

  post: async <T>(endpoint: string, body: any, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: buildHeaders(options),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  }
};
