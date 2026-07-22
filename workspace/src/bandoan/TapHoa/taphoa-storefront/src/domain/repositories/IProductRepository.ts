import { Product, Category } from '../entities/Product';

export interface GetProductsQuery {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  searchQuery?: string;
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'discount';
}

export interface PagedProductsResult {
  items: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface IProductRepository {
  getProducts(query?: GetProductsQuery): Promise<PagedProductsResult>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getFlashSaleProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
}
