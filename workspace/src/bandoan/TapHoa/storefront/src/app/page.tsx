'use client';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore, Product } from '@/store/cartStore';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:5222/api/v1/online-store/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = 'http://localhost:5222/api/v1/online-store/products?pageIndex=1&pageSize=24';
        if (selectedCategory) {
          url += `&categoryId=${selectedCategory}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-white mb-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Siêu thị tại nhà</h1>
          <p className="text-emerald-100 text-lg max-w-md">
            Khám phá hàng ngàn sản phẩm tạp hóa với giá siêu hấp dẫn, giao hàng tận nơi.
          </p>
          <button className="mt-8 bg-white text-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Mua sắm ngay
          </button>
        </div>
        <div className="mt-8 md:mt-0 opacity-50 md:opacity-100 text-9xl">
          🛍️
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Categories */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 sticky top-24 border shadow-sm">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">Danh mục sản phẩm</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === null ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                Tất cả sản phẩm
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === category.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || 'Sản phẩm'
                : 'Sản phẩm nổi bật'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white border rounded-2xl p-4 hover:shadow-xl transition-shadow group flex flex-col">
                  <Link href={`/product/${product.id}`} className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative cursor-pointer">
                    {product.imageUrl ? (
                      <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5222${product.imageUrl}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📦</span>
                    )}
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addItem(product);
                    }}
                    className="absolute z-10 bottom-36 right-6 bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm md:text-base hover:text-emerald-600 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-black text-emerald-600 text-lg">{product.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border">
                  <div className="text-4xl mb-4">🛒</div>
                  <p>Không có sản phẩm nào trong danh mục này.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
