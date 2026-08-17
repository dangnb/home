'use client';
import { useEffect, useState, useCallback, use } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product, Category } from '@/types/models';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductGrid } from '@/components/features/products/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
        const currentCategory = data.find((c: Category) => c.slug === decodedSlug);
        if (currentCategory) {
          setSelectedCategory(currentCategory);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, [decodedSlug]);

  const fetchProducts = useCallback(async (page: number) => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const result = await productService.getProducts(page, PAGE_SIZE, selectedCategory.id);
      setProducts(result.items || []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || 0);
      setCurrentPage(result.pageIndex || page);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(1);
    }
  }, [selectedCategory, fetchProducts]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-medium">{selectedCategory?.name || 'Danh mục'}</span>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 md:p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <span className="text-4xl mb-3 block">{selectedCategory?.icon || '📦'}</span>
          <h1 className="text-2xl md:text-3xl font-black mb-2">{selectedCategory?.name || 'Danh mục'}</h1>
          {selectedCategory?.description && (
            <p className="text-emerald-100 text-sm max-w-md">{selectedCategory.description}</p>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-2">
        <Link
          href="/"
          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Tất cả
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat.slug === decodedSlug
                ? 'bg-emerald-600 text-white border border-emerald-600'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {loading ? 'Đang tải...' : `${totalCount} sản phẩm`}
        </p>
        {totalPages > 1 && !loading && (
          <p className="text-xs text-gray-400">
            Trang {currentPage}/{totalPages}
          </p>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} loading={loading} onAdd={handleAdd} />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
