import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// GET /api/services - List all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/services - Create service (auth required)
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, unit, description, image, order } = body;

    if (!name || !price || !unit) {
      return NextResponse.json({ error: "Tên, giá và đơn vị là bắt buộc" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: { name, price, unit, description, image, order: order || 0 },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
