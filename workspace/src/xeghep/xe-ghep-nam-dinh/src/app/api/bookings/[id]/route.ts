import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// GET /api/bookings/[id] - Get booking by id or code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findFirst({
      where: { OR: [{ id }, { code: id }] },
    });

    if (!booking) {
      return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/bookings/[id] - Update booking status (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.booking.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete booking (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ message: "Đã xóa vé" });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
