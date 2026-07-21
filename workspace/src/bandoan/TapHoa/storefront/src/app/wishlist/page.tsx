'use client';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/ToastProvider';
import { ProductCard } from '@/components/features/products/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { items, clearAll } = useWishlistStore();
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  const handleAdd = (product: typeof items[0]) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="text-7xl mb-4">❤️</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Chưa có sản phẩm yêu thích</h1>
        <p className="text-gray-400 mb-6">Nhấn ❤️ trên sản phẩm để thêm vào danh sách yêu thích</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
          Khám phá sản phẩm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">Sản phẩm yêu thích</h1>
            <p className="text-xs text-gray-400">{items.length} sản phẩm</p>
          </div>
        </div>
        <button onClick={() => { clearAll(); showToast('Đã xóa tất cả'); }} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {items.map((product, i) => (
          <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
            <ProductCard product={product} onAdd={handleAdd} />
          </div>
        ))}
      </div>
    </div>
  );
}
