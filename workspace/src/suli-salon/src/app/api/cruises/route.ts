import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const cruises = await prisma.cruise.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cruises);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const cruise = await prisma.cruise.create({
      data: {
        slug: body.slug,
        name: body.name,
        categoryId: body.categoryId,
        badge: body.badge ?? "",
        tagline: body.tagline ?? "",
        originalPrice: body.originalPrice ?? "",
        salePrice: body.salePrice ?? "",
        floors: body.floors ?? 1,
        capacity: body.capacity ?? 0,
        mainImage: body.mainImage ?? "",
        gallery: typeof body.gallery === 'string' ? body.gallery : JSON.stringify(body.gallery ?? []),
        highlights: typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights ?? []),
        description: body.description ?? "",
        tours: typeof body.tours === 'string' ? body.tours : JSON.stringify(body.tours ?? []),
        includes: typeof body.includes === 'string' ? body.includes : JSON.stringify(body.includes ?? []),
        relatedSlugs: typeof body.relatedSlugs === 'string' ? body.relatedSlugs : JSON.stringify(body.relatedSlugs ?? []),
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, cruise });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error creating cruise" }, { status: 500 });
  }
}
