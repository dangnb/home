import { reviewRequestSchema } from "@/features/reviews/validation";
import { db } from "@/lib/db";
import { validationErrorResponse } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = reviewRequestSchema.safeParse(json);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const product = await db.product.findFirst({ where: { slug: parsed.data.productSlug, status: "ACTIVE" } });

    if (!product) {
      return Response.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
    }

    await db.review.create({
      data: {
        productId: product.id,
        name: parsed.data.name,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        status: "PENDING",
      },
    });

    return Response.json({ ok: true, message: "Cảm ơn bạn. Đánh giá sẽ hiển thị sau khi được duyệt." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Không thể gửi đánh giá lúc này" }, { status: 500 });
  }
}
