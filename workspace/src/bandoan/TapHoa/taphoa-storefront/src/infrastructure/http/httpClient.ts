/**
 * HTTP Client
 * Centralized HTTP wrapper with auth, error handling, retry, and timeout
 */

import { ApiConfig } from '@/infrastructure/config/api.config';
import { ApiError, NetworkError, TimeoutError } from './apiError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  noAuth?: boolean;
}

const AUTH_TOKEN_KEY = 'taphoa_auth_token';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

/**
 * Build full URL with query params
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(endpoint, ApiConfig.baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: init.signal || controller.signal,
    });
    return response;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new TimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retry logic for failed requests (only for GET and 5xx errors)
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = ApiConfig.retryCount,
  delay: number = ApiConfig.retryDelay,
  isRetryable: boolean = true,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (isRetryable ? retries : 0); attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Only retry on server errors or network errors
      if (error instanceof ApiError && !error.isServerError) throw error;
      if (error instanceof TimeoutError || error instanceof NetworkError) {
        // Retryable
      } else if (!(error instanceof ApiError)) {
        throw error;
      }

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }

  throw lastError!;
}

/**
 * Core request function
 */
async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const url = buildUrl(
    `${ApiConfig.baseUrl}${endpoint}`,
    method === 'GET' ? (options.params as Record<string, string | number | boolean | undefined>) : undefined,
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Inject auth token
  if (!options.noAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const init: RequestInit = {
    method,
    headers,
    ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
  };

  const execute = async (): Promise<T> => {
    let response: Response;

    try {
      response = await fetchWithTimeout(url, init, ApiConfig.timeout);
    } catch (error) {
      if (error instanceof TimeoutError) throw error;
      throw new NetworkError();
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await response.json();
      } catch {
        // Response may not be JSON
      }

      const message =
        (errorData.message as string) ||
        (errorData.error as string) ||
        `Request failed with status ${response.status}`;

      throw new ApiError(response.status, message, errorData);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON
    try {
      return await response.json();
    } catch {
      return undefined as T;
    }
  };

  // Only retry GET requests
  const isRetryable = method === 'GET';
  return withRetry(execute, ApiConfig.retryCount, ApiConfig.retryDelay, isRetryable);
}

/**
 * Public HTTP Client API
 */
export const httpClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', endpoint, undefined, options);
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', endpoint, body, options);
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', endpoint, body, options);
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', endpoint, body, options);
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', endpoint, undefined, options);
  },
};
