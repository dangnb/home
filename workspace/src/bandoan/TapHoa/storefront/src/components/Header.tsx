'use client';
import { ShoppingCart, Search, Menu, User, LogOut, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { customer, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm">T</div>
            <span className="text-lg font-black tracking-tight text-gray-900 hidden sm:block">
              TapHoa<span className="text-emerald-600">.</span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <Link href="/search" className="relative w-full block">
            <div
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100/80 border border-transparent hover:bg-white hover:border-gray-200 rounded-xl text-sm transition-all text-gray-400 cursor-pointer"
            >
              Tìm sản phẩm, danh mục...
            </div>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {mounted && customer ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                  {customer.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-gray-700 max-w-[100px] truncate">{customer.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-bold text-gray-800 text-sm">{customer.fullName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{customer.phoneNumber}</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">
                        {customer.loyaltyPoints} điểm
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-medium text-gray-500">{customer.tier}</span>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Package className="w-4 h-4 text-gray-400" />
                    Đơn hàng của tôi
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : mounted ? (
            <Link 
              href="/login"
              className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Đăng nhập</span>
            </Link>
          ) : null}

          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 text-[10px] font-bold text-white bg-red-500 rounded-full px-1 animate-bounce-in">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
