'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { Product } from '@/types/models';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/features/products/ProductGrid';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';

const TRENDING_KEYWORDS = ['Táo', 'Rau cải', 'Thịt bò', 'Cá hồi', 'Trái cây'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const debounce = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        // Search through all products and filter by name on client-side
        const result = await productService.getProducts(1, 100);
        const filtered = (result.items || []).filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-[70vh] animate-fadeIn">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm sản phẩm bạn muốn mua..."
            className="w-full pl-12 pr-10 py-3.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 border border-transparent transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* No query - show suggestions */}
      {!query.trim() && (
        <div className="animate-fadeInUp">
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4" />
              Tìm kiếm phổ biến
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_KEYWORDS.map(kw => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500">
              {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${results.length} sản phẩm cho "${query}"`}
            </h2>
          </div>
          <ProductGrid products={results} loading={loading} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
