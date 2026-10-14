import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type PriceItem = { name?: unknown; duration?: unknown; price?: unknown };

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const lists = await prisma.priceList.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(lists.map((list) => ({
    ...list,
    items: list.items ? JSON.parse(list.items) : [],
  })));
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    if (!Array.isArray(body.categories) || body.categories.length > 100) {
      return NextResponse.json({ error: "Dữ liệu bảng giá không hợp lệ" }, { status: 400 });
    }

    for (const entry of body.categories) {
      if (typeof entry?.category !== "string" || !entry.category.trim() || !Array.isArray(entry.items)) {
        return NextResponse.json({ error: "Dữ liệu bảng giá không hợp lệ" }, { status: 400 });
      }

      const items = entry.items.slice(0, 100).map((item: PriceItem) => ({
        name: typeof item.name === "string" ? item.name.slice(0, 160) : "",
        duration: typeof item.duration === "string" ? item.duration.slice(0, 60) : "",
        price: typeof item.price === "string" ? item.price.slice(0, 60) : "",
      }));

      await prisma.priceList.upsert({
        where: { category: entry.category.trim().slice(0, 100) },
        create: {
          category: entry.category.trim().slice(0, 100),
          items: JSON.stringify(items),
          order: Number.isInteger(entry.order) ? entry.order : 0,
        },
        update: {
          items: JSON.stringify(items),
          order: Number.isInteger(entry.order) ? entry.order : 0,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pricing save failed", error);
    return NextResponse.json({ error: "Không thể lưu bảng giá" }, { status: 500 });
  }
}
