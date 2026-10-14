import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_GALLERY_ITEMS, invalidateDbCache } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    let items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

    if (items.length === 0) {
      // Auto-populate default gallery items if table is empty
      try {
        for (const def of DEFAULT_GALLERY_ITEMS) {
          await prisma.galleryItem.create({
            data: {
              title: def.title,
              image: def.image,
              category: def.category,
              order: def.order,
              isActive: def.isActive,
            },
          });
        }
        items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
      } catch (seedErr) {
        console.warn("Could not insert default gallery items to DB:", seedErr);
        return NextResponse.json(DEFAULT_GALLERY_ITEMS);
      }
    } else {
      // Check if newly curated images are missing and supplement them
      const existingImages = new Set(items.map((i) => i.image));
      const missing = DEFAULT_GALLERY_ITEMS.filter((i) => !existingImages.has(i.image));
      if (missing.length > 0) {
        try {
          for (const def of missing) {
            await prisma.galleryItem.create({
              data: {
                title: def.title,
                image: def.image,
                category: def.category,
                order: def.order,
                isActive: def.isActive,
              },
            });
          }
          items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
        } catch (missingErr) {
          console.warn("Could not insert missing gallery items:", missingErr);
        }
      }
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Gallery GET failed:", error);
    return NextResponse.json(DEFAULT_GALLERY_ITEMS);
  }
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
    invalidateDbCache();
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
    invalidateDbCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery deletion failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
