import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bookingRateLimiter } from "@/lib/rate-limit";
import { bookingSchema, getClientIp, parseJsonBody } from "@/lib/validation";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (!bookingRateLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const result = bookingSchema.safeParse(await parseJsonBody(req));
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message || "Dữ liệu đặt lịch không hợp lệ" }, { status: 400 });
  }

  try {
    await prisma.appointment.create({
      data: {
        customerName: result.data.customerName,
        phone: result.data.phone,
        email: result.data.email ?? "",
        serviceName: result.data.serviceName || result.data.cruiseName || "Dịch vụ chưa xác định",
        date: result.data.date,
        time: result.data.time,
        note: result.data.note ?? "",
        status: "new",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking creation failed", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
