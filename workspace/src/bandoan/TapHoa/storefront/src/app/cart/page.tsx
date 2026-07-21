'use client';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';

function getImageUrl(url: string) {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:5222${url}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { showToast } = useToast();
  const totalPrice = getTotal();
  const totalItems = getItemCount();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="text-7xl mb-4">🛒</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-400 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
          Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-medium">Giỏ hàng ({totalItems})</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 card-hover">
              {/* Image */}
              <Link href={`/product/${item.product.slug || item.product.id}`} className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {item.product.mainImageUrl ? (
                  <img src={getImageUrl(item.product.mainImageUrl)} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug || item.product.id}`}>
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-2 hover:text-emerald-600 transition-colors">{item.product.name}</h3>
                </Link>
                {item.product.unit && <span className="text-xs text-gray-400">/{item.product.unit}</span>}
                <div className="text-emerald-600 font-black text-lg mt-1">
                  {item.product.price.toLocaleString('vi-VN')}₫
                </div>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => { removeItem(item.product.id); showToast('Đã xóa khỏi giỏ hàng'); }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-lg">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-bold border-x border-gray-200">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-lg">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => { clearCart(); showToast('Đã xóa toàn bộ giỏ hàng'); }} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
            Xóa tất cả
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
            <h3 className="font-black text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-medium text-gray-800">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-emerald-600">Miễn phí</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="font-black text-xl text-emerald-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-5 w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Tiến hành thanh toán
            </Link>
            <Link href="/" className="mt-3 w-full block text-center text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
