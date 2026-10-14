import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const status = new URL(req.url).searchParams.get("status");
  const where = status === "published" || status === "draft" ? { status } : {};
  const posts = await prisma.post.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
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
    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    console.error("Post creation failed", error);
    return NextResponse.json({ error: "Không thể tạo bài viết" }, { status: 500 });
  }
}
