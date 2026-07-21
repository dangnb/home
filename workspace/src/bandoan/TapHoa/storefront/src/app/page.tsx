'use client';
import { useEffect, useState, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/models';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/features/products/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import HeroBanner from '@/components/ui/HeroBanner';
import CategoryStrip from '@/components/ui/CategoryStrip';
import TrustBadges from '@/components/ui/TrustBadges';
import PromoBanners from '@/components/ui/PromoBanners';
import FlashSale from '@/components/ui/FlashSale';
import Testimonials from '@/components/ui/Testimonials';
import AppDownload from '@/components/ui/AppDownload';
import FAQ from '@/components/ui/FAQ';
import Newsletter from '@/components/ui/Newsletter';
import { useInView } from '@/hooks/useInView';
import { useToast } from '@/components/ui/ToastProvider';
import { Flame } from 'lucide-react';

/* ============================================
   Lazy-loaded Product Section with Pagination
   ============================================ */
function ProductSection({ title, subtitle, icon, pageSize = 20, categoryId }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  pageSize?: number;
  categoryId?: string;
}) {
  const { ref, isInView } = useInView({ rootMargin: '200px' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  const fetchProducts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await productService.getProducts(page, pageSize, categoryId);
      setProducts(result.items || []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
      setCurrentPage(result.pageIndex || page);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, categoryId]);

  useEffect(() => {
    if (isInView && !fetched) {
      setFetched(true);
      fetchProducts(1);
    }
  }, [isInView, fetched, fetchProducts]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <section ref={ref} id="products">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">{title}</h2>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
        {totalCount > 0 && !loading && (
          <span className="text-xs text-gray-400 font-medium">{totalCount} sản phẩm</span>
        )}
      </div>

      {isInView ? (
        <>
          <ProductGrid products={products} loading={loading} onAdd={handleAdd} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square skeleton" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================
   Stats Bar
   ============================================ */
function StatsBar() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 text-center">
        <div className="text-2xl md:text-3xl font-black text-emerald-600">1000+</div>
        <div className="text-xs text-gray-500 font-medium mt-1">Sản phẩm</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 text-center">
        <div className="text-2xl md:text-3xl font-black text-emerald-600">2h</div>
        <div className="text-xs text-gray-500 font-medium mt-1">Giao hàng</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 text-center">
        <div className="text-2xl md:text-3xl font-black text-emerald-600">5000+</div>
        <div className="text-xs text-gray-500 font-medium mt-1">Khách hàng</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 text-center">
        <div className="text-2xl md:text-3xl font-black text-emerald-600">4.9⭐</div>
        <div className="text-xs text-gray-500 font-medium mt-1">Đánh giá</div>
      </div>
    </section>
  );
}

/* ============================================
   Main Homepage
   ============================================ */
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-10">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Strip */}
      <CategoryStrip />

      {/* 3. Trust Badges */}
      <TrustBadges />

      {/* 4. Flash Sale — countdown + product row */}
      <FlashSale />

      {/* 5. Promotional Banners */}
      <PromoBanners />

      {/* 6. Product Grid — paginated */}
      <ProductSection 
        title="Sản phẩm nổi bật" 
        subtitle="Tươi ngon mỗi ngày, giá cực yêu"
        icon={<Flame className="w-5 h-5 text-emerald-600" />}
      />

      {/* 7. Stats Bar */}
      <StatsBar />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. App Download CTA */}
      <AppDownload />

      {/* 10. FAQ */}
      <FAQ />

      {/* 11. Newsletter */}
      <Newsletter />
    </div>
  );
}
