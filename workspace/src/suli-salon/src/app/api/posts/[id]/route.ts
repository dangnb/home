import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImages, extractCloudinaryUrls } from "@/lib/cloudinary";
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
    if (typeof body.title !== "string" || !body.title.trim() || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ error: "Tiêu đề và đường dẫn bài viết là bắt buộc" }, { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const oldUrls = [existingPost.thumbnail, ...extractCloudinaryUrls(existingPost.content)].filter(Boolean) as string[];
    const newUrls = [body.thumbnail, ...extractCloudinaryUrls(body.content)].filter(Boolean) as string[];
    const urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));
    if (urlsToDelete.length > 0) await deleteImages(urlsToDelete);

    await prisma.post.update({
      where: { id },
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post update failed", error);
    return NextResponse.json({ error: "Không thể cập nhật bài viết" }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Post fetch failed", error);
    return NextResponse.json({ error: "Không thể tải bài viết" }, { status: 500 });
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
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const urlsToDelete = [existingPost.thumbnail, ...extractCloudinaryUrls(existingPost.content)].filter(Boolean) as string[];
    if (urlsToDelete.length > 0) await deleteImages(urlsToDelete);
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post deletion failed", error);
    return NextResponse.json({ error: "Không thể xóa bài viết" }, { status: 500 });
  }
}
