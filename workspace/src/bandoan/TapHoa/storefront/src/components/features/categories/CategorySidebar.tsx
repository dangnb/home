import Link from 'next/link';
import { Category } from '@/types/models';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategorySlug?: string | null;
}

export const CategorySidebar = ({ categories, selectedCategorySlug }: CategorySidebarProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 sticky top-24 border shadow-sm">
      <h3 className="font-bold text-lg mb-4 pb-2 border-b">Danh mục sản phẩm</h3>
      <div className="space-y-1">
        <Link 
          href="/"
          className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!selectedCategorySlug ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50 text-gray-700'}`}
        >
          Tất cả sản phẩm
        </Link>
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategorySlug === category.slug ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
