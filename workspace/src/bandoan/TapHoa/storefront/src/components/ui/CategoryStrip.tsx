'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category } from '@/types/models';
import { categoryService } from '@/services/categoryService';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Trái cây': '🍎',
  'Rau củ': '🥬',
  'Thịt cá': '🥩',
  'Đồ uống': '🥤',
  'Bánh kẹo': '🍪',
  'Gia vị': '🧂',
  'Sữa': '🥛',
  'Mì gói': '🍜',
};

export default function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="animate-fadeIn">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0 w-32 h-24 skeleton rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fadeInUp">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800">Danh mục</h2>
        <Link href="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          Xem tất cả →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`flex-shrink-0 flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-md transition-all duration-300 card-hover animate-fadeInUp stagger-${i + 1}`}
          >
            <span className="text-3xl">{cat.icon || CATEGORY_EMOJIS[cat.name] || '📦'}</span>
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
