'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Copy, Check, ArrowRight, ChevronLeft, ChevronRight, Gift, Tag } from 'lucide-react';

interface BannerSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  code?: string;
  bgGradient: string;
  image: string;
  btnText: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    badge: '🔥 SIÊU DEAL HOT NẤT HÈ',
    title: 'Combo Tiệc TriKun',
    highlight: 'Giảm Ngay 20%',
    description: '4 Miếng gà rán giòn rụm + 1 Mì Ý + 1 Khoai tây chiên XL + 2 Lon Coca lạnh.',
    code: 'TRIKUN20',
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    btnText: 'Sử dụng mã TRIKUN20',
  },
  {
    id: 2,
    badge: '🚀 FREESHIP 0Đ TOÀN QUỐC',
    title: 'Đơn từ 100.000đ',
    highlight: 'Miễn Phí Vận Chuyển',
    description: 'Giao hàng siêu tốc trong 15-20 phút. Món ăn luôn nóng hổi và giòn tan khi đến tay.',
    code: 'TRIKUN10',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800&auto=format&fit=crop',
    btnText: 'Nhận ngay Mã Giảm 10%',
  },
  {
    id: 3,
    badge: '🍔 ĐẶC QUYỀN BURGER ÚC',
    title: 'Burger Bò Phô Mai Kép',
    highlight: 'Tặng 1 Nước Ép Cam',
    description: 'Thịt bò Úc nướng lửa hồng béo ngậy kèm 2 lát phô mai Cheddar đậm đà.',
    bgGradient: 'from-rose-700 via-pink-700 to-purple-800',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    btnText: 'Khám phá Burger Hot',
  },
];

interface HeroBannerProps {
  onApplyPromoCode?: (code: string) => void;
  onSelectCategory?: (category: string) => void;
}

export default function HeroBanner({ onApplyPromoCode, onSelectCategory }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyPromoCode) {
      onApplyPromoCode(code);
    }
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container-custom py-4">
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r ${slide.bgGradient} text-white transition-all duration-700 min-h-[260px] sm:min-h-[300px] flex items-center`}
      >
        {/* Decorative Background Glow Circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 sm:p-8">
          {/* Text Content Left */}
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black text-yellow-300 tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
              {slide.title} <br />
              <span className="text-yellow-300 drop-shadow">{slide.highlight}</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {slide.code ? (
                <button
                  onClick={() => handleCopyCode(slide.code)}
                  className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-yellow-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-black/20 transition cursor-pointer"
                >
                  {copiedCode === slide.code ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                      <span>Đã chép mã {slide.code}!</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      <span>{slide.btnText}</span>
                      <Copy className="w-3.5 h-3.5 opacity-70" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => onSelectCategory && onSelectCategory('burger')}
                  className="bg-white hover:bg-slate-100 active:scale-95 text-slate-900 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-black/20 transition cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-rose-600" />
                  <span>Xem Chi Tiết Món Hot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dish Image Right */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl group-hover:blur-2xl transition" />
              <img
                src={slide.image}
                alt={slide.title}
                className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-full border-4 border-white/80 shadow-2xl transform hover:scale-105 transition duration-500"
              />
              {slide.code && (
                <div className="absolute -bottom-2 -left-2 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-1.5 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Mã: <strong className="text-yellow-300">{slide.code}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
