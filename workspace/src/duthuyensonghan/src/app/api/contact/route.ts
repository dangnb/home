// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContact } from "@/lib/db";
import { contactRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!contactRateLimiter.check(ip)) {
        return NextResponse.json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút." }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !message) {
            return NextResponse.json(
                { error: "Vui lòng nhập họ tên và nội dung" },
                { status: 400 }
            );
        }

        const contact = await createContact({ name, email, phone, subject, message });
        return NextResponse.json({ success: true, contact });
    } catch {
        return NextResponse.json(
            { error: "Có lỗi xảy ra, vui lòng thử lại" },
            { status: 500 }
        );
    }
}
