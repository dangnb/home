import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bookingRateLimiter } from "@/lib/rate-limit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!bookingRateLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json();
  try {
    const appointment = await prisma.appointment.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        email: body.email ?? "",
        serviceName: body.serviceName,
        date: body.date,
        time: body.time,
        note: body.note ?? "",
        status: "new",
      },
    });
    return NextResponse.json({ success: true, appointment });
  } catch {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
