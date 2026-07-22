/**
 * Dependency Injection Container
 * Factory that provides either Mock or API repository implementations
 * based on the NEXT_PUBLIC_USE_MOCK environment variable.
 *
 * Usage:
 *   import { container } from '@/infrastructure/di/container';
 *   const productRepo = container.getProductRepository();
 *   const useCase = new GetProductsUseCase(productRepo);
 */

import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { ApiConfig } from '@/infrastructure/config/api.config';
import { MockProductRepository } from '@/infrastructure/repositories/MockProductRepository';
import { MockOrderRepository } from '@/infrastructure/repositories/MockOrderRepository';
import { ApiProductRepository } from '@/infrastructure/repositories/ApiProductRepository';
import { ApiOrderRepository } from '@/infrastructure/repositories/ApiOrderRepository';

// Singleton instances
let productRepository: IProductRepository | null = null;
let orderRepository: IOrderRepository | null = null;

export const container = {
  /**
   * Get ProductRepository instance
   * Returns ApiProductRepository if USE_MOCK=false, otherwise MockProductRepository
   */
  getProductRepository(): IProductRepository {
    if (!productRepository) {
      productRepository = ApiConfig.useMock
        ? new MockProductRepository()
        : new ApiProductRepository();
    }
    return productRepository;
  },

  /**
   * Get OrderRepository instance
   */
  getOrderRepository(): IOrderRepository {
    if (!orderRepository) {
      orderRepository = ApiConfig.useMock
        ? new MockOrderRepository()
        : new ApiOrderRepository();
    }
    return orderRepository;
  },

  /**
   * Reset all singletons (useful for testing)
   */
  reset(): void {
    productRepository = null;
    orderRepository = null;
  },
};

// Convenience exports for direct use
export function getProductRepository(): IProductRepository {
  return container.getProductRepository();
}

export function getOrderRepository(): IOrderRepository {
  return container.getOrderRepository();
}
