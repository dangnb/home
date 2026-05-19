"use client";

// Best Selling Products - Clean section with category filter tabs

import { useState } from "react";
import { ProductCard } from "./product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  unit: string;
  isOnSale: boolean;
  categoryId: string;
  category: { name: string } | null;
  effectivePrice?: number;
  discountPercent?: number;
  hasPromotion?: boolean;
}

export function BestSellersSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState("all");

  if (products.length === 0) return null;

  // Get unique categories from products
  const categories = Array.from(
    new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.categoryId, p.category!.name])
    )
  ).slice(0, 3);

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.categoryId === activeFilter);

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        {/* Header with filter tabs */}
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-1">
                Tuyển chọn
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Sản phẩm nổi bật
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                Tất cả
              </button>
              {categories.map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hidden sm:block ${
                    activeFilter === id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Products Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {filteredProducts.slice(0, 8).map((product) => (
            <StaggerItem key={product.id}>
              <motion.div layout>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  salePrice={product.salePrice}
                  image={product.image}
                  unit={product.unit}
                  isOnSale={product.isOnSale}
                  category={product.category}
                  effectivePrice={product.effectivePrice}
                  discountPercent={product.discountPercent}
                  hasPromotion={product.hasPromotion}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Link */}
        <FadeUp delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
