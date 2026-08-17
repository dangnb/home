'use client';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function MobileBottomNav({ onOpenCart }: { onOpenCart: () => void }) {
  const pathname = usePathname();
  const itemCount = useCartStore(state => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-gray-200/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        <Link href="/" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${isActive('/') ? 'text-emerald-600' : 'text-gray-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>

        <Link href="/search" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${isActive('/search') ? 'text-emerald-600' : 'text-gray-400'}`}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tìm kiếm</span>
        </Link>

        <button onClick={onOpenCart} className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-400 relative">
          <ShoppingBag className="w-5 h-5" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-0.5 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] font-bold">Giỏ hàng</span>
        </button>

        <Link href="/profile" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${isActive('/profile') ? 'text-emerald-600' : 'text-gray-400'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tài khoản</span>
        </Link>
      </div>
    </nav>
  );
}
