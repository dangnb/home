import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const lists = await prisma.priceList.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(lists.map(p => ({
    ...p,
    items: p.items ? JSON.parse(p.items) : [],
  })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // body = { categories: [{ category: "Manicure", items: [...] }, ...] }
  try {
    for (const cat of body.categories) {
      await prisma.priceList.upsert({
        where: { category: cat.category },
        create: {
          category: cat.category,
          items: JSON.stringify(cat.items),
          order: cat.order ?? 0,
        },
        update: {
          items: JSON.stringify(cat.items),
          order: cat.order ?? 0,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
