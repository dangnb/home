import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    if (typeof body.label !== "string" || !body.label.trim() || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ error: "Tên và đường dẫn danh mục là bắt buộc" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        label: body.label.trim().slice(0, 100),
        slug: body.slug.trim().slice(0, 120),
        description: typeof body.description === "string" ? body.description.trim().slice(0, 500) : "",
      },
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Category creation failed", error);
    return NextResponse.json({ error: "Không thể tạo danh mục" }, { status: 500 });
  }
}
