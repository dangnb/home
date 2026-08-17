'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, ChefHat, Bike, ShieldCheck, MapPin, Phone, RefreshCw } from 'lucide-react';
import { CartItem } from './CartDrawer';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  createdAt: string;
}

interface OrderTrackerModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export default function OrderTrackerModal({ order, onClose }: OrderTrackerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(18);

  useEffect(() => {
    if (!order) return;

    // Simulate timeline progress
    const t1 = setTimeout(() => setCurrentStep(2), 3000); // 3s -> Cooking
    const t2 = setTimeout(() => setCurrentStep(3), 8000); // 8s -> Delivering
    const t3 = setTimeout(() => setCurrentStep(4), 16000); // 16s -> Delivered

    const countdown = setInterval(() => {
      setTimeLeftMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(countdown);
    };
  }, [order]);

  if (!order) return null;

  const steps = [
    { id: 1, title: 'Đã nhận đơn', desc: 'Đã xác nhận thanh toán', icon: Clock },
    { id: 2, title: 'Đang chế biến', desc: 'Bếp TriKun đang nấu', icon: ChefHat },
    { id: 3, title: 'Đang giao hàng', desc: 'Shipper đang trên đường', icon: Bike },
    { id: 4, title: 'Giao thành công', desc: 'Chúc bạn ngon miệng!', icon: CheckCircle2 },
  ];

  const formatVND = (num: number) => num.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-xl p-0 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white flex items-center justify-between">
          <div>
            <span className="bg-yellow-400 text-yellow-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Theo dõi đơn hàng
            </span>
            <h3 className="text-xl font-black mt-1">Mã đơn #{order.orderId}</h3>
            <p className="text-xs text-emerald-100/90 font-medium">
              Đặt lúc: {order.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Timeline Status */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between mb-6 relative">
            {/* Progress Bar Background */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0" />
            <div
              className="absolute top-4 left-6 h-1 bg-emerald-600 transition-all duration-500 -z-0"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
            />

            {steps.map((step) => {
              const Icon = step.icon;
              const isDone = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-emerald-200 scale-110' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-extrabold mt-2 text-center ${
                      isDone ? 'text-emerald-800' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic ETA box */}
          {currentStep < 4 ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <Bike className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    Dự kiến giao tới nơi
                  </h4>
                  <p className="text-lg font-black text-emerald-700">
                    ~ {timeLeftMinutes} phút nữa
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Shipper: TriKun Express 🛵
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl p-4 text-center font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Đơn hàng đã được giao thành công! Chúc bạn dùng bữa ngon miệng ❤️</span>
            </div>
          )}
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
          {/* Delivery Information */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" /> Thông tin giao hàng
            </h4>
            <div className="text-xs text-slate-700 space-y-1">
              <p>
                <strong className="text-slate-900">{order.customerName}</strong> ({order.phone})
              </p>
              <p className="text-slate-600">{order.address}</p>
              {order.note && <p className="text-slate-500 italic">Ghi chú: "{order.note}"</p>}
              <p className="text-emerald-700 font-bold">Thanh toán: {order.paymentMethod}</p>
            </div>
          </div>

          {/* Ordered items list */}
          <div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Danh sách món ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h5 className="font-extrabold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity}x • {formatVND(item.itemUnitPrice)}
                        {item.spicyLevel && ` • ${item.spicyLevel}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-slate-800">
                    {formatVND(item.itemUnitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold">Tổng tiền thanh toán:</span>
            <span className="text-lg font-black text-emerald-700">{formatVND(order.finalTotal)}</span>
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition"
          >
            Đóng màn hình
          </button>
        </div>
      </div>
    </div>
  );
}
