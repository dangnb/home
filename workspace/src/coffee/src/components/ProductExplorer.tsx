"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

const categories = ["Tất cả", "Cà phê", "Cà phê lạnh", "Matcha", "Trà trái cây", "Bánh ngọt"];

export function ProductExplorer({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "Tất cả" || product.category === activeCategory;
      const searchableText = [product.name, product.category, product.description, product.longDescription, product.badge, ...product.tastingNotes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, products, query]);

  return (
    <section className="py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Full menu</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Tất cả sản phẩm</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#75543d]">
            Lọc theo danh mục hoặc tìm nhanh món hợp mood: cà phê đậm, matcha béo, trà trái cây hay bánh ngọt mới nướng.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-2 shadow-sm backdrop-blur lg:min-w-[360px]">
          <label className="sr-only" htmlFor="product-search">Tìm món</label>
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-[1.5rem] border border-[#ead8c5] bg-[#fff8ef] px-5 py-4 font-semibold text-[#2b160c] outline-none transition placeholder:text-[#a98568] focus:border-[#d9863d] focus:bg-white"
            placeholder="Tìm latte, cold brew, matcha..."
          />
        </div>
      </div>

      <div className="sticky top-[84px] z-20 -mx-5 mb-8 flex gap-3 overflow-x-auto border-y border-[#ead8c5] bg-[#fff8ef]/85 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 ${
                isActive ? "bg-[#2b160c] text-white shadow-lg shadow-[#2b160c]/15" : "bg-white/80 text-[#70411f] hover:bg-white"
              }`}
              aria-pressed={isActive}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] bg-white/55 px-5 py-4 text-sm font-bold text-[#75543d] backdrop-blur">
        <span>
          Đang hiển thị <strong className="text-[#2b160c]">{filteredProducts.length}</strong> / {products.length} món
        </span>
        {(query || activeCategory !== "Tất cả") && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory("Tất cả");
              setQuery("");
            }}
            className="rounded-full bg-[#f7eadb] px-4 py-2 font-black text-[#8a4f25] transition hover:bg-[#2b160c] hover:text-white"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <div key={product.slug} className="animate-fade-up">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-dashed border-[#d9bfa5] bg-white/65 p-10 text-center shadow-sm backdrop-blur">
          <p className="text-3xl font-black text-[#2b160c]">Chưa tìm thấy món phù hợp.</p>
          <p className="mt-3 text-[#75543d]">Thử đổi từ khóa hoặc chọn lại danh mục khác nhé.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("Tất cả");
              setQuery("");
            }}
            className="mt-6 rounded-full bg-[#d9863d] px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-[#bd6f2d]"
          >
            Xem lại toàn bộ menu
          </button>
        </div>
      )}
    </section>
  );
}
