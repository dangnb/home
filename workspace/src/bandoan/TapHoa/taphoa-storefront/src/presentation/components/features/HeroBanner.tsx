'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Mua Sắm Tạp Hóa\nGiá Sỉ Tại Nhà',
    subtitle: 'CHUỖI TẠP HÓA VIỆT',
    desc: 'Hơn 4816 cửa hàng · Giao nhanh 2H · Giá tốt nhất TP.HCM',
    cta: 'MUA SẮM NGAY',
    ctaSub: 'Miễn phí giao hàng đơn từ 150K',
    bg: 'from-[#004d29] via-[#006633] to-[#00904a]',
    accent: 'bg-yellow-400 text-gray-900',
  },
  {
    id: 2,
    title: 'Đặc Sản Vùng Miền\nGiao Tận Nhà',
    subtitle: 'GÓC QUÊ NHÀ',
    desc: 'Muối tôm Tây Ninh · Gạo ST25 · Mật ong rừng · Bánh tráng',
    cta: 'KHÁM PHÁ NGAY',
    ctaSub: 'Giảm 20% cho đơn đầu tiên',
    bg: 'from-amber-900 via-amber-700 to-amber-500',
    accent: 'bg-white text-amber-800',
  },
  {
    id: 3,
    title: 'Flash Sale\nMỗi Ngày',
    subtitle: 'GIẢM ĐẾN 50%',
    desc: 'Hàng nghìn sản phẩm giảm giá sốc · Số lượng có hạn · Đặt ngay!',
    cta: 'XEM DEAL HOT',
    ctaSub: 'Kết thúc lúc 23:59 hôm nay',
    bg: 'from-rose-900 via-rose-700 to-rose-500',
    accent: 'bg-yellow-400 text-rose-900',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-xl group">
      <div className={`bg-gradient-to-br ${slide.bg} text-white px-8 md:px-14 py-10 md:py-14 min-h-[300px] md:min-h-[380px] flex items-center relative overflow-hidden`}>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Content */}
        <div className="max-w-lg relative z-10 animate-fade-in" key={slide.id}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/90 border border-white/10 mb-4">
            <Gift className="w-3 h-3" />
            {slide.subtitle}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black leading-[1.08] tracking-tight whitespace-pre-line mb-3">
            {slide.title}
          </h2>
          <p className="text-sm text-white/60 mb-6 max-w-md">
            {slide.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/#products"
              className={`inline-flex items-center gap-2 px-8 py-3.5 ${slide.accent} font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0`}
            >
              {slide.cta}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-[11px] text-white/50 font-medium sm:self-center">{slide.ctaSub}</span>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 text-[120px] md:text-[160px] opacity-[0.06] pointer-events-none select-none font-black">
          {current === 0 ? '🛒' : current === 1 ? '🏡' : '⚡'}
        </div>
      </div>

      {/* Nav buttons */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-1.5'}`}
          />
        ))}
      </div>
    </div>
  );
}
