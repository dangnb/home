"use server";

// Server Actions for Product Comments/Reviews

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomerSession } from "./customer-auth-actions";

/**
 * Get comments for a product
 */
export async function getProductComments(productId: string) {
  return db.comment.findMany({
    where: { productId },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Add a comment to a product (requires login)
 */
export async function addComment(productId: string, content: string, rating: number) {
  const customer = await getCustomerSession();
  if (!customer) {
    return { success: false, error: "Vui lòng đăng nhập để bình luận" };
  }

  try {
    await db.comment.create({
      data: {
        content,
        rating: Math.min(5, Math.max(1, rating)),
        productId,
        customerId: customer.id,
      },
    });

    revalidatePath(`/products`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false, error: "Gửi bình luận thất bại" };
  }
}

/**
 * Delete a comment (only owner)
 */
export async function deleteComment(commentId: string) {
  const customer = await getCustomerSession();
  if (!customer) return { success: false, error: "Unauthorized" };

  try {
    const comment = await db.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.customerId !== customer.id) {
      return { success: false, error: "Không có quyền xóa" };
    }

    await db.comment.delete({ where: { id: commentId } });
    revalidatePath(`/products`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Xóa thất bại" };
  }
}
