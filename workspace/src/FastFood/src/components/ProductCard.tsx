'use client';

import React from 'react';
import { Product } from '../data/products';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onOpenDetails,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="product-card group relative">
      {/* Wishlist Heart Icon */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorite ? 'Đã thích món này' : 'Yêu thích'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      )}

      {/* Popout 3D Dish Image Container */}
      <div className="food-image-wrapper cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {/* TriKun Flag Badge */}
        <div className="trikun-flag">TriKun</div>
      </div>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="discount-tag">-{product.discount}%</div>
      )}

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between pt-2">
        <div>
          <h3
            onClick={() => onOpenDetails(product)}
            className="product-title cursor-pointer hover:text-emerald-700 transition"
          >
            {product.name}
          </h3>

          {/* Rating & Sold count row */}
          <div className="rating-row">
            <div className="stars-box">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 font-extrabold text-slate-700 text-xs">
                {product.rating.toFixed(1)}
              </span>
            </div>

            <span className="sold-badge">Đã bán {product.soldCount}</span>
          </div>

          {/* Price row */}
          <div className="price-row">
            <span className="price-current">{formatVND(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="price-old">{formatVND(product.originalPrice)}</span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <button
            onClick={() => onOpenDetails(product)}
            className="btn-details"
          >
            Chi tiết
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="btn-cart-icon"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
