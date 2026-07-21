'use client';
import Link from 'next/link';
import { Sparkles, Truck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 animate-gradient p-8 md:p-14 text-white">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-400/20 rounded-full blur-xl" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-300/10 rounded-full blur-lg animate-float" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <div className="animate-fadeInUp stagger-1">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              Tạp hóa thông minh
            </span>
          </div>
          <h1 className="animate-fadeInUp stagger-2 text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
            Mua sắm<br />
            <span className="text-emerald-100">dễ dàng hơn</span>
          </h1>
          <p className="animate-fadeInUp stagger-3 text-emerald-100/90 text-lg max-w-md mb-8 leading-relaxed">
            Hàng ngàn sản phẩm tươi ngon, giá siêu hấp dẫn. Giao hàng nhanh chóng tận cửa nhà bạn.
          </p>
          <div className="animate-fadeInUp stagger-4 flex flex-wrap gap-3">
            <Link 
              href="#products"
              className="bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-full hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 text-sm"
            >
              Mua sắm ngay →
            </Link>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm font-medium px-5 py-3.5 rounded-full text-sm">
              <Truck className="w-4 h-4" />
              Freeship đơn từ 200k
            </span>
          </div>
        </div>

        <div className="animate-fadeInUp stagger-5 text-[120px] md:text-[160px] leading-none select-none animate-float">
          🛒
        </div>
      </div>
    </section>
  );
}
