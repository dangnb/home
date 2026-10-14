import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_POSTS, invalidateDbCache } from "@/lib/db";

const DEFAULT_POST_CATEGORIES = [
  { id: "xu-huong", label: "Xu Hướng Nail Art | Nail Trends", slug: "xu-huong", order: 7 },
  { id: "kinh-nghiem", label: "Kinh Nghiệm & Bí Quyết | Tips & Expertise", slug: "kinh-nghiem", order: 5 },
  { id: "cham-soc", label: "Chăm Sóc & Dưỡng Móng | Nail Care", slug: "cham-soc", order: 8 },
  { id: "tin-tuc", label: "Tin Tức & Salon | News & Salon", slug: "tin-tuc", order: 6 },
  { id: "uu-dai", label: "Ưu Đãi Đặc Quyền | Special Offers", slug: "uu-dai", order: 9 },
];

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const status = new URL(req.url).searchParams.get("status");
  const where = status === "published" || status === "draft" ? { status } : {};

  try {
    let posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" } });

    if (posts.length === 0) {
      try {
        for (const cat of DEFAULT_POST_CATEGORIES) {
          await prisma.category.upsert({
            where: { id: cat.id },
            update: { label: cat.label, slug: cat.slug, order: cat.order },
            create: { id: cat.id, label: cat.label, slug: cat.slug, order: cat.order },
          });
        }
        for (const def of DEFAULT_POSTS) {
          await prisma.post.create({
            data: {
              title: def.title,
              slug: def.slug,
              excerpt: def.excerpt,
              content: def.content,
              thumbnail: def.thumbnail,
              categoryId: def.categoryId,
              status: def.status,
            },
          });
        }
        posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" } });
      } catch (seedErr) {
        console.warn("Could not insert default posts to DB:", seedErr);
        return NextResponse.json(DEFAULT_POSTS);
      }
    } else {
      const existingSlugs = new Set(posts.map((p) => p.slug));
      const missing = DEFAULT_POSTS.filter((p) => !existingSlugs.has(p.slug));
      if (missing.length > 0) {
        try {
          for (const cat of DEFAULT_POST_CATEGORIES) {
            await prisma.category.upsert({
              where: { id: cat.id },
              update: { label: cat.label, slug: cat.slug, order: cat.order },
              create: { id: cat.id, label: cat.label, slug: cat.slug, order: cat.order },
            });
          }
          for (const def of missing) {
            await prisma.post.create({
              data: {
                title: def.title,
                slug: def.slug,
                excerpt: def.excerpt,
                content: def.content,
                thumbnail: def.thumbnail,
                categoryId: def.categoryId,
                status: def.status,
              },
            });
          }
          posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" } });
        } catch (missingErr) {
          console.warn("Could not insert missing posts to DB:", missingErr);
        }
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts GET failed:", error);
    return NextResponse.json(DEFAULT_POSTS);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    if (typeof body.title !== "string" || !body.title.trim() || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ error: "Tiêu đề và đường dẫn bài viết là bắt buộc" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: body.title.trim().slice(0, 200),
        slug: body.slug.trim().slice(0, 200),
        excerpt: typeof body.excerpt === "string" ? body.excerpt.slice(0, 500) : "",
        content: typeof body.content === "string" ? body.content.slice(0, 100_000) : "",
        thumbnail: typeof body.thumbnail === "string" ? body.thumbnail.slice(0, 2_000) : "",
        categoryId: typeof body.categoryId === "string" ? body.categoryId : "",
        status: body.status === "published" ? "published" : "draft",
      },
    });
    invalidateDbCache();
    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    console.error("Post creation failed", error);
    return NextResponse.json({ error: "Không thể tạo bài viết" }, { status: 500 });
  }
}
