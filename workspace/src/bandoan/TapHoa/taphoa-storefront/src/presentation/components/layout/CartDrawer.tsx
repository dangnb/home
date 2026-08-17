'use client';
import { useCartStore } from '@/presentation/store/useCartStore';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/presentation/components/ui/ProductImage';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#00904a] text-white">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Giỏ hàng ({totalItems} sản phẩm)
          </h2>
          <button onClick={closeCart} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-bold text-gray-800 text-base">Giỏ hàng trống</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Hãy thêm sản phẩm yêu thích để bắt đầu mua sắm</p>
              <button
                onClick={closeCart}
                className="mt-4 px-5 py-2 bg-[#00904a] text-white rounded-lg text-xs font-bold hover:bg-[#007a3e] transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {/* Image */}
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                  <ProductImage
                    src={item.product.image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{item.product.name}</h4>
                  <div className="text-xs text-gray-400">{item.product.unit}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#e60000]">
                      {item.product.price.toLocaleString('vi-VN')}₫
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-7 h-7 ml-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 space-y-3">
            {/* Free shipping notice */}
            {totalPrice >= 150000 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-[#00904a] font-semibold text-center">
                🎉 Bạn được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>!
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 text-center">
                Mua thêm <strong>{(150000 - totalPrice).toLocaleString('vi-VN')}₫</strong> để được <strong>miễn phí giao hàng</strong>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-600">Tạm tính:</span>
              <span className="text-lg font-black text-[#e60000]">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex gap-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex-1 py-3 bg-white border-2 border-[#00904a] text-[#00904a] font-bold text-xs rounded-lg text-center hover:bg-green-50 transition-colors"
              >
                Xem giỏ hàng
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 py-3 bg-[#00904a] text-white font-bold text-xs rounded-lg text-center hover:bg-[#007a3e] transition-colors flex items-center justify-center gap-1"
              >
                Thanh toán <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
