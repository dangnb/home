/**
 * API Product Repository
 * Implements IProductRepository using real REST API calls
 */

import { IProductRepository, GetProductsQuery, PagedProductsResult } from '@/domain/repositories/IProductRepository';
import { Product, Category } from '@/domain/entities/Product';
import { httpClient } from '@/infrastructure/http/httpClient';
import { ApiConfig } from '@/infrastructure/config/api.config';
import {
  ApiProductDTO,
  ApiCategoryDTO,
  ApiPaginatedResponse,
  toProduct,
  toCategory,
  toApiProductQuery,
} from '@/infrastructure/adapters/productAdapter';

export class ApiProductRepository implements IProductRepository {
  async getProducts(query?: GetProductsQuery): Promise<PagedProductsResult> {
    const queryParams = query ? toApiProductQuery(query) : {};

    const response = await httpClient.get<ApiPaginatedResponse<ApiProductDTO>>(
      ApiConfig.endpoints.products.list,
      { params: queryParams },
    );

    return {
      items: response.items.map(toProduct),
      totalCount: response.total,
      totalPages: response.total_pages,
      page: response.page,
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const dto = await httpClient.get<ApiProductDTO>(
        ApiConfig.endpoints.products.detail(slug),
      );
      return toProduct(dto);
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error && (error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    const response = await httpClient.get<ApiProductDTO[] | ApiPaginatedResponse<ApiProductDTO>>(
      ApiConfig.endpoints.products.flashSale,
    );

    const items = Array.isArray(response) ? response : response.items;
    return items.map(toProduct);
  }

  async getPopularProducts(): Promise<Product[]> {
    const response = await httpClient.get<ApiProductDTO[] | ApiPaginatedResponse<ApiProductDTO>>(
      ApiConfig.endpoints.products.popular,
    );

    const items = Array.isArray(response) ? response : response.items;
    return items.map(toProduct);
  }

  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<ApiCategoryDTO[]>(
      ApiConfig.endpoints.categories.list,
    );

    return response.map(toCategory);
  }
}
