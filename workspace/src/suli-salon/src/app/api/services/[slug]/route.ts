import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteImages, extractCloudinaryUrls } from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...service,
      gallery: service.gallery ? JSON.parse(service.gallery) : [],
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();
  try {
    // Cleanup old images from Cloudinary
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      const oldGallery = existing.gallery ? JSON.parse(existing.gallery) : [];
      const oldUrls = [existing.image, ...oldGallery, ...extractCloudinaryUrls(existing.description)].filter(Boolean) as string[];
      const newGallery = typeof body.gallery === "string" ? JSON.parse(body.gallery) : (body.gallery || []);
      const newUrls = [body.image, ...newGallery, ...extractCloudinaryUrls(body.description)].filter(Boolean) as string[];
      const urlsToDelete = oldUrls.filter(url => !newUrls.includes(url));
      if (urlsToDelete.length > 0) await deleteImages(urlsToDelete);
    }

    await prisma.service.update({
      where: { slug },
      data: {
        slug: body.slug,
        name: body.name,
        categoryId: body.categoryId,
        description: body.description,
        duration: body.duration,
        price: body.price,
        promoPrice: body.promoPrice || null,
        image: body.image,
        gallery: typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery ?? []),
        isActive: body.isActive,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  try {
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      const gallery = existing.gallery ? JSON.parse(existing.gallery) : [];
      const urlsToDelete = [existing.image, ...gallery, ...extractCloudinaryUrls(existing.description)].filter(Boolean) as string[];
      if (urlsToDelete.length > 0) await deleteImages(urlsToDelete);
    }

    await prisma.service.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
