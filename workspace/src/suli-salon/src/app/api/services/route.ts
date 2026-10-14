import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validation";

export function servicePayload(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const data = body as Record<string, unknown>;
  const gallery = typeof data.gallery === "string"
    ? (() => {
        try {
          const parsed: unknown = JSON.parse(data.gallery);
          return Array.isArray(parsed) ? parsed : null;
        } catch {
          return null;
        }
      })()
    : data.gallery;

  if (
    typeof data.slug !== "string" || !data.slug.trim() ||
    typeof data.name !== "string" || !data.name.trim() ||
    typeof data.categoryId !== "string" || !data.categoryId.trim() ||
    typeof data.price !== "string" || !data.price.trim() ||
    !Array.isArray(gallery) ||
    !gallery.every((image) => typeof image === "string" && image.length <= 2_000)
  ) return null;

  const duration = typeof data.duration === "number" && Number.isInteger(data.duration) ? data.duration : 60;
  if (duration < 1 || duration > 1_440) return null;

  return {
    slug: data.slug.trim().slice(0, 160),
    name: data.name.trim().slice(0, 160),
    categoryId: data.categoryId.trim(),
    description: typeof data.description === "string" ? data.description.slice(0, 10_000) : "",
    duration,
    price: data.price.trim().slice(0, 100),
    promoPrice: typeof data.promoPrice === "string" && data.promoPrice.trim() ? data.promoPrice.trim().slice(0, 100) : null,
    image: typeof data.image === "string" ? data.image.slice(0, 2_000) : "",
    gallery: JSON.stringify(gallery.slice(0, 30)),
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services.map((service) => ({
    ...service,
    gallery: service.gallery ? JSON.parse(service.gallery) : [],
  })));
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const data = servicePayload(await parseJsonBody(req));
    if (!data) return NextResponse.json({ error: "Dữ liệu dịch vụ không hợp lệ" }, { status: 400 });

    const service = await prisma.service.create({ data });
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Service creation failed", error);
    return NextResponse.json({ error: "Không thể tạo dịch vụ" }, { status: 500 });
  }
}
