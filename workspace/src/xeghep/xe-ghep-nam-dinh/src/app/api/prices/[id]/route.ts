import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// PUT /api/prices/[id]
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

    const price = await prisma.priceTable.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ price });
  } catch (error) {
    console.error("Update price error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/prices/[id]
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
    await prisma.priceTable.delete({ where: { id } });

    return NextResponse.json({ message: "Đã xóa" });
  } catch (error) {
    console.error("Delete price error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
