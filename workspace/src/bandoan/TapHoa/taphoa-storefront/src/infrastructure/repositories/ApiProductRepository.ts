/**
 * API Product Repository
 * Implements IProductRepository with automatic fallback to MockProductRepository
 * if the backend API is unreachable or fails.
 */

import { IProductRepository, GetProductsQuery, PagedProductsResult } from '@/domain/repositories/IProductRepository';
import { Product, Category } from '@/domain/entities/Product';
import { httpClient } from '@/infrastructure/http/httpClient';
import { ApiConfig } from '@/infrastructure/config/api.config';
import { MockProductRepository } from './MockProductRepository';
import {
  ApiProductDTO,
  ApiCategoryDTO,
  ApiPaginatedResponse,
  toProduct,
  toCategory,
  toApiProductQuery,
} from '@/infrastructure/adapters/productAdapter';

export class ApiProductRepository implements IProductRepository {
  private fallbackMockRepo = new MockProductRepository();

  async getProducts(query?: GetProductsQuery): Promise<PagedProductsResult> {
    try {
      const queryParams = query ? toApiProductQuery(query) : {};

      const response = await httpClient.get<ApiPaginatedResponse<ApiProductDTO>>(
        ApiConfig.endpoints.products.list,
        { params: queryParams },
      );

      const items = response.items || [];
      const totalCount = response.totalCount ?? response.total ?? items.length;
      const totalPages = response.totalPages ?? response.total_pages ?? 1;
      const page = response.pageIndex ?? response.page ?? 1;

      return {
        items: items.map(toProduct),
        totalCount,
        totalPages,
        page,
      };
    } catch (error) {
      console.warn('Backend API connection failed, falling back to mock data:', error);
      return this.fallbackMockRepo.getProducts(query);
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const dto = await httpClient.get<ApiProductDTO>(
        ApiConfig.endpoints.products.detailBySlug(slug),
      );
      return toProduct(dto);
    } catch {
      try {
        const dto = await httpClient.get<ApiProductDTO>(
          ApiConfig.endpoints.products.detail(slug),
        );
        return toProduct(dto);
      } catch {
        return this.fallbackMockRepo.getProductBySlug(slug);
      }
    }
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    try {
      const response = await httpClient.get<ApiPaginatedResponse<ApiProductDTO> | ApiProductDTO[]>(
        ApiConfig.endpoints.products.flashSale,
      );

      const items = Array.isArray(response) ? response : (response.items || []);
      const mapped = items.map(toProduct);
      return mapped.length > 0 ? mapped : this.fallbackMockRepo.getFlashSaleProducts();
    } catch {
      return this.fallbackMockRepo.getFlashSaleProducts();
    }
  }

  async getPopularProducts(): Promise<Product[]> {
    try {
      const response = await httpClient.get<ApiPaginatedResponse<ApiProductDTO> | ApiProductDTO[]>(
        ApiConfig.endpoints.products.popular,
      );

      const items = Array.isArray(response) ? response : (response.items || []);
      const mapped = items.map(toProduct);
      return mapped.length > 0 ? mapped : this.fallbackMockRepo.getPopularProducts();
    } catch {
      return this.fallbackMockRepo.getPopularProducts();
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await httpClient.get<ApiCategoryDTO[]>(
        ApiConfig.endpoints.categories.list,
      );

      const mapped = (response || []).map(toCategory);
      return mapped.length > 0 ? mapped : this.fallbackMockRepo.getCategories();
    } catch {
      return this.fallbackMockRepo.getCategories();
    }
  }
}
