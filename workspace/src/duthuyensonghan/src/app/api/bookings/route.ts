import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const booking = await prisma.booking.create({
      data: {
        cruiseSlug: body.cruiseSlug,
        cruiseName: body.cruiseName,
        customerName: body.customerName,
        phone: body.phone,
        email: body.email ?? "",
        date: body.date,
        time: body.time,
        guests: body.guests,
        note: body.note ?? "",
        status: "pending",
      },
    });
    return NextResponse.json({ success: true, booking });
  } catch (e: any) {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
