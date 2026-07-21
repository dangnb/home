import Link from 'next/link';
import { Product } from '@/types/models';
import { Plus, Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const { addItem: addWish, removeItem: removeWish, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  // Calculate discount from wholesalePrice (used as "original price" for display)
  const originalPrice = product.wholesalePrice && product.wholesalePrice > product.price
    ? product.wholesalePrice
    : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover group flex flex-col relative">
      {/* Image */}
      <Link href={`/product/${product.slug || product.id}`} className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer">
        {product.mainImageUrl ? (
          <img 
            src={product.mainImageUrl.startsWith('http') ? product.mainImageUrl : `http://localhost:5222${product.mainImageUrl}`} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
            loading="lazy"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-500 ease-out">📦</span>
        )}

        {/* ===== Promo Stickers ===== */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Discount badge */}
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {/* Low stock badge */}
          {!isOutOfStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Sắp hết
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.preventDefault(); wishlisted ? removeWish(product.id) : addWish(product); }}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${wishlisted ? 'bg-red-500 text-white shadow-md' : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow-sm'}`}
          aria-label="Yêu thích"
        >
          <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold text-xs px-3 py-1.5 rounded-full">Hết hàng</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.slug || product.id}`}>
            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug hover:text-emerald-600 transition-colors" title={product.name}>
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            {product.supplierName && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {product.supplierName}
              </span>
            )}
            {product.unit && (
              <span className="text-xs text-gray-400">/{product.unit}</span>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-black text-emerald-600 text-lg leading-none">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through mt-0.5">
                {originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          {!isOutOfStock && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onAdd(product);
              }}
              className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200/50 active:scale-95 transition-all duration-200 flex-shrink-0"
              aria-label="Thêm vào giỏ"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
