import { applicationRequestSchema } from "@/features/recruitment/validation";
import { db } from "@/lib/db";
import { validationErrorResponse } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = applicationRequestSchema.safeParse(json);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const data = parsed.data;
    await db.jobApplication.create({
      data: {
        jobPostingId: data.jobPostingId || null,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        position: data.position,
        message: data.message,
      },
    });

    return Response.json({ ok: true, message: "Ứng tuyển thành công. Mộc Coffee sẽ liên hệ bạn sớm." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Không thể gửi hồ sơ lúc này" }, { status: 500 });
  }
}
