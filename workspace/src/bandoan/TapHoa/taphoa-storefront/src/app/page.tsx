'use client';

import { useState, useEffect } from 'react';
import { HeroBanner } from '@/presentation/components/features/HeroBanner';
import { CategoryStrip } from '@/presentation/components/features/CategoryStrip';
import { FlashSale } from '@/presentation/components/features/FlashSale';
import { ProductCard } from '@/presentation/components/features/ProductCard';
import { getProductRepository } from '@/infrastructure/di/container';
import { GetProductsUseCase } from '@/application/use-cases/GetProductsUseCase';
import { Product, Category } from '@/domain/entities/Product';
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCw, Headphones, TrendingUp, Gift, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const productRepo = getProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepo);

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'discount'>('popular');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      const [cats, flash, popular] = await Promise.all([
        getProductsUseCase.getCategories(),
        getProductsUseCase.getFlashSale(),
        getProductsUseCase.getPopular(),
      ]);
      setCategories(cats);
      setFlashSaleProducts(flash);
      setPopularProducts(popular);
    }
    initData();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await getProductsUseCase.execute({
        page,
        pageSize: 12,
        categoryId: selectedCategory,
        sortBy,
      });
      setProducts(res.items);
      setTotalPages(res.totalPages);
      setLoading(false);
    }
    loadProducts();
  }, [selectedCategory, sortBy, page]);

  const handleCategorySelect = (catId?: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Trust Bar — horizontal, modern icons */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Truck className="w-7 h-7" />, color: 'text-emerald-500', bg: 'bg-emerald-50', text: 'Giao hàng 2H', sub: 'Nội thành TP.HCM' },
            { icon: <ShieldCheck className="w-7 h-7" />, color: 'text-blue-500', bg: 'bg-blue-50', text: '100% Chính hãng', sub: 'Cam kết chất lượng' },
            { icon: <RefreshCw className="w-7 h-7" />, color: 'text-amber-500', bg: 'bg-amber-50', text: 'Đổi trả miễn phí', sub: 'Trong 7 ngày' },
            { icon: <Headphones className="w-7 h-7" />, color: 'text-rose-500', bg: 'bg-rose-50', text: 'Tư vấn 24/7', sub: 'Hotline: 1900 8888' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 border-r border-b border-gray-50 last:border-r-0 hover:bg-gray-50/50 transition-colors">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center ${item.color} flex-shrink-0`}>
                {item.icon}
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-900 leading-tight">{item.text}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Strip */}
      <CategoryStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Flash Sale */}
      <FlashSale products={flashSaleProducts} />

      {/* Promo Banners — 3 cards with gradient + emoji */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { emoji: '🥦', title: 'Góc Nấu Ăn', desc: 'Giảm đến 30% dầu ăn, nước mắm', bg: 'from-[#00904a] to-[#00b35a]', href: '/collections/goc-nau-an' },
          { emoji: '🏡', title: 'Đặc Sản Vùng Miền', desc: 'Muối tôm, bánh tráng, gạo ST25', bg: 'from-amber-600 to-yellow-500', href: '/collections/goc-que-nha' },
          { emoji: '👶', title: 'Góc Mẹ Và Bé', desc: 'Sữa, tã, đồ ăn dặm giá tốt', bg: 'from-pink-500 to-rose-400', href: '/collections/goc-me-va-be' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className={`bg-gradient-to-br ${item.bg} text-white rounded-lg p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group`}>
            <span className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</span>
            <div className="flex-1">
              <h3 className="font-extrabold text-base">{item.title}</h3>
              <p className="text-[11px] text-white/70 mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Popular Products — Horizontal section */}
      {popularProducts.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="flex items-center gap-2 font-bold text-base text-gray-900">
              <TrendingUp className="w-5 h-5 text-[#00904a]" />
              Sản Phẩm Bán Chạy
            </h2>
            <Link href="/#products" className="text-[#00904a] text-xs font-semibold hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-gray-100">
            {popularProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] rounded-lg p-6 md:p-8">
        <h2 className="text-center font-extrabold text-xl text-gray-900 mb-6">
          Tại sao chọn <span className="text-[#00904a]">Webtaphoa.vn</span>?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🏪', num: '4,816+', label: 'Cửa hàng tạp hóa' },
            { icon: '📦', num: '10,000+', label: 'Sản phẩm chất lượng' },
            { icon: '⭐', num: '4.9/5', label: 'Đánh giá từ khách hàng' },
            { icon: '🚀', num: '2 giờ', label: 'Giao hàng nội thành' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl font-black text-[#00904a]">{stat.num}</div>
              <div className="text-[11px] text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GỢI Ý HÔM NAY — Main product grid */}
      <section id="products" className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Section header with sort */}
        <div className="border-b-[3px] border-[#ee4d2d]">
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-[#ee4d2d] font-extrabold text-base uppercase tracking-wider">
              GỢI Ý HÔM NAY
            </h2>
            <div className="flex items-center gap-1.5">
              {[
                { value: 'popular', label: 'Phổ biến' },
                { value: 'discount', label: 'Khuyến mãi' },
                { value: 'price-asc', label: 'Giá ↑' },
                { value: 'price-desc', label: 'Giá ↓' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value as any); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                    sortBy === opt.value
                      ? 'bg-[#00904a] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-gray-100">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white p-3 space-y-2 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-lg" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-5 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 text-lg">Không tìm thấy sản phẩm</h3>
            <p className="text-sm text-gray-400 mt-1">Vui lòng thử chọn danh mục khác</p>
            <button onClick={() => handleCategorySelect(undefined)} className="mt-4 px-6 py-2 bg-[#00904a] text-white text-sm font-bold rounded-lg hover:bg-[#007a3e] transition-colors">
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-gray-100">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-5 bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 bg-white border border-gray-200 rounded-lg hover:border-[#00904a] disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setPage(idx + 1)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  page === idx + 1
                    ? 'bg-[#00904a] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#00904a] hover:text-[#00904a]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 bg-white border border-gray-200 rounded-lg hover:border-[#00904a] disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
