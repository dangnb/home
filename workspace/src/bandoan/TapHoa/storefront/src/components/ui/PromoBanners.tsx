'use client';
import { Zap, Gift, Percent } from 'lucide-react';
import Link from 'next/link';

export default function PromoBanners() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Link 
        href="/category/trai-cay" 
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-400 to-red-500 text-white group card-hover"
      >
        <div className="absolute -bottom-6 -right-6 text-[80px] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">🍊</div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">Flash Sale</span>
          </div>
          <h3 className="text-lg font-black mb-1">Trái cây mùa hè</h3>
          <p className="text-sm opacity-80">Giảm đến 30% các loại trái cây nhập khẩu</p>
        </div>
      </Link>

      <Link 
        href="/category/rau-cu" 
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-400 to-green-600 text-white group card-hover"
      >
        <div className="absolute -bottom-6 -right-6 text-[80px] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">🥦</div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <Gift className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">Combo tiết kiệm</span>
          </div>
          <h3 className="text-lg font-black mb-1">Rau củ hữu cơ</h3>
          <p className="text-sm opacity-80">Mua 3 tặng 1, tươi sạch từ nông trại</p>
        </div>
      </Link>

      <Link 
        href="/category/thit-ca" 
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white group card-hover"
      >
        <div className="absolute -bottom-6 -right-6 text-[80px] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">🐟</div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <Percent className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">Ưu đãi</span>
          </div>
          <h3 className="text-lg font-black mb-1">Thịt cá tươi sống</h3>
          <p className="text-sm opacity-80">Freeship đơn từ 200.000₫</p>
        </div>
      </Link>
    </section>
  );
}
