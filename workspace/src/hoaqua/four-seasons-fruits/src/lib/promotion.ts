// Promotion utility - calculates effective price based on active promotions
// Used by both server components and client cart

import { db } from "@/lib/db";

interface ProductForPromotion {
  id: string;
  price: number;
  salePrice: number | null;
  isOnSale: boolean;
  categoryId: string;
}

interface PromotionData {
  id: string;
  discount: number;
  type: string;
  productIds: string | null;
  categoryIds: string | null;
}

/**
 * Get all currently active promotions (within date range and isActive)
 */
export async function getActivePromotions(): Promise<PromotionData[]> {
  const now = new Date();
  return db.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    select: {
      id: true,
      discount: true,
      type: true,
      productIds: true,
      categoryIds: true,
    },
  });
}

/**
 * Find the best promotion discount for a given product
 * Returns the highest applicable discount percentage
 */
export function getBestDiscount(
  product: ProductForPromotion,
  promotions: PromotionData[]
): number {
  let bestDiscount = 0;

  for (const promo of promotions) {
    let applies = false;

    if (promo.type === "all") {
      applies = true;
    } else if (promo.type === "category" && promo.categoryIds) {
      try {
        const catIds: string[] = JSON.parse(promo.categoryIds);
        applies = catIds.includes(product.categoryId);
      } catch {
        applies = false;
      }
    } else if (promo.type === "product" && promo.productIds) {
      try {
        const prodIds: string[] = JSON.parse(promo.productIds);
        applies = prodIds.includes(product.id);
      } catch {
        applies = false;
      }
    }

    if (applies && promo.discount > bestDiscount) {
      bestDiscount = promo.discount;
    }
  }

  return bestDiscount;
}

/**
 * Calculate the effective sale price for a product considering promotions
 * Promotion always takes priority if active (overrides manual sale price)
 * Returns { effectivePrice, discountPercent, hasPromotion }
 */
export function calculateEffectivePrice(
  product: ProductForPromotion,
  promotions: PromotionData[]
): {
  effectivePrice: number;
  discountPercent: number;
  hasPromotion: boolean;
} {
  // Get best promotion discount
  const promoDiscount = getBestDiscount(product, promotions);

  if (promoDiscount > 0) {
    const promoPrice = Math.round(product.price * (1 - promoDiscount / 100));

    // Also check manual sale price - use whichever is lower (better for customer)
    const manualSalePrice = product.isOnSale && product.salePrice ? product.salePrice : null;

    if (manualSalePrice && manualSalePrice < promoPrice) {
      // Manual sale is better deal, but still show as promotion-driven
      const percent = Math.round(((product.price - manualSalePrice) / product.price) * 100);
      return { effectivePrice: manualSalePrice, discountPercent: percent, hasPromotion: true };
    }

    return { effectivePrice: promoPrice, discountPercent: promoDiscount, hasPromotion: true };
  }

  // No promotion, use manual sale price if exists
  const manualSalePrice = product.isOnSale && product.salePrice ? product.salePrice : null;
  if (manualSalePrice) {
    const percent = Math.round(((product.price - manualSalePrice) / product.price) * 100);
    return { effectivePrice: manualSalePrice, discountPercent: percent, hasPromotion: false };
  }

  // No discount at all
  return { effectivePrice: product.price, discountPercent: 0, hasPromotion: false };
}

/**
 * Apply promotions to a list of products
 * Returns products with computed effectivePrice and discountPercent
 */
export async function applyPromotionsToProducts<
  T extends ProductForPromotion
>(products: T[]): Promise<(T & { effectivePrice: number; discountPercent: number; hasPromotion: boolean })[]> {
  const promotions = await getActivePromotions();

  return products.map((product) => {
    const { effectivePrice, discountPercent, hasPromotion } = calculateEffectivePrice(product, promotions);
    return { ...product, effectivePrice, discountPercent, hasPromotion };
  });
}
