'use client';

import React from 'react';
import { ArrowUpDown, Flame, Star, Coins, Heart, RotateCcw } from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'bestseller' | 'rating';

interface FilterSortBarProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filterDiscountOnly: boolean;
  setFilterDiscountOnly: (val: boolean) => void;
  filterHighRating: boolean;
  setFilterHighRating: (val: boolean) => void;
  filterUnder50k: boolean;
  setFilterUnder50k: (val: boolean) => void;
  filterFavoritesOnly: boolean;
  setFilterFavoritesOnly: (val: boolean) => void;
  favoriteCount: number;
  onResetFilters: () => void;
}

export default function FilterSortBar({
  sortBy,
  setSortBy,
  filterDiscountOnly,
  setFilterDiscountOnly,
  filterHighRating,
  setFilterHighRating,
  filterUnder50k,
  setFilterUnder50k,
  filterFavoritesOnly,
  setFilterFavoritesOnly,
  favoriteCount,
  onResetFilters,
}: FilterSortBarProps) {
  const hasActiveFilters =
    sortBy !== 'default' ||
    filterDiscountOnly ||
    filterHighRating ||
    filterUnder50k ||
    filterFavoritesOnly;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 py-3 shadow-sm">
      <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider mr-1 hidden sm:inline-block">
            Lọc món:
          </span>

          {/* Favorites Chip */}
          <button
            onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border ${
              filterFavoritesOnly
                ? 'bg-rose-50 border-rose-400 text-rose-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Món Yêu Thích</span>
            {favoriteCount > 0 && (
              <span className="bg-rose-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Discount Only Chip */}
          <button
            onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border ${
              filterDiscountOnly
                ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>🔥 Giảm Giá Hot</span>
          </button>

          {/* High Rating 4.8+ Chip */}
          <button
            onClick={() => setFilterHighRating(!filterHighRating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border ${
              filterHighRating
                ? 'bg-yellow-50 border-yellow-400 text-yellow-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-yellow-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
            <span>⭐ Đánh Giá 4.8+</span>
          </button>

          {/* Under 50k Chip */}
          <button
            onClick={() => setFilterUnder50k(!filterUnder50k)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border ${
              filterUnder50k
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>💰 Dưới 50k</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 hover:bg-slate-100 transition"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <ArrowUpDown className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-600">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
          >
            <option value="default">Mặc định</option>
            <option value="bestseller">🔥 Bán chạy nhất</option>
            <option value="rating">⭐ Đánh giá cao nhất</option>
            <option value="price-asc">💵 Giá: Thấp đến Cao</option>
            <option value="price-desc">💎 Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>
    </div>
  );
}
