import { IProductRepository, GetProductsQuery } from '@/domain/repositories/IProductRepository';

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(query?: GetProductsQuery) {
    return this.productRepository.getProducts(query);
  }

  async getFlashSale() {
    return this.productRepository.getFlashSaleProducts();
  }

  async getPopular() {
    return this.productRepository.getPopularProducts();
  }

  async getCategories() {
    return this.productRepository.getCategories();
  }

  async getBySlug(slug: string) {
    return this.productRepository.getProductBySlug(slug);
  }
}
