import { apiClient } from '@/lib/apiClient';
import { Product } from '@/types/models';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const productService = {
  getProducts: async (
    pageIndex: number = 1,
    pageSize: number = 24,
    categoryId?: string | null
  ): Promise<PagedResult<Product>> => {
    let url = `/online-store/products?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return apiClient.get<PagedResult<Product>>(url, {
      cache: 'no-store' // We can tweak cache options here depending on Next.js setup
    });
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    return apiClient.get<Product>(`/online-store/products/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 } // Revalidate every 60s
    });
  }
};
