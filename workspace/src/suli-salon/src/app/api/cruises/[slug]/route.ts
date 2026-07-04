import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteImages, extractCloudinaryUrls } from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();
  try {
    const existingCruise = await prisma.cruise.findUnique({ where: { slug } });
    if (existingCruise) {
      const oldGallery = existingCruise.gallery ? JSON.parse(existingCruise.gallery) : [];
      const oldUrls = [
        existingCruise.mainImage,
        ...oldGallery,
        ...extractCloudinaryUrls(existingCruise.description)
      ].filter(Boolean) as string[];

      const newGallery = typeof body.gallery === 'string' ? JSON.parse(body.gallery) : (body.gallery || []);
      const newUrls = [
        body.mainImage,
        ...newGallery,
        ...extractCloudinaryUrls(body.description)
      ].filter(Boolean) as string[];

      const urlsToDelete = oldUrls.filter(url => !newUrls.includes(url));
      if (urlsToDelete.length > 0) {
        await deleteImages(urlsToDelete);
      }
    }

    // If slug is changed, we update by the original slug in URL
    await prisma.cruise.update({
      where: { slug },
      data: {
        slug: body.slug,
        name: body.name,
        categoryId: body.categoryId,
        badge: body.badge,
        tagline: body.tagline,
        originalPrice: body.originalPrice,
        salePrice: body.salePrice,
        floors: body.floors,
        capacity: body.capacity,
        mainImage: body.mainImage,
        gallery: typeof body.gallery === 'string' ? body.gallery : JSON.stringify(body.gallery ?? []),
        highlights: typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights ?? []),
        description: body.description,
        tours: typeof body.tours === 'string' ? body.tours : JSON.stringify(body.tours ?? []),
        includes: typeof body.includes === 'string' ? body.includes : JSON.stringify(body.includes ?? []),
        relatedSlugs: typeof body.relatedSlugs === 'string' ? body.relatedSlugs : JSON.stringify(body.relatedSlugs ?? []),
        isActive: body.isActive,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const cruise = await prisma.cruise.findUnique({
      where: { slug },
    });
    if (!cruise) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Parse stringified JSON fields
    const parsedCruise = {
      ...cruise,
      gallery: cruise.gallery ? JSON.parse(cruise.gallery) : [],
      highlights: cruise.highlights ? JSON.parse(cruise.highlights) : [],
      tours: cruise.tours ? JSON.parse(cruise.tours) : [],
      includes: cruise.includes ? JSON.parse(cruise.includes) : [],
      relatedSlugs: cruise.relatedSlugs ? JSON.parse(cruise.relatedSlugs) : [],
    };

    return NextResponse.json(parsedCruise);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Fetch failed" }, { status: 500 });
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
    const existingCruise = await prisma.cruise.findUnique({ where: { slug } });
    if (existingCruise) {
      const gallery = existingCruise.gallery ? JSON.parse(existingCruise.gallery) : [];
      const urlsToDelete = [
        existingCruise.mainImage,
        ...gallery,
        ...extractCloudinaryUrls(existingCruise.description)
      ].filter(Boolean) as string[];

      if (urlsToDelete.length > 0) {
        await deleteImages(urlsToDelete);
      }
    }

    await prisma.cruise.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
