import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// PUT /api/services/[id]
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

    const service = await prisma.service.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/services/[id]
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
    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Đã xóa dịch vụ" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
