import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSettings, type SiteSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validation";

const SETTING_KEYS = new Set<keyof SiteSettings>([
  "siteName", "tagline", "hotline", "hotline2", "email", "address", "workingHours",
  "facebook", "tiktok", "youtube", "zalo", "instagram", "mapEmbedUrl", "mapLat", "mapLng",
  "seoTitle", "seoDescription", "seoKeywords", "footerTaglines", "copyright", "departureSlots",
  "bannerImage", "bannerBadge", "bannerTitle", "bannerSubtitle", "bannerCta1Text", "bannerCta1Link",
  "bannerCta2Text", "bannerCta2Link", "bannerStats", "aboutHeadline", "aboutSubheadline", "aboutImage1",
  "aboutImage2", "aboutValues",
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
    if (entries.length !== Object.keys(body).length) {
      return NextResponse.json({ error: "Cài đặt không hợp lệ" }, { status: 400 });
    }

    await prisma.$transaction(entries.map(([key, value]) => prisma.setting.upsert({
      where: { key },
      create: { key, value: typeof value === "string" ? value : JSON.stringify(value) },
      update: { value: typeof value === "string" ? value : JSON.stringify(value) },
    })));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings save failed", error);
    return NextResponse.json({ error: "Không thể lưu cài đặt" }, { status: 500 });
  }
}
