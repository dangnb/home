import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    if (typeof body.image !== "string" || !body.image) {
      return NextResponse.json({ error: "Cần có ảnh cho bộ sưu tập" }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: typeof body.title === "string" ? body.title.slice(0, 160) : "",
        image: body.image,
        category: typeof body.category === "string" ? body.category.slice(0, 80) : "",
        order: Number.isInteger(body.order) ? body.order : 0,
        isActive: typeof body.isActive === "boolean" ? body.isActive : true,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Gallery creation failed", error);
    return NextResponse.json({ error: "Không thể thêm ảnh" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery deletion failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
