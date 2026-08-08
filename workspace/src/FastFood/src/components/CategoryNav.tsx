'use client';

import React from 'react';
import { CATEGORIES } from '../data/products';
import {
  Utensils,
  Drumstick,
  Sandwich,
  Flame,
  CookingPot,
  CupSoda,
  Popcorn,
  Cake,
  PlusCircle,
} from 'lucide-react';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'all':
      return <Utensils className="w-5 h-5" />;
    case 'ga-ran':
      return <Drumstick className="w-5 h-5" />;
    case 'burger':
      return <Sandwich className="w-5 h-5" />;
    case 'combo-hot':
      return <Flame className="w-5 h-5" />;
    case 'mi-y':
      return <CookingPot className="w-5 h-5" />;
    case 'nuoc-uong':
      return <CupSoda className="w-5 h-5" />;
    case 'an-vat':
      return <Popcorn className="w-5 h-5" />;
    case 'trang-mieng':
      return <Cake className="w-5 h-5" />;
    case 'mon-them':
      return <PlusCircle className="w-5 h-5" />;
    default:
      return <Utensils className="w-5 h-5" />;
  }
};

export default function CategoryNav({
  activeCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div className="bg-emerald-700/30 backdrop-blur-md border-t border-emerald-400/20 py-2">
      <div className="container-custom">
        <div className="category-container">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`category-pill ${isActive ? 'active' : ''}`}
              >
                <div className="icon-box">
                  {cat.id === 'all' && isActive ? (
                    <span className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-sm">
                      TK
                    </span>
                  ) : (
                    getCategoryIcon(cat.id)
                  )}
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
