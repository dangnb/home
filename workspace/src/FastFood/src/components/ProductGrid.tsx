'use client';

import React from 'react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';
import { Utensils } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  activeCategoryName: string;
  favoriteIds?: number[];
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onOpenDetails,
  onAddToCart,
  activeCategoryName,
  favoriteIds = [],
  onToggleFavorite,
}: ProductGridProps) {
  return (
    <section className="container-custom">
      {/* Subheader */}
      <div className="subheader-bar">
        <div className="subheader-dot" />
        <span>
          {products.length} món ngon đang chờ bạn{' '}
          {activeCategoryName !== 'Tất cả' && (
            <span className="text-emerald-700 font-extrabold ml-1">
              ({activeCategoryName})
            </span>
          )}
        </span>
      </div>

      {/* Grid or Empty */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
              onAddToCart={onAddToCart}
              isFavorite={favoriteIds.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/60 rounded-3xl my-8 text-center border-2 border-dashed border-emerald-300/60">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Không tìm thấy món ăn nào!
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Rất tiếc, danh mục này hiện chưa có món ăn khớp với từ khóa hoặc bộ lọc của bạn. Hãy thử chọn danh mục khác nhé.
          </p>
        </div>
      )}
    </section>
  );
}
