/**
 * API Configuration
 * Central configuration for all REST API endpoints and settings
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const ApiConfig = {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK,
  timeout: 15000, // 15 seconds
  retryCount: 3,
  retryDelay: 1000, // 1 second

  endpoints: {
    // Products
    products: {
      list: '/products',
      detail: (id: string) => `/products/${id}`,
      detailBySlug: (slug: string) => `/products/slug/${slug}`,
      flashSale: '/products?pageSize=8',
      popular: '/products?pageSize=8',
      search: '/products',
    },

    // Categories
    categories: {
      list: '/categories',
      detailBySlug: (slug: string) => `/categories/slug/${slug}`,
      subcategories: (id: string) => `/categories/${id}/subcategories`,
    },

    // Orders
    orders: {
      create: '/orders',
      myOrders: '/orders/me',
      tracking: '/orders/tracking',
    },

    // Auth
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      me: '/auth/me',
      refreshToken: '/auth/refresh',
    },
  },
} as const;

export type ApiEndpoints = typeof ApiConfig.endpoints;
