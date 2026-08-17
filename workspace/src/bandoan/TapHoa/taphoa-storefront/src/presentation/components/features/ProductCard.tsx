'use client';
import { Product } from '@/domain/entities/Product';
import { useCartStore } from '@/presentation/store/useCartStore';
import { useToastStore } from '@/presentation/store/useToastStore';
import { Star, ShoppingCart, Flame } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/presentation/components/ui/ProductImage';

interface ProductCardProps {
  product: Product;
  showSoldBar?: boolean;
}

export function ProductCard({ product, showSoldBar = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const formatSold = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
  const soldPercent = Math.min(95, Math.floor((product.soldCount / (product.stock + product.soldCount)) * 100));
  const isAlmostGone = soldPercent > 70;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block bg-white rounded-lg overflow-hidden group hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-250 relative border border-transparent hover:border-[#00904a]/20"
    >
      {/* Discount badge — top-right */}
      {product.discountPercent && product.discountPercent > 0 && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-b from-[#ff424e] to-[#ee2d38] text-white text-center px-2 py-1.5 rounded-bl-lg min-w-[42px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
            <div className="text-[13px] font-black leading-none">{product.discountPercent}%</div>
            <div className="text-[8px] font-semibold uppercase tracking-wider mt-0.5 opacity-90">GIẢM</div>
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Popular badge */}
        {product.isPopular && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-[#ee4d2d] to-[#ff6633] text-white text-[9px] font-extrabold px-2 py-[3px] rounded-br-lg flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5" />
            Yêu thích
          </div>
        )}

        {/* "Thêm vào giỏ" hover bar */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#00904a] to-[#00b35a] text-white text-center py-2.5 text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer tracking-wide"
          onClick={handleAddToCart}
        >
          <span className="flex items-center justify-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            THÊM VÀO GIỎ
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1.5">
        {/* Product Name */}
        <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-[1.4] min-h-[36px] group-hover:text-[#00904a] transition-colors">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-end gap-2">
          <span className="text-[#ee4d2d] font-black text-[17px] leading-none tracking-tight">
            ₫{product.price.toLocaleString('vi-VN')}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through leading-none pb-[1px]">
              ₫{product.originalPrice.toLocaleString('vi-VN')}
            </span>
          )}
        </div>

        {/* Sold progress bar (for FlashSale) */}
        {showSoldBar && (
          <div className="relative h-[16px] bg-[#ffeee8] rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${isAlmostGone
                ? 'bg-gradient-to-r from-[#ff424e] to-[#ee4d2d]'
                : 'bg-gradient-to-r from-[#ff6633] to-[#ee4d2d]'
                }`}
              style={{ width: `${soldPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-extrabold text-white drop-shadow-sm uppercase tracking-wider">
                {isAlmostGone ? '🔥 Sắp hết' : `Đã bán ${formatSold(product.soldCount)}`}
              </span>
            </div>
          </div>
        )}

        {/* Rating + Sold (normal mode) */}
        {!showSoldBar && (
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-[#ffce3d] text-[#ffce3d]' : 'fill-gray-200 text-gray-200'
                    }`}
                />
              ))}
              <span className="text-[10px] text-gray-400 ml-0.5">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">
              Đã bán {formatSold(product.soldCount)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
