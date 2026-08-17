'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  UtensilsCrossed,
  PhoneCall,
  Bike,
  MapPin,
  Flame,
  Sparkles,
  ChevronDown,
  Clock,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { OrderDetails } from './OrderTrackerModal';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeOrder?: OrderDetails | null;
  onOpenOrderTracker?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  activeOrder,
  onOpenOrderTracker,
}: HeaderProps) {
  const [selectedAddress, setSelectedAddress] = useState('123 Nguyễn Huệ, Quận 1, TP.HCM');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const addresses = [
    '123 Nguyễn Huệ, Quận 1, TP.HCM',
    '456 Lê Lợi, Quận 3, TP.HCM',
    '789 Cầu Giấy, Q. Cầu Giấy, Hà Nội',
    '12 Trần Phú, Q. Hải Châu, Đà Nẵng',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-md transition-all duration-300">
      {/* Top Utility Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white text-xs font-semibold py-1.5 shadow-inner">
        <div className="container-custom flex items-center justify-between">
          {/* Left info */}
          <div className="flex items-center gap-4 text-emerald-100 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-bold text-yellow-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              <span>Đang mở cửa • Phục vụ 24/7</span>
            </span>
            <span className="hidden md:inline text-emerald-400/60">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-100 font-medium">
              <Clock className="w-3.5 h-3.5 text-yellow-300" />
              <span>Giao hàng tận nơi 15 - 20 phút</span>
            </span>
            <span className="hidden lg:inline text-emerald-400/60">•</span>
            <span className="hidden lg:flex items-center gap-1 text-yellow-200 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Freeship cho đơn từ 100k</span>
            </span>
          </div>

          {/* Right Hotline & Support */}
          <div className="flex items-center gap-3">
            <a
              href="tel:19006868"
              className="flex items-center gap-1.5 text-yellow-300 font-black hover:text-white transition text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>Hotline: 1900 6868</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 select-none cursor-pointer group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition duration-300 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600 transform group-hover:rotate-12 transition duration-300" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white shadow-sm uppercase">
                HOT
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  TriKun
                </span>
                <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  FastFood
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <span>Ăn Ngon • Giao Nhanh</span>
                <span className="text-yellow-500 font-extrabold">★ 4.9</span>
              </p>
            </div>
          </div>

          {/* Delivery Location Selector Badge */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-3.5 py-2 rounded-2xl text-slate-800 transition cursor-pointer text-xs font-bold"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left max-w-[200px]">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Giao hàng tới
                </span>
                <span className="text-xs font-extrabold text-slate-800 truncate block">
                  {selectedAddress}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {showAddressDropdown && (
              <div className="absolute left-0 top-12 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-fadeIn">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                  Chọn địa chỉ nhận hàng:
                </p>
                {addresses.map((addr) => (
                  <button
                    key={addr}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      selectedAddress === addr
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{addr}</span>
                    {selectedAddress === addr && <span className="text-emerald-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 md:mx-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                placeholder="Tìm đùi gà chiên, burger bò, trà đào..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs font-bold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/20 shadow-inner transition duration-200"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 hidden sm:inline-block">
                  TÌM MÓN 🔍
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Active Order Tracker Button */}
            {activeOrder && onOpenOrderTracker && (
              <button
                onClick={onOpenOrderTracker}
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-yellow-400/30 active:scale-95 transition cursor-pointer"
                title="Theo dõi đơn hàng đang giao"
              >
                <Bike className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">Đơn #{activeOrder.orderId}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition cursor-pointer font-black text-xs"
              title="Xem giỏ hàng"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-emerald-600 shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
