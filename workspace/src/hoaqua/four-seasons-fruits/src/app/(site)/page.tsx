// Landing Page - Server component that fetches data and passes to client sections

import { db } from "@/lib/db";
import { HeroBanner } from "@/components/site/hero-banner";
import { FeaturesSection } from "@/components/site/features-section";
import { BestSellersSection } from "@/components/site/best-sellers-section";
import { CategoriesSection } from "@/components/site/categories-section";
import { FlashSaleSection } from "@/components/site/flash-sale-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { PromoBanner } from "@/components/site/promo-banner";

export default async function HomePage() {
  const [featuredProducts, saleProducts, categories] = await Promise.all([
    db.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: { isOnSale: true },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Map products to include categoryId for filtering
  const productsWithCategoryId = featuredProducts.map((p) => ({
    ...p,
    categoryId: p.categoryId,
  }));

  return (
    <>
      <HeroBanner />
      <FeaturesSection />
      <BestSellersSection products={productsWithCategoryId} />
      <CategoriesSection categories={categories} />
      <FlashSaleSection products={saleProducts} />
      <PromoBanner />
      <TestimonialsSection />
    </>
  );
}
