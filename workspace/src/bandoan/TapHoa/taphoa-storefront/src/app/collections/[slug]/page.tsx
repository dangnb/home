'use client';

import { use, useEffect, useState } from 'react';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '@/infrastructure/repositories/MockProductRepository';
import { getProductRepository } from '@/infrastructure/di/container';
import { GetProductsUseCase } from '@/application/use-cases/GetProductsUseCase';
import { Product } from '@/domain/entities/Product';
import { ProductCard } from '@/presentation/components/features/ProductCard';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const productRepo = getProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepo);

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'discount'>('popular');

  const category = MOCK_CATEGORIES.find(c => c.slug === slug);
  const subcats = category ? MOCK_SUBCATEGORIES.filter(s => s.parentId === category.id) : [];

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await getProductsUseCase.execute({
        categoryId: category?.id,
        pageSize: 24,
        sortBy,
      });
      setProducts(res.items);
      setLoading(false);
    }
    loadProducts();
  }, [category?.id, sortBy]);

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">{category?.name || slug}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Sidebar — Shopee style */}
        <aside className="hidden lg:block space-y-3">
          <div className="bg-white rounded-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Tất Cả Danh Mục</h3>
            </div>
            <div className="py-1">
              {(subcats.length > 0 ? subcats : MOCK_CATEGORIES).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  className={`block px-4 py-2 text-[13px] transition-colors ${
                    cat.slug === slug
                      ? 'text-[#ee4d2d] font-bold'
                      : 'text-gray-600 hover:text-[#ee4d2d]'
                  }`}
                >
                  {cat.slug === slug && <span className="mr-1.5">▸</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-4 space-y-3">
          {/* Sort bar — Shopee style */}
          <div className="bg-[#ededed] rounded-sm px-4 py-2.5 flex items-center gap-3">
            <span className="text-[13px] text-gray-500 font-medium">Sắp xếp theo</span>
            {[
              { value: 'popular', label: 'Phổ Biến' },
              { value: 'price-asc', label: 'Giá' },
              { value: 'discount', label: 'Khuyến Mãi' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value as any)}
                className={`px-4 py-1.5 rounded-sm text-[13px] font-medium transition-all ${
                  sortBy === opt.value
                    ? 'bg-[#00904a] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[2px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white p-2 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-sm" />
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-sm border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-800">Chưa có sản phẩm</h3>
              <p className="text-xs text-gray-400 mt-1">Danh mục đang được cập nhật</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[2px]">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
