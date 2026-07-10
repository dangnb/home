import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  // Parse gallery JSON for each service
  return NextResponse.json(services.map(s => ({
    ...s,
    gallery: s.gallery ? JSON.parse(s.gallery) : [],
  })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const service = await prisma.service.create({
      data: {
        slug: body.slug,
        name: body.name,
        categoryId: body.categoryId,
        description: body.description ?? "",
        duration: body.duration ?? 60,
        price: body.price ?? "",
        promoPrice: body.promoPrice || null,
        image: body.image ?? "",
        gallery: typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery ?? []),
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, service });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error creating service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
