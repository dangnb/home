"use server";

// Server Actions for Stock & Order Status Management
// Handles: approve order (deduct stock), return order (add stock), manual adjust

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Update order status and handle stock changes
 * - pending → confirmed: deduct stock
 * - confirmed → shipping: no stock change
 * - shipping → completed: no stock change
 * - any → returned: add stock back
 * - any → cancelled: add stock back (if was confirmed+)
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) return { success: false, error: "Đơn hàng không tồn tại" };

    const oldStatus = order.status;

    // Deduct stock when confirming order
    if (oldStatus === "pending" && newStatus === "confirmed") {
      for (const item of order.items) {
        // Check stock availability
        if (item.product.stock < item.quantity) {
          return {
            success: false,
            error: `Sản phẩm "${item.product.name}" không đủ tồn kho (còn ${item.product.stock} ${item.product.unit})`,
          };
        }
      }

      // Deduct stock for each item
      for (const item of order.items) {
        const newStock = item.product.stock - item.quantity;
        await db.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        // Record stock history
        await db.stockHistory.create({
          data: {
            productId: item.productId,
            type: "out",
            quantity: item.quantity,
            reason: `Đơn hàng #${orderId.slice(0, 8)}`,
            orderId,
            stockAfter: newStock,
          },
        });
      }
    }

    // Return stock when order is returned or cancelled (only if was confirmed+)
    if (
      (newStatus === "returned" || newStatus === "cancelled") &&
      oldStatus !== "pending" &&
      oldStatus !== "cancelled" &&
      oldStatus !== "returned"
    ) {
      for (const item of order.items) {
        const product = await db.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;

        const newStock = product.stock + item.quantity;
        await db.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });

        // Record stock history
        await db.stockHistory.create({
          data: {
            productId: item.productId,
            type: "return",
            quantity: item.quantity,
            reason: newStatus === "returned"
              ? `Trả hàng đơn #${orderId.slice(0, 8)}`
              : `Hủy đơn #${orderId.slice(0, 8)}`,
            orderId,
            stockAfter: newStock,
          },
        });
      }
    }

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Cập nhật thất bại" };
  }
}

/**
 * Manual stock adjustment (nhập kho / điều chỉnh)
 */
export async function adjustStock(productId: string, quantity: number, type: "in" | "adjust", reason: string) {
  try {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return { success: false, error: "Sản phẩm không tồn tại" };

    let newStock: number;
    if (type === "in") {
      newStock = product.stock + quantity;
    } else {
      // adjust = set to exact value
      newStock = quantity;
    }

    if (newStock < 0) {
      return { success: false, error: "Tồn kho không thể âm" };
    }

    await db.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });

    await db.stockHistory.create({
      data: {
        productId,
        type: type === "in" ? "in" : "adjust",
        quantity: type === "in" ? quantity : Math.abs(newStock - product.stock),
        reason: reason || (type === "in" ? "Nhập kho" : "Điều chỉnh tồn kho"),
        stockAfter: newStock,
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");

    return { success: true, newStock };
  } catch (error) {
    console.error("Failed to adjust stock:", error);
    return { success: false, error: "Điều chỉnh thất bại" };
  }
}

/**
 * Get stock history for a product
 */
export async function getStockHistory(productId?: string) {
  const where = productId ? { productId } : {};
  return db.stockHistory.findMany({
    where,
    include: { product: { select: { name: true, unit: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
