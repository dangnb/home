// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContact } from "@/lib/db";

export async function POST(req: NextRequest) {
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
