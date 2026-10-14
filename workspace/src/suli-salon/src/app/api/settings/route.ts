import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSettings, invalidateDbCache, type SiteSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validation";

const SETTING_KEYS = new Set<keyof SiteSettings>([
  "siteName", "tagline", "hotline", "hotline2", "phone", "email", "address", "workingHours",
  "facebook", "tiktok", "youtube", "zalo", "instagram", "mapEmbedUrl", "mapLat", "mapLng",
  "seoTitle", "seoDescription", "seoKeywords", "footerTaglines", "copyright", "departureSlots",
  "bannerImage", "bannerBadge", "bannerTitle", "bannerSubtitle", "bannerCta1Text", "bannerCta1Link",
  "bannerCta2Text", "bannerCta2Link", "bannerStats", "aboutHeadline", "aboutSubheadline", "aboutImage1",
  "aboutImage2", "aboutValues",
  "popupEnabled", "popupLevel", "popupBadge", "popupTitle", "popupContent", "popupCtaText", "popupCtaLink", "popupDismissType",
]);

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  return NextResponse.json(await getSettings());
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await parseJsonBody(req);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Dữ liệu cài đặt không hợp lệ" }, { status: 400 });
    }

    const entries = Object.entries(body).filter(([key]) => SETTING_KEYS.has(key as keyof SiteSettings));
    if (entries.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy cấu hình hợp lệ để lưu" }, { status: 400 });
    }

    await prisma.$transaction(entries.map(([key, value]) => prisma.setting.upsert({
      where: { key },
      create: { key, value: typeof value === "string" ? value : JSON.stringify(value) },
      update: { value: typeof value === "string" ? value : JSON.stringify(value) },
    })));

    // Xóa cache in-memory và revalidate toàn bộ layout để cập nhật ngay lập tức
    invalidateDbCache();
    try {
      revalidatePath("/", "layout");
      revalidatePath("/[locale]", "layout");
      revalidatePath("/vi", "layout");
      revalidatePath("/en", "layout");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings save failed", error);
    return NextResponse.json({ error: "Không thể lưu cài đặt" }, { status: 500 });
  }
}
