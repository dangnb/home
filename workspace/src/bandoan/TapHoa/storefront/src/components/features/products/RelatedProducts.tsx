'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/types/models';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/features/products/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/ToastProvider';
import { useInView } from '@/hooks/useInView';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsProps {
  categoryId?: string;
  categorySlug?: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, categorySlug, currentProductId }: RelatedProductsProps) {
  const { ref, isInView } = useInView({ rootMargin: '200px' });
  const [sameCategory, setSameCategory] = useState<Product[]>([]);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isInView || fetched) return;
    setFetched(true);

    async function load() {
      try {
        // Fetch same-category products
        const sameCatPromise = categoryId
          ? productService.getProducts(1, 12, categoryId)
          : Promise.resolve({ items: [] as Product[], totalCount: 0, pageIndex: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false });

        // Fetch all products for "Có thể bạn cũng thích"
        const allPromise = productService.getProducts(1, 12);

        const [sameCatResult, allResult] = await Promise.all([sameCatPromise, allPromise]);

        const sameCatFiltered = (sameCatResult.items || [])
          .filter(p => p.id !== currentProductId)
          .slice(0, 5);
        setSameCategory(sameCatFiltered);

        // "You may also like" = all products excluding current and same-category ones
        const sameCatIds = new Set(sameCatFiltered.map(p => p.id));
        const otherFiltered = (allResult.items || [])
          .filter(p => p.id !== currentProductId && !sameCatIds.has(p.id))
          .slice(0, 5);
        setOtherProducts(otherFiltered);
      } catch (e) {
        console.error('Failed to load related products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isInView, fetched, categoryId, currentProductId]);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const SkeletonRow = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <div className="aspect-square skeleton" />
          <div className="p-4 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const ProductRow = ({ items }: { items: Product[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((product, i) => (
        <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
          <ProductCard product={product} onAdd={handleAdd} />
        </div>
      ))}
    </div>
  );

  if (!loading && sameCategory.length === 0 && otherProducts.length === 0) return null;

  return (
    <div ref={ref} className="mt-12 md:mt-16 space-y-10">
      {/* Same Category Products */}
      {(loading || sameCategory.length > 0) && (
        <section className="animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800">Sản phẩm cùng danh mục</h2>
            {categorySlug && (
              <Link href={`/category/${categorySlug}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {loading ? <SkeletonRow /> : <ProductRow items={sameCategory} />}
        </section>
      )}

      {/* Other Products - "You May Also Like" */}
      {(loading || otherProducts.length > 0) && (
        <section className="animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800">Có thể bạn cũng thích</h2>
            <Link href="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              Xem thêm <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? <SkeletonRow /> : <ProductRow items={otherProducts} />}
        </section>
      )}
    </div>
  );
}
