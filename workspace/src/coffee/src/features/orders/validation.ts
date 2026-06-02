import { z } from "zod";
import { nonEmptyText, phoneSchema } from "@/lib/validation";

export const orderRequestSchema = z.object({
  items: z.array(z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(99) })).min(1),
  customer: z.object({
    name: nonEmptyText("Họ tên", 2, 100),
    phone: phoneSchema,
    address: z.string().trim().max(300).optional().default(""),
    note: z.string().trim().max(500).optional().default(""),
    fulfillment: z.enum(["pickup", "delivery"]),
    payment: z.enum(["cash", "transfer"]),
  }),
  idempotencyKey: z.string().trim().max(120).optional(),
}).superRefine((data, context) => {
  if (data.customer.fulfillment === "delivery" && !data.customer.address) {
    context.addIssue({ code: "custom", path: ["customer", "address"], message: "Bạn nhập địa chỉ giao hàng nhé" });
  }
});
