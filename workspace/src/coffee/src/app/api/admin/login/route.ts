import { z } from "zod";
import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { validationErrorResponse } from "@/lib/validation";

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const admin = await db.adminUser.findFirst({ where: { email: parsed.data.email, isActive: true } });
    const isValid = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;

    if (!admin || !isValid) {
      return Response.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    await createSession(admin.id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Không thể đăng nhập lúc này" }, { status: 500 });
  }
}
