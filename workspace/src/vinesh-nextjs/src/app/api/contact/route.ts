import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API Liên hệ — Bảo mật:
 * 1. Validate email format (regex)
 * 2. Giới hạn độ dài input (chống payload quá lớn)
 * 3. Sanitize input (strip HTML tags → chống XSS/injection)
 * 4. Rate limiting đã xử lý ở middleware.ts
 */

// Strip tất cả HTML tags khỏi string
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/[<>]/g, "")    // remove stray angle brackets
    .trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Max length constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;
const MAX_PHONE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    // ── Giới hạn Content-Length (body quá lớn → reject ngay)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10_000) {
      return NextResponse.json(
        { error: "Request body quá lớn" },
        { status: 413 }
      );
    }

    const body = await req.json();
    const { name, email, phone, message } = body;

    // ── Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ Họ tên, Email và Nội dung." },
        { status: 400 }
      );
    }

    // ── Validate types (phải là string, không phải object/array)
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      (phone && typeof phone !== "string")
    ) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    // ── Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Định dạng email không hợp lệ." },
        { status: 400 }
      );
    }

    // ── Validate max length
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `Họ tên không được vượt quá ${MAX_NAME_LENGTH} ký tự.` }, { status: 400 });
    }
    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ error: `Email không được vượt quá ${MAX_EMAIL_LENGTH} ký tự.` }, { status: 400 });
    }
    if (phone && phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json({ error: `Số điện thoại không được vượt quá ${MAX_PHONE_LENGTH} ký tự.` }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Nội dung không được vượt quá ${MAX_MESSAGE_LENGTH} ký tự.` }, { status: 400 });
    }

    // ── Sanitize input (strip HTML tags)
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedMessage = sanitizeInput(message);

    // ── Tạo contact record
    const contact = await prisma.contact.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
      },
    });

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    // Không trả về chi tiết lỗi cho client (chống information leak)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
