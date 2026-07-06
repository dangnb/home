import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const item = await prisma.galleryItem.create({
      data: {
        title: body.title ?? "",
        image: body.image,
        category: body.category ?? "",
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
