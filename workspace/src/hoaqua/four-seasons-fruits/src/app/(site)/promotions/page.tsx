// Public Promotions Page - Shows active promotions to customers

import { db } from "@/lib/db";
import { PromotionsContent } from "./promotions-content";

export default async function PromotionsPage() {
  const now = new Date();

  const promotions = await db.promotion.findMany({
    where: {
      isActive: true,
      endDate: { gte: now },
    },
    orderBy: { discount: "desc" },
  });

  // Get product/category names for display
  const allCategories = await db.category.findMany({ select: { id: true, name: true } });
  const allProducts = await db.product.findMany({ select: { id: true, name: true } });

  const categoryMap = Object.fromEntries(allCategories.map((c) => [c.id, c.name]));
  const productMap = Object.fromEntries(allProducts.map((p) => [p.id, p.name]));

  const promotionsWithNames = promotions.map((promo) => {
    let appliesTo: string[] = [];

    if (promo.type === "all") {
      appliesTo = ["Tất cả sản phẩm"];
    } else if (promo.type === "category" && promo.categoryIds) {
      try {
        const ids: string[] = JSON.parse(promo.categoryIds);
        appliesTo = ids.map((id) => categoryMap[id] || "").filter(Boolean);
      } catch { /* empty */ }
    } else if (promo.type === "product" && promo.productIds) {
      try {
        const ids: string[] = JSON.parse(promo.productIds);
        appliesTo = ids.map((id) => productMap[id] || "").filter(Boolean);
      } catch { /* empty */ }
    }

    return {
      id: promo.id,
      name: promo.name,
      description: promo.description,
      discount: promo.discount,
      type: promo.type,
      code: promo.code,
      startDate: promo.startDate.toISOString(),
      endDate: promo.endDate.toISOString(),
      minOrder: promo.minOrder,
      maxDiscount: promo.maxDiscount,
      appliesTo,
      isUpcoming: now < promo.startDate,
    };
  });

  return <PromotionsContent promotions={promotionsWithNames} />;
}
