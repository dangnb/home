import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    const body = await req.json();
    if (typeof body.label !== "string" || !body.label.trim() || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ error: "Tên và đường dẫn danh mục là bắt buộc" }, { status: 400 });
    }

    await prisma.category.update({
      where: { id },
      data: {
        label: body.label.trim().slice(0, 100),
        slug: body.slug.trim().slice(0, 120),
        description: typeof body.description === "string" ? body.description.trim().slice(0, 500) : "",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category update failed", error);
    return NextResponse.json({ error: "Không thể cập nhật danh mục" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category deletion failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
