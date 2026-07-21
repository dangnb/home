import { apiClient } from '@/lib/apiClient';
import { Category } from '@/types/models';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/online-store/categories', {
      next: { revalidate: 3600 } // Revalidate every hour since categories rarely change
    });
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    return apiClient.get<Category>(`/online-store/categories/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 }
    });
  }
};
