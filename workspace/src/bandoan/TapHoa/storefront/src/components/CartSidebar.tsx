'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const cart = useCartStore();
  const router = useRouter();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Giỏ hàng của bạn
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Giỏ hàng đang trống</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b pb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product.mainImageUrl ? (
                      <img 
                        src={item.product.mainImageUrl.startsWith('http') ? item.product.mainImageUrl : `http://localhost:5222${item.product.mainImageUrl}`} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2">{item.product.name}</h4>
                      <div className="text-emerald-600 font-bold mt-1">
                        {item.product.price.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button 
                          onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => cart.removeItem(item.product.id)}
                        className="text-xs text-red-500 font-medium hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-emerald-600">{cart.getTotal().toLocaleString('vi-VN')}₫</span>
            </div>
            <button 
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </>
  );
}
