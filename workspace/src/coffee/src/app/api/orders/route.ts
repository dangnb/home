import { db } from "@/lib/db";
import { orderRequestSchema } from "@/features/orders/validation";
import { validationErrorResponse } from "@/lib/validation";

function mapFulfillment(value: "pickup" | "delivery") {
  return value === "delivery" ? "DELIVERY" : "PICKUP";
}

function mapPayment(value: "cash" | "transfer") {
  return value === "transfer" ? "TRANSFER" : "CASH";
}

function createOrderCode() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MOC-${date}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = orderRequestSchema.safeParse(json);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const slugs = data.items.map((item) => item.slug);
    const products = await db.product.findMany({ where: { slug: { in: slugs }, status: "ACTIVE" } });
    const productMap = new Map(products.map((product) => [product.slug, product]));

    if (products.length !== new Set(slugs).size) {
      return Response.json({ error: "Một số món không còn khả dụng" }, { status: 400 });
    }

    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.slug);
      if (!product) {
        throw new Error("Missing product after validation");
      }

      return {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        productCategory: product.category,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });
    const subtotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);

    if (data.idempotencyKey) {
      const existingOrder = await db.order.findUnique({ where: { idempotencyKey: data.idempotencyKey } });
      if (existingOrder) {
        return Response.json({ order: { code: existingOrder.code, subtotal: existingOrder.subtotal, total: existingOrder.total, status: existingOrder.status } });
      }
    }

    const order = await db.order.create({
      data: {
        code: createOrderCode(),
        customerName: data.customer.name,
        customerPhone: data.customer.phone,
        customerAddress: data.customer.address || null,
        customerNote: data.customer.note || null,
        fulfillment: mapFulfillment(data.customer.fulfillment),
        paymentMethod: mapPayment(data.customer.payment),
        subtotal,
        total: subtotal,
        idempotencyKey: data.idempotencyKey,
        items: { create: orderItems },
      },
    });

    return Response.json({ order: { code: order.code, subtotal: order.subtotal, total: order.total, status: order.status } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Không thể tạo đơn hàng lúc này" }, { status: 500 });
  }
}
