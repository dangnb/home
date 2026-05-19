"use client";

// Flash Sale section with countdown-style urgency and animations

import { ProductCard } from "./product-card";
import { Zap, Timer } from "lucide-react";
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
  category: { name: string } | null;
}

export function FlashSaleSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden" id="promotions">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400" />

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-32 h-32 border-2 border-dashed border-orange-200/50 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-10 w-24 h-24 border-2 border-dashed border-yellow-200/50 rounded-full"
      />

      <div className="container mx-auto px-4 relative z-10">
        <FadeUp>
          <div className="text-center mb-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-5 shadow-lg shadow-red-200"
            >
              <Zap className="h-4 w-4 fill-white" />
              Flash Sale - Giảm giá sốc!
              <Timer className="h-4 w-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Khuyến mãi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                hôm nay
              </span>
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Nhanh tay mua ngay, số lượng có hạn! 🔥
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <StaggerItem key={product.id}>
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
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
