import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";
import slugify from "slugify";

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { author: { select: { name: true } }, category: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, thumbnail, published, categoryId, metaTitle, metaDesc, ogImage } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = slugify(title, { lower: true, locale: "vi", strict: true });
    }
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (published !== undefined) updateData.published = published;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc;
    if (ogImage !== undefined) updateData.ogImage = ogImage;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Đã xóa bài viết" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
