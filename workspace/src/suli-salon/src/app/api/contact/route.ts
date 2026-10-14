import { NextRequest, NextResponse } from "next/server";
import { createContact } from "@/lib/db";
import { contactRateLimiter } from "@/lib/rate-limit";
import { contactSchema, getClientIp, parseJsonBody } from "@/lib/validation";

export async function POST(req: NextRequest) {
    const ip = getClientIp(req.headers);
    if (!contactRateLimiter.check(ip)) {
        return NextResponse.json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút." }, { status: 429 });
    }

    const result = contactSchema.safeParse(await parseJsonBody(req));
    if (!result.success) {
        return NextResponse.json({ error: result.error.issues[0]?.message || "Dữ liệu liên hệ không hợp lệ" }, { status: 400 });
    }

    try {
        const { name, email, phone, subject, message } = result.data;
        await createContact({ name, email, phone, subject, message });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact creation failed", error);
        return NextResponse.json({ error: "Có lỗi xảy ra, vui lòng thử lại" }, { status: 500 });
    }
}
