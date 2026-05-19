"use server";

// Server Actions for Order management

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

/**
 * Create a new order from checkout
 */
export async function createOrder(data: CheckoutData) {
  try {
    const order = await db.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Update product stock
    for (const item of data.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

/**
 * Get all orders
 */
export async function getOrders() {
  return db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  const [totalProducts, totalOrders, totalRevenue, recentOrders] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.order.aggregate({ _sum: { total: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
    ]);

  return {
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  };
}
