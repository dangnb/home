/**
 * Product Adapter
 * Maps API DTOs to Domain Entities
 */

import { Product, Category } from '@/domain/entities/Product';

// ========================================
// API DTOs (what the backend returns)
// Adjust these interfaces to match your actual API response
// ========================================

export interface ApiProductDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  discount_percent?: number | null;
  category_id: string;
  category_name: string;
  image: string;
  images?: string[];
  unit: string;
  stock: number;
  rating: number;
  sold_count: number;
  description: string;
  origin?: string | null;
  is_flash_sale?: boolean;
  is_popular?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCategoryDTO {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  image?: string;
  parent_id?: string | null;
  sort_order?: number;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ========================================
// Adapters: DTO → Domain Entity
// ========================================

export function toProduct(dto: ApiProductDTO): Product {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    price: dto.price,
    originalPrice: dto.original_price ?? undefined,
    discountPercent: dto.discount_percent ?? undefined,
    categoryId: dto.category_id,
    categoryName: dto.category_name,
    image: dto.image,
    unit: dto.unit,
    stock: dto.stock,
    rating: dto.rating,
    soldCount: dto.sold_count,
    description: dto.description,
    origin: dto.origin ?? undefined,
    isFlashSale: dto.is_flash_sale ?? false,
    isPopular: dto.is_popular ?? false,
  };
}

export function toCategory(dto: ApiCategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    iconName: dto.icon_name,
    itemCount: 0,
  };
}

// ========================================
// Reverse Adapters: Domain Entity → API Request
// (used when sending data TO the API)
// ========================================

export function toApiProductQuery(params: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  searchQuery?: string;
  sortBy?: string;
}): Record<string, string | number | boolean | undefined> {
  return {
    page: params.page,
    page_size: params.pageSize,
    category_id: params.categoryId,
    search: params.searchQuery,
    sort_by: params.sortBy,
  };
}
