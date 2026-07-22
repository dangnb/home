'use client';
import { Category } from '@/domain/entities/Product';
import Link from 'next/link';
import {
  Home, Heart, Baby, Sparkles, ChefHat, Coffee, SprayCan, BookOpen, Zap, LayoutGrid
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  ChefHat: <ChefHat className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  SprayCan: <SprayCan className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
};

interface CategoryStripProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (catId?: string) => void;
}

export function CategoryStrip({ categories, selectedCategory, onSelectCategory }: CategoryStripProps) {
  if (!categories.length) return null;

  return (
    <div className="bg-white rounded-sm border border-gray-100">
      {/* Section title — Shopee style */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Danh Mục</h2>
      </div>

      {/* Category grid — 5 cols on desktop, scrollable on mobile */}
      <div className="grid grid-cols-5 md:grid-cols-10 divide-x divide-y divide-gray-50">
        {/* All */}
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`flex flex-col items-center justify-center gap-1.5 py-4 px-2 transition-colors hover:bg-gray-50 ${
            !selectedCategory ? 'text-[#00904a] bg-green-50/50' : 'text-gray-500'
          }`}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[11px] font-medium leading-tight text-center">Tất cả</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex flex-col items-center justify-center gap-1.5 py-4 px-2 transition-colors hover:bg-gray-50 ${
              selectedCategory === cat.id ? 'text-[#00904a] bg-green-50/50' : 'text-gray-500'
            }`}
          >
            {iconMap[cat.iconName] || <LayoutGrid className="w-6 h-6" />}
            <span className="text-[11px] font-medium leading-tight text-center line-clamp-2">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
