"use server";

// Server Actions for Wishlist (Sản phẩm yêu thích)

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomerSession } from "./customer-auth-actions";

/**
 * Toggle wishlist (add/remove)
 */
export async function toggleWishlist(productId: string) {
  const customer = await getCustomerSession();
  if (!customer) {
    return { success: false, error: "Vui lòng đăng nhập", isInWishlist: false };
  }

  try {
    const existing = await db.wishlist.findUnique({
      where: { productId_customerId: { productId, customerId: customer.id } },
    });

    if (existing) {
      await db.wishlist.delete({ where: { id: existing.id } });
      revalidatePath("/wishlist");
      return { success: true, isInWishlist: false };
    } else {
      await db.wishlist.create({
        data: { productId, customerId: customer.id },
      });
      revalidatePath("/wishlist");
      return { success: true, isInWishlist: true };
    }
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
    return { success: false, error: "Thao tác thất bại", isInWishlist: false };
  }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(productId: string) {
  const customer = await getCustomerSession();
  if (!customer) return false;

  const existing = await db.wishlist.findUnique({
    where: { productId_customerId: { productId, customerId: customer.id } },
  });

  return !!existing;
}

/**
 * Get customer's wishlist
 */
export async function getWishlist() {
  const customer = await getCustomerSession();
  if (!customer) return [];

  return db.wishlist.findMany({
    where: { customerId: customer.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
}
