"use client";

// Product Card - Shows effective price (with promotion applied)

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  unit: string;
  isOnSale: boolean;
  category?: { name: string } | null;
  // Promotion-computed fields (optional for backward compat)
  effectivePrice?: number;
  discountPercent?: number;
  hasPromotion?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  salePrice,
  image,
  unit,
  isOnSale,
  category,
  effectivePrice,
  discountPercent,
  hasPromotion,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Use promotion-computed price if available, otherwise fallback
  const finalPrice = effectivePrice ?? (isOnSale && salePrice ? salePrice : price);
  const finalDiscount = discountPercent ?? (isOnSale && salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0);
  const isDiscounted = finalPrice < price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart with the effective (discounted) price
    addItem({
      id,
      name,
      price,
      salePrice: isDiscounted ? finalPrice : null,
      image,
      unit,
    });
    toast.success(`Đã thêm "${name}" vào giỏ hàng`);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100/80 p-3">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
        {/* Discount Badge */}
        {isDiscounted && finalDiscount > 0 && (
          <Badge className={`absolute top-2.5 left-2.5 z-10 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold rounded-md ${hasPromotion ? "bg-orange-500" : "bg-red-600"}`}>
            -{finalDiscount}%
          </Badge>
        )}

        {/* Organic badge (if no discount) */}
        {!isDiscounted && (
          <Badge className="absolute top-2.5 left-2.5 z-10 bg-emerald-600 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide">
            Organic
          </Badge>
        )}

        {/* Promotion indicator */}
        {hasPromotion && isDiscounted && (
          <Badge className="absolute top-2.5 right-12 z-10 bg-yellow-500 text-white border-0 shadow-md px-2 py-0.5 text-[10px] font-bold rounded-md">
            KM
          </Badge>
        )}

        {/* Wishlist button */}
        <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
          <Heart className="h-4 w-4" />
        </button>

        {/* Image */}
        <Link href={`/products/${slug}`} className="block w-full h-full">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl transition-transform duration-500 ease-out group-hover:scale-110">
              🍊
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 pt-4 px-1">
        {category && (
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">
            {category.name}
          </p>
        )}

        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 hover:text-emerald-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          {isDiscounted ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(finalPrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-sm text-gray-400 font-medium">/{unit}</span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.97] transition-all duration-200"
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
