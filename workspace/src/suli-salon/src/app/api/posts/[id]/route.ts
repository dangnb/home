import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteImages, extractCloudinaryUrls } from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    
    if (existingPost) {
      const oldUrls = [
        existingPost.thumbnail,
        ...extractCloudinaryUrls(existingPost.content)
      ].filter(Boolean) as string[];

      const newUrls = [
        body.thumbnail,
        ...extractCloudinaryUrls(body.content)
      ].filter(Boolean) as string[];

      const urlsToDelete = oldUrls.filter(url => !newUrls.includes(url));
      if (urlsToDelete.length > 0) {
        await deleteImages(urlsToDelete);
      }
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        thumbnail: body.thumbnail,
        categoryId: body.categoryId,
        status: body.status,
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Fetch failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (existingPost) {
      const urlsToDelete = [
        existingPost.thumbnail,
        ...extractCloudinaryUrls(existingPost.content)
      ].filter(Boolean) as string[];

      if (urlsToDelete.length > 0) {
        await deleteImages(urlsToDelete);
      }
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
