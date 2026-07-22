/**
 * Product Adapter
 * Maps API DTOs (from .NET Backend) to Domain Entities
 */

import { Product, Category } from '@/domain/entities/Product';

// ========================================
// API DTOs (what the backend returns)
// Handles camelCase from .NET Minimal API
// ========================================

export interface ApiProductDTO {
  id: string;
  name: string;
  slug?: string;
  price: number;
  costPrice?: number;
  wholesalePrice?: number;
  originalPrice?: number | null;
  original_price?: number | null;
  discountPercent?: number | null;
  discount_percent?: number | null;
  categoryId?: string | null;
  category_id?: string | null;
  categoryName?: string;
  category_name?: string;
  mainImageUrl?: string | null;
  image?: string;
  additionalImages?: string[];
  unit: string;
  stockQuantity?: number;
  stock?: number;
  rating?: number;
  soldCount?: number;
  sold_count?: number;
  description?: string;
  origin?: string | null;
  isFlashSale?: boolean;
  is_flash_sale?: boolean;
  isPopular?: boolean;
  is_popular?: boolean;
}

export interface ApiCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  iconName?: string;
  icon_name?: string;
  parentId?: string | null;
  parent_id?: string | null;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  totalCount?: number;
  total?: number;
  pageIndex?: number;
  page?: number;
  pageSize?: number;
  page_size?: number;
  totalPages?: number;
  total_pages?: number;
}

// ========================================
// Adapters: DTO → Domain Entity
// ========================================

export function toProduct(dto: ApiProductDTO): Product {
  let image = dto.mainImageUrl || dto.image || '';
  if (!image || image.trim() === '' || image.includes('placeholder')) {
    image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
  } else if (image.startsWith('/uploads')) {
    image = `http://localhost:5222${image}`;
  }
  const stock = dto.stockQuantity ?? dto.stock ?? 0;
  const categoryId = dto.categoryId ?? dto.category_id ?? '';
  const categoryName = dto.categoryName ?? dto.category_name ?? '';
  const slug = dto.slug || dto.id;

  return {
    id: dto.id,
    name: dto.name,
    slug: slug,
    price: dto.price,
    originalPrice: dto.originalPrice ?? dto.original_price ?? undefined,
    discountPercent: dto.discountPercent ?? dto.discount_percent ?? undefined,
    categoryId: categoryId,
    categoryName: categoryName,
    image: image,
    unit: dto.unit || 'Cái',
    stock: stock,
    rating: dto.rating ?? 5,
    soldCount: dto.soldCount ?? dto.sold_count ?? 0,
    description: dto.description || '',
    origin: dto.origin ?? undefined,
    isFlashSale: dto.isFlashSale ?? dto.is_flash_sale ?? false,
    isPopular: dto.isPopular ?? dto.is_popular ?? false,
  };
}

export function toCategory(dto: ApiCategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    iconName: dto.icon || dto.iconName || dto.icon_name || 'ShoppingBag',
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
    pageIndex: params.page,
    pageSize: params.pageSize,
    categoryId: params.categoryId,
    searchTerm: params.searchQuery,
    sortBy: params.sortBy,
  };
}
