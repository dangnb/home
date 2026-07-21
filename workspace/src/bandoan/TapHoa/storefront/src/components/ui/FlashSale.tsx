'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/types/models';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/features/products/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/ToastProvider';
import { useInView } from '@/hooks/useInView';
import { Zap } from 'lucide-react';

function useCountdown(hours: number) {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Set end time to next midnight or a fixed period
    const now = new Date();
    const end = new Date(now);
    end.setHours(now.getHours() + hours, 0, 0, 0);
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  return { h, m, s, isExpired: timeLeft <= 0 };
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white font-mono font-black text-lg md:text-xl w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-lg shadow-md">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 font-medium">{label}</span>
    </div>
  );
}

export default function FlashSale() {
  const { ref, isInView } = useInView({ rootMargin: '200px' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();
  const countdown = useCountdown(6);

  useEffect(() => {
    if (!isInView || fetched) return;
    setFetched(true);
    async function load() {
      try {
        const result = await productService.getProducts(1, 6);
        setProducts(result.items || []);
      } catch (e) {
        console.error('Failed to load flash sale products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isInView, fetched]);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <section ref={ref} className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-black">Flash Sale</h2>
            <p className="text-xs text-red-100">Giá sốc, số lượng có hạn!</p>
          </div>
        </div>
        {/* Countdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-red-100 mr-1 font-medium">Kết thúc trong</span>
          <TimeBox value={countdown.h} label="Giờ" />
          <span className="text-white font-bold text-lg -mt-4">:</span>
          <TimeBox value={countdown.m} label="Phút" />
          <span className="text-white font-bold text-lg -mt-4">:</span>
          <TimeBox value={countdown.s} label="Giây" />
        </div>
      </div>

      {/* Products */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="aspect-square skeleton opacity-30" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 w-3/4 opacity-30" />
                  <div className="skeleton h-4 w-1/2 opacity-30" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <ProductCard product={product} onAdd={handleAdd} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
