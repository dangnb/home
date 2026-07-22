'use client';

import { use, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductRepository } from '@/infrastructure/di/container';
import { GetProductsUseCase } from '@/application/use-cases/GetProductsUseCase';
import { Product } from '@/domain/entities/Product';
import { ProductCard } from '@/presentation/components/features/ProductCard';
import { Search, ArrowLeft, Frown } from 'lucide-react';
import Link from 'next/link';

const productRepo = getProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepo);

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSearch() {
      setLoading(true);
      if (query.trim()) {
        const result = await getProductsUseCase.execute({
          searchQuery: query,
          pageSize: 24,
        });
        setProducts(result.items);
        setTotalCount(result.totalCount);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
      setLoading(false);
    }
    loadSearch();
  }, [query]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Tìm kiếm</span>
      </nav>

      {/* Header Result Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#00904a]" />
            Kết quả tìm kiếm cho: &ldquo;<span className="text-[#00904a]">{query}</span>&rdquo;
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {loading ? 'Đang tìm kiếm sản phẩm...' : `Tìm thấy ${totalCount} sản phẩm phù hợp`}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00904a] hover:text-[#006633] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Xem tất cả sản phẩm
        </Link>
      </div>

      {/* Results grid or empty state */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white rounded-lg border border-gray-100 animate-pulse p-3 space-y-3">
              <div className="w-full aspect-square bg-gray-100 rounded-md" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Frown className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-gray-800">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa &ldquo;{query}&rdquo;
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Hãy thử tìm lại với từ khóa khác như <span className="font-semibold text-gray-700">mì, nước ngọt, dầu ăn, bánh</span> hoặc quay về trang chủ để khám phá các sản phẩm nổi bật.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00904a] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[#007a3e] transition-all"
          >
            Về Trang Chủ
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-4 py-8 text-center text-sm text-gray-400">
        Đang tải kết quả tìm kiếm...
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
