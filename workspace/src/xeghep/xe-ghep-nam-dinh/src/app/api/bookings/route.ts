import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

function generateBookingCode(): string {
  const prefix = "XG";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// GET /api/bookings - List bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/bookings - Create booking (public - khách đặt vé)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, pickupAddress, dropAddress, route, tripDate, tripTime, seats, vehicleType, note } = body;

    if (!customerName || !customerPhone || !pickupAddress || !dropAddress || !route || !tripDate || !tripTime) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Validate phone
    const phoneRegex = /^(0[3-9])\d{8}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s|\./g, ""))) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ" },
        { status: 400 }
      );
    }

    const code = generateBookingCode();

    const booking = await prisma.booking.create({
      data: {
        code,
        customerName,
        customerPhone: customerPhone.replace(/\s|\./g, ""),
        pickupAddress,
        dropAddress,
        route,
        tripDate,
        tripTime,
        seats: seats || 1,
        vehicleType: vehicleType || "xe-ghep",
        note,
      },
    });

    return NextResponse.json(
      { booking, message: `Đặt vé thành công! Mã vé: ${code}` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
