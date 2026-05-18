import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";
import slugify from "slugify";

// GET /api/posts - List all posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published");

    const where = published === "true" ? { published: true } : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: { select: { name: true } }, category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/posts - Create new post (auth required)
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, thumbnail, published, categoryId, metaTitle, metaDesc, ogImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Tiêu đề và nội dung là bắt buộc" }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, locale: "vi", strict: true });

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        content,
        excerpt,
        thumbnail,
        published: published || false,
        categoryId,
        authorId: user.id,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt,
        ogImage,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
