import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImages, extractCloudinaryUrls } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validation";
import { servicePayload } from "../route";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { slug } = await params;
  try {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...service,
      gallery: service.gallery ? JSON.parse(service.gallery) : [],
    });
  } catch (error) {
    console.error("Service fetch failed", error);
    return NextResponse.json({ error: "Không thể tải dịch vụ" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { slug } = await params;
  try {
    const data = servicePayload(await parseJsonBody(req));
    if (!data) return NextResponse.json({ error: "Dữ liệu dịch vụ không hợp lệ" }, { status: 400 });

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const oldGallery = existing.gallery ? JSON.parse(existing.gallery) : [];
    const oldUrls = [existing.image, ...oldGallery, ...extractCloudinaryUrls(existing.description)].filter(Boolean) as string[];
    const newGallery = JSON.parse(data.gallery) as string[];
    const newUrls = [data.image, ...newGallery, ...extractCloudinaryUrls(data.description)].filter(Boolean) as string[];
    const urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));
    if (urlsToDelete.length > 0) await deleteImages(urlsToDelete);

    await prisma.service.update({ where: { slug }, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service update failed", error);
    return NextResponse.json({ error: "Không thể cập nhật dịch vụ" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

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
  } catch (error) {
    console.error("Service deletion failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
