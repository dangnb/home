'use client';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/domain/entities/Product';
import { ProductCard } from './ProductCard';
import { Zap, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FlashSaleProps {
  products: Product[];
}

export function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const update = () => {
      const diff = endOfDay.getTime() - new Date().getTime();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products.length) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#ff424e] via-[#ee4d2d] to-[#ff6633] rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Flash icon animated */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-count-pulse" />
            <h2 className="text-white font-black text-lg uppercase tracking-wide drop-shadow-sm">
              Flash Sale
            </h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1 ml-2">
            {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((val, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-white font-black text-sm">:</span>}
                <span className="inline-flex items-center justify-center w-8 h-7 bg-black/80 text-white font-black text-sm rounded-md shadow-inner">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/#products"
          className="hidden sm:flex items-center gap-1 text-white/90 hover:text-white text-xs font-semibold transition-colors"
        >
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Products scroll */}
      <div className="relative group/scroll bg-white/5 backdrop-blur-sm">
        <div
          ref={scrollRef}
          className="flex gap-[2px] overflow-x-auto scrollbar-hide px-[2px] py-[2px]"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[170px] sm:w-[190px]">
              <ProductCard product={product} showSoldBar />
            </div>
          ))}
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/95 shadow-lg rounded-r-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/95 shadow-lg rounded-l-lg flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </section>
  );
}
