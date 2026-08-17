'use client';

import React, { useState } from 'react';
import { Product } from '../data/products';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Truck,
  ChevronLeft,
} from 'lucide-react';
import { OrderDetails } from './OrderTrackerModal';

export interface CartItem {
  id: string; // unique id per item instance
  product: Product;
  quantity: number;
  spicyLevel?: string;
  addOns?: string[];
  itemUnitPrice: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (order: OrderDetails) => void;
  appliedPromoCode?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  appliedPromoCode = '',
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [promoCode, setPromoCode] = useState(appliedPromoCode);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr' | 'card'>('cod');

  if (!isOpen) return null;

  const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.itemUnitPrice * item.quantity,
    0
  );

  const freeShipThreshold = 100000;
  const shippingFee = subtotal >= freeShipThreshold || subtotal === 0 ? 0 : 15000;

  const applyPromoCodeStr = (codeToApply: string) => {
    const clean = codeToApply.trim().toUpperCase();
    if (clean === 'TRIKUN10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setPromoSuccess(true);
    } else if (clean === 'TRIKUN20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscountAmount(disc);
      setPromoSuccess(true);
    } else if (clean) {
      alert('Mã giảm giá không hợp lệ! Thử dùng mã: TRIKUN10 hoặc TRIKUN20');
    }
  };

  const applyPromo = () => applyPromoCodeStr(promoCode);

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setStep('checkout');
  };

  const handleFinalSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    setIsCheckingOut(true);

    setTimeout(() => {
      setIsCheckingOut(false);
      const newOrder: OrderDetails = {
        orderId: Math.floor(100000 + Math.random() * 900000).toString(),
        customerName,
        phone,
        address,
        note,
        paymentMethod:
          paymentMethod === 'cod'
            ? 'Thanh toán khi nhận hàng (COD)'
            : paymentMethod === 'qr'
            ? 'Chuyển khoản QR Ngân hàng / MoMo'
            : 'Thẻ ATM / Thẻ quốc tế',
        items: [...cartItems],
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        createdAt: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      onClearCart();
      setStep('cart');
      onClose();

      if (onOrderPlaced) {
        onOrderPlaced(newOrder);
      }
    }, 1500);
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('cart')}
                className="mr-1 p-1 hover:bg-white/20 rounded-full transition"
                title="Quay lại giỏ hàng"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-black text-base">
              {step === 'cart' ? 'Giỏ hàng của bạn' : 'Thông tin giao hàng'}
            </h2>
            <span className="bg-yellow-400 text-yellow-950 font-black text-xs px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} món
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {step === 'cart' && (
          <>
            {/* Free Shipping Progress Bar */}
            <div className="bg-emerald-50 p-3 border-b border-emerald-100 text-xs font-semibold text-emerald-800">
              {subtotal >= freeShipThreshold ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đơn hàng của bạn được Miễn phí vận chuyển (Freeship)!</span>
                </div>
              ) : (
                <div>
                  <span>
                    Mua thêm{' '}
                    <strong className="text-emerald-700">
                      {formatVND(freeShipThreshold - subtotal)}
                    </strong>{' '}
                    để nhận Freeship 0đ!
                  </span>
                  <div className="w-full bg-emerald-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 py-16">
                  <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.5]" />
                  <p className="font-bold text-slate-600">Giỏ hàng đang trống</p>
                  <p className="text-xs text-slate-400">Hãy thêm món ngon vào giỏ ngay nhé!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Extra options summary */}
                        {(item.spicyLevel || (item.addOns && item.addOns.length > 0)) && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.spicyLevel && <span>• {item.spicyLevel} </span>}
                            {item.addOns && item.addOns.length > 0 && (
                              <span>• Kèm: {item.addOns.join(', ')}</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-emerald-700 text-sm">
                          {formatVND(item.itemUnitPrice * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-1.5 py-0.5 bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-slate-600 hover:text-slate-900 font-bold p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code & Totals Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                {/* Promo Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Mã giảm giá (nhập TRIKUN10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white uppercase"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 rounded-xl transition"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã áp dụng mã giảm {formatVND(discountAmount)}!
                  </p>
                )}

                {/* Subtotal breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-1">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-bold text-slate-800">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 uppercase font-black">Miễn phí</span>
                      ) : (
                        formatVND(shippingFee)
                      )}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Mã giảm giá</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Tổng thanh toán</span>
                    <span className="text-emerald-700 text-lg">{formatVND(finalTotal)}</span>
                  </div>
                </div>

                {/* Next Step Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition text-sm cursor-pointer"
                >
                  <span>Tiếp tục đặt hàng ({formatVND(finalTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT SHIPPING & PAYMENT FORM */}
        {step === 'checkout' && (
          <form onSubmit={handleFinalSubmitOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Customer Info Box */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" /> Thông tin người nhận
                </h3>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    Số điện thoại nhận hàng *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    Địa chỉ giao hàng chi tiết *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số 123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    Ghi chú cho quán / Shipper (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Giao lên tầng 3, ít cay..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" /> Phương thức thanh toán
                </h3>

                <div className="space-y-2">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-emerald-700" />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-[10px] text-slate-500">Trả tiền mặt cho Shipper khi giao tới nơi</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-emerald-700"
                    />
                  </label>

                  {/* QR Banking / Momo */}
                  <label
                    onClick={() => setPaymentMethod('qr')}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'qr'
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-emerald-700" />
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">
                            Chuyển khoản QR Ngân hàng / MoMo
                          </p>
                          <p className="text-[10px] text-slate-500">Quét mã QR tự động xác nhận đơn</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'qr'}
                        onChange={() => setPaymentMethod('qr')}
                        className="accent-emerald-700"
                      />
                    </div>

                    {paymentMethod === 'qr' && (
                      <div className="mt-3 p-3 bg-white border border-emerald-200 rounded-xl text-center flex flex-col items-center">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=TriKunFastFoodPayment"
                          alt="QR Payment"
                          className="w-28 h-28 border border-slate-200 rounded-lg shadow-sm mb-1"
                        />
                        <p className="text-[11px] font-black text-emerald-800">TriKun FastFood Official</p>
                        <p className="text-[10px] text-slate-500">STK: 190068689999 • MBBank</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition text-sm disabled:opacity-50 cursor-pointer"
              >
                {isCheckingOut ? (
                  <span>Đang xử lý đơn hàng...</span>
                ) : (
                  <>
                    <span>Xác nhận Đặt Hàng ({formatVND(finalTotal)})</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
