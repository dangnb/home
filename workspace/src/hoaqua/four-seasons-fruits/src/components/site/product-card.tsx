"use client";

// Product Card - Clean card design with image zoom on hover
// Rounded card, large image, clean price display, full-width CTA button

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, salePrice, image, unit });
    toast.success(`Đã thêm "${name}" vào giỏ hàng`);
  };

  const discountPercent =
    isOnSale && salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Sale Badge - top left */}
        {isOnSale && discountPercent > 0 && (
          <Badge className="absolute top-3 left-3 z-10 bg-red-600 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold rounded-md">
            -{discountPercent}%
          </Badge>
        )}

        {/* Organic/Featured badge - top left (if not on sale) */}
        {!isOnSale && category && (
          <Badge className="absolute top-3 left-3 z-10 bg-emerald-600 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide">
            Organic
          </Badge>
        )}

        {/* Wishlist button - top right */}
        <button
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image with zoom effect */}
        <Link href={`/products/${slug}`} className="block w-full h-full">
          <div className="w-full h-full overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl transition-transform duration-500 ease-out group-hover:scale-110">
                🍊
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        {/* Category */}
        {category && (
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1.5">
            {category.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 hover:text-emerald-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          {isOnSale && salePrice ? (
            <>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(salePrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-sm text-gray-400 font-medium">/{unit}</span>
        </div>

        {/* Add to Cart Button - full width, solid green */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </button>
      </div>
    </motion.div>
  );
}
