import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// GET /api/prices - List all prices
export async function GET() {
  try {
    const prices = await prisma.priceTable.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Get prices error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/prices - Create price entry (auth required)
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { route, price, unit, order } = body;

    if (!route || !price || !unit) {
      return NextResponse.json({ error: "Tuyến, giá và đơn vị là bắt buộc" }, { status: 400 });
    }

    const priceEntry = await prisma.priceTable.create({
      data: { route, price, unit, order: order || 0 },
    });

    return NextResponse.json({ price: priceEntry }, { status: 201 });
  } catch (error) {
    console.error("Create price error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
