"use client";

// Categories section with hover animations

import Link from "next/link";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  "trai-cay-nhap-khau": "🍇",
  "trai-cay-noi-dia": "🍊",
  "rau-cu-sach": "🥬",
  "hat-dinh-duong": "🥜",
  "nuoc-ep-tuoi": "🧃",
  "combo-qua-tang": "🎁",
};

const categoryColors: Record<string, string> = {
  "trai-cay-nhap-khau": "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-100",
  "trai-cay-noi-dia": "from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 border-orange-100",
  "rau-cu-sach": "from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-100",
  "hat-dinh-duong": "from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-100",
  "nuoc-ep-tuoi": "from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border-cyan-100",
  "combo-qua-tang": "from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border-rose-100",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50/50" id="categories">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Khám phá
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Danh mục{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                sản phẩm
              </span>
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Khám phá các loại trái cây và thực phẩm sạch của chúng tôi
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <Link
                href={`/products?category=${category.id}`}
                className={`group flex flex-col items-center p-6 md:p-8 rounded-2xl border bg-gradient-to-br ${categoryColors[category.slug] || "from-gray-50 to-white border-gray-100"} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {categoryEmojis[category.slug] || "🍎"}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm text-center leading-tight">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2 bg-white/60 px-2 py-0.5 rounded-full">
                  {category._count.products} sản phẩm
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
