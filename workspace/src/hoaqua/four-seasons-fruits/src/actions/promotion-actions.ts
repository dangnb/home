"use server";

// Server Actions for Promotion CRUD

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface PromotionFormData {
  name: string;
  description?: string;
  discount: number;
  type: string;
  productIds?: string[];
  categoryIds?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  minOrder?: number | null;
  maxDiscount?: number | null;
  code?: string;
}

/**
 * Get all promotions
 */
export async function getPromotions() {
  return db.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get active promotions
 */
export async function getActivePromotions() {
  const now = new Date();
  return db.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { discount: "desc" },
  });
}

/**
 * Get promotion by ID
 */
export async function getPromotionById(id: string) {
  return db.promotion.findUnique({ where: { id } });
}

/**
 * Create a new promotion
 */
export async function createPromotion(data: PromotionFormData) {
  try {
    await db.promotion.create({
      data: {
        name: data.name,
        description: data.description || null,
        discount: data.discount,
        type: data.type,
        productIds: data.productIds ? JSON.stringify(data.productIds) : null,
        categoryIds: data.categoryIds ? JSON.stringify(data.categoryIds) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        minOrder: data.minOrder || null,
        maxDiscount: data.maxDiscount || null,
        code: data.code || null,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create promotion:", error);
    return { success: false, error: "Failed to create promotion" };
  }
}

/**
 * Update a promotion
 */
export async function updatePromotion(id: string, data: PromotionFormData) {
  try {
    await db.promotion.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        discount: data.discount,
        type: data.type,
        productIds: data.productIds ? JSON.stringify(data.productIds) : null,
        categoryIds: data.categoryIds ? JSON.stringify(data.categoryIds) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        minOrder: data.minOrder || null,
        maxDiscount: data.maxDiscount || null,
        code: data.code || null,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update promotion:", error);
    return { success: false, error: "Failed to update promotion" };
  }
}

/**
 * Delete a promotion
 */
export async function deletePromotion(id: string) {
  try {
    await db.promotion.delete({ where: { id } });
    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    return { success: false, error: "Failed to delete promotion" };
  }
}

/**
 * Toggle promotion active status
 */
export async function togglePromotionStatus(id: string) {
  try {
    const promo = await db.promotion.findUnique({ where: { id } });
    if (!promo) return { success: false, error: "Not found" };

    await db.promotion.update({
      where: { id },
      data: { isActive: !promo.isActive },
    });

    revalidatePath("/admin/promotions");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle promotion:", error);
    return { success: false, error: "Failed to toggle" };
  }
}


/**
 * Validate and apply a promo code at checkout
 */
export async function applyPromoCode(code: string) {
  try {
    const now = new Date();

    const promotion = await db.promotion.findUnique({
      where: { code },
    });

    if (!promotion) {
      return { success: false, error: "Mã khuyến mại không tồn tại" };
    }

    if (!promotion.isActive) {
      return { success: false, error: "Mã khuyến mại đã bị vô hiệu hóa" };
    }

    if (now < promotion.startDate) {
      return { success: false, error: "Mã khuyến mại chưa có hiệu lực" };
    }

    if (now > promotion.endDate) {
      return { success: false, error: "Mã khuyến mại đã hết hạn" };
    }

    return {
      success: true,
      promotion: {
        name: promotion.name,
        discount: promotion.discount,
        maxDiscount: promotion.maxDiscount,
        minOrder: promotion.minOrder,
      },
    };
  } catch (error) {
    console.error("Failed to apply promo code:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}
