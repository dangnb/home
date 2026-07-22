'use client';

import { useCartStore } from '@/presentation/store/useCartStore';
import { useToastStore } from '@/presentation/store/useToastStore';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    getTotalPrice,
    getShippingFee,
    getFinalPrice
  } = useCartStore();

  const { showToast } = useToastStore();
  const [inputCoupon, setInputCoupon] = useState('');

  const totalPrice = getTotalPrice();
  const shippingFee = getShippingFee();
  const finalPrice = getFinalPrice();
  const freeShipThreshold = 150000;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      showToast(`Đã áp dụng mã ${inputCoupon.toUpperCase()}`);
      setInputCoupon('');
    } else {
      showToast('Mã giảm giá không hợp lệ (Thử: TAPHOA10, FREESHIP)', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500">Hãy chọn mua những mặt hàng thực phẩm tươi ngon nhất cho gia đình nhé!</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Khám phá sản phẩm ngay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-black text-gray-900">Giỏ Hàng Của Bạn</h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Xóa toàn bộ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex gap-4 items-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="text-xs md:text-sm font-bold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <div className="text-[11px] text-gray-400">{item.product.unit}</div>
                <div className="text-sm font-black text-emerald-700">
                  {item.product.price.toLocaleString('vi-VN')}đ
                </div>
              </div>

              {/* Quantity controller */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product.id)}
                className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 h-fit">
          <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Tóm Tắt Đơn Hàng</h3>

          {/* Coupon form */}
          {couponCode ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Mã giảm: <strong>{couponCode}</strong></span>
              </div>
              <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline">
                Bỏ mã
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Mã giảm (TAPHOA10)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Áp dụng
              </button>
            </form>
          )}

          <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Tạm tính ({items.length} món):</span>
              <span className="font-bold text-gray-800">{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-bold text-gray-800">
                {shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shippingFee.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            {couponCode && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Giảm giá:</span>
                <span>-10.000đ</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-100">
              <span>Thành tiền:</span>
              <span className="text-emerald-700">{finalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
          >
            <span>TIẾN HÀNH ĐẶT HÀNG</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
