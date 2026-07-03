// src/lib/db.ts - Database operations using Prisma
import prisma from "./prisma";

// Re-export prisma for direct access
export { prisma };

// ── Types (giữ tương thích ngược) ──────────────────
export interface Tour {
  name: string;
  icon: string;
  schedule: string[];
}

export interface CruiseData {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  badge: string;
  tagline: string;
  originalPrice: string;
  salePrice: string;
  floors: number;
  capacity: number;
  mainImage: string;
  gallery: string[];
  highlights: string[];
  description: string;
  tours: Tour[];
  includes: string[];
  relatedSlugs: string[];
  isActive: boolean;
}

export interface CategoryData {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export type BookingStatus = "new" | "confirmed" | "cancelled";

export interface BookingData {
  id: string;
  cruiseSlug: string;
  cruiseName: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  note: string;
  status: BookingStatus;
  createdAt: string;
}

export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  categoryId: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface PriceItem {
  label: string;
  price: string;
}

export interface PricingData {
  regularNote: string;
  regularPrices: PriceItem[];
  dinnerNote: string;
  dinnerPrices: PriceItem[];
  fireworksNote: string;
  fireworksPrices: PriceItem[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  hotline: string;
  hotline2: string;
  email: string;
  address: string;
  workingHours: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  zalo: string;
  instagram: string;
  mapEmbedUrl: string;
  mapLat: string;
  mapLng: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  footerTaglines: string[];
  copyright: string;
  departureSlots: string[];
  bannerImage: string;
  bannerBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCta1Text: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Link: string;
  bannerStats: { value: string; label: string }[];
}

// ── Default Settings ─────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Du Thuyền Sông Hàn – 2Da Tickets",
  tagline: "Quầy Vé Du Thuyền Sông Hàn Đà Nẵng Uy Tín",
  hotline: "0796768636",
  hotline2: "",
  email: "support@duthuyensonghan.vn",
  address: "Cảng Sông Thu, dưới chân Cầu Trần Thị Lý, Đà Nẵng",
  workingHours: "24/7",
  facebook: "https://www.facebook.com/2datickets",
  tiktok: "https://www.tiktok.com/@duthuyensonghan.danang",
  youtube: "https://www.youtube.com/@2datickets",
  zalo: "https://zalo.me/0796768636",
  instagram: "",
  mapEmbedUrl: "",
  mapLat: "16.0600",
  mapLng: "108.2270",
  seoTitle: "Du thuyền Sông Hàn – Đặt Vé Uy Tín, Giá Tốt",
  seoDescription: "Top Du thuyền Sông Hàn Đà Nẵng Đẹp - Ưu tiên view đẹp, trực tiếp đón và dẫn lên du thuyền. Đặt vé nhanh, an toàn.",
  seoKeywords: "du thuyền sông hàn, du thuyen song han, vé du thuyền đà nẵng",
  footerTaglines: [
    "✅ Ưu tiên view đẹp.",
    "✅ Trực tiếp đón tại bến.",
    "✅ Trực tiếp dẫn lên du thuyền.",
  ],
  copyright: "© Copyright 2Da Tickets Du Thuyền Sông Hàn Đà Nẵng",
  departureSlots: [
    "17:00 – Chuyến chiều",
    "17:30 – Chuyến chiều tối",
    "19:00 – Chuyến tối",
    "19:30 – Chuyến tối muộn",
  ],
  bannerImage: "/images/banner_desktop.webp",
  bannerBadge: "⭐ Hơn 1000 đánh giá 5 sao trên Google",
  bannerTitle: "Du Thuyền Sông Hàn Đà Nẵng\nĐặt Vé Giá Tốt – Trực Tiếp Đón Khách",
  bannerSubtitle: "",
  bannerCta1Text: "📞 Đặt Vé Ngay",
  bannerCta1Link: "tel:0796768636",
  bannerCta2Text: "Xem Du Thuyền ↓",
  bannerCta2Link: "#khong-an-toi",
  bannerStats: [
    { value: "10+", label: "Du Thuyền" },
    { value: "1000+", label: "Đánh Giá 5★" },
    { value: "24/7", label: "Hỗ Trợ" },
    { value: "0đ", label: "Phí Giữ Chỗ" },
  ],
};

// ── Helper: parse JSON safely ─────────────────────
function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// ── Categories ──────────────────────────────────────
export async function getCategories(): Promise<CategoryData[]> {
  const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return cats.map(c => ({
    id: c.id,
    label: c.label,
    slug: c.slug,
    description: c.description ?? "",
  }));
}

export async function saveCategory(data: { label: string; slug: string; description?: string }) {
  return prisma.category.upsert({
    where: { slug: data.slug },
    create: data,
    update: data,
  });
}

// ── Cruises ─────────────────────────────────────────
function mapCruise(c: {
  id: string; slug: string; name: string; categoryId: string;
  badge: string | null; tagline: string | null; originalPrice: string | null;
  salePrice: string; floors: number; capacity: number;
  mainImage: string | null; gallery: string | null;
  highlights: string | null; description: string | null;
  tours: string | null; includes: string | null;
  relatedSlugs: string | null; isActive: boolean;
}): CruiseData {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    categoryId: c.categoryId,
    badge: c.badge ?? "",
    tagline: c.tagline ?? "",
    originalPrice: c.originalPrice ?? "",
    salePrice: c.salePrice,
    floors: c.floors,
    capacity: c.capacity,
    mainImage: c.mainImage ?? "",
    gallery: parseJSON(c.gallery, []),
    highlights: parseJSON(c.highlights, []),
    description: c.description ?? "",
    tours: parseJSON(c.tours, []),
    includes: parseJSON(c.includes, []),
    relatedSlugs: parseJSON(c.relatedSlugs, []),
    isActive: c.isActive,
  };
}

export async function getCruises(): Promise<CruiseData[]> {
  const cruises = await prisma.cruise.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return cruises.map(mapCruise);
}

export async function getAllCruises(): Promise<CruiseData[]> {
  const cruises = await prisma.cruise.findMany({ orderBy: { order: "asc" } });
  return cruises.map(mapCruise);
}

export async function getCruiseBySlug(slug: string): Promise<CruiseData | null> {
  const c = await prisma.cruise.findUnique({ where: { slug } });
  return c ? mapCruise(c) : null;
}

export async function createCruise(data: Omit<CruiseData, "id" | "isActive">): Promise<CruiseData> {
  const c = await prisma.cruise.create({
    data: {
      slug: data.slug,
      name: data.name,
      categoryId: data.categoryId,
      badge: data.badge,
      tagline: data.tagline,
      originalPrice: data.originalPrice,
      salePrice: data.salePrice,
      floors: data.floors,
      capacity: data.capacity,
      mainImage: data.mainImage,
      gallery: JSON.stringify(data.gallery),
      highlights: JSON.stringify(data.highlights),
      description: data.description,
      tours: JSON.stringify(data.tours),
      includes: JSON.stringify(data.includes),
      relatedSlugs: JSON.stringify(data.relatedSlugs),
    },
  });
  return mapCruise(c);
}

export async function updateCruise(slug: string, data: Partial<CruiseData>): Promise<boolean> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.salePrice !== undefined) updateData.salePrice = data.salePrice;
    if (data.floors !== undefined) updateData.floors = data.floors;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
    if (data.gallery !== undefined) updateData.gallery = JSON.stringify(data.gallery);
    if (data.highlights !== undefined) updateData.highlights = JSON.stringify(data.highlights);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.tours !== undefined) updateData.tours = JSON.stringify(data.tours);
    if (data.includes !== undefined) updateData.includes = JSON.stringify(data.includes);
    if (data.relatedSlugs !== undefined) updateData.relatedSlugs = JSON.stringify(data.relatedSlugs);
    if (data.slug !== undefined) updateData.slug = data.slug;

    await prisma.cruise.update({ where: { slug }, data: updateData });
    return true;
  } catch { return false; }
}

export async function deleteCruise(slug: string): Promise<boolean> {
  try {
    await prisma.cruise.delete({ where: { slug } });
    return true;
  } catch { return false; }
}

// ── Bookings ─────────────────────────────────────────
export async function getBookings(): Promise<BookingData[]> {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  return bookings.map(b => ({
    id: b.id,
    cruiseSlug: b.cruiseSlug,
    cruiseName: b.cruiseName,
    customerName: b.customerName,
    phone: b.phone,
    email: b.email ?? "",
    date: b.date,
    time: b.time,
    guests: b.guests,
    note: b.note ?? "",
    status: b.status as BookingStatus,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function createBooking(data: Omit<BookingData, "id" | "createdAt" | "status">): Promise<BookingData> {
  const b = await prisma.booking.create({ data: { ...data, status: "new" } });
  return {
    id: b.id, cruiseSlug: b.cruiseSlug, cruiseName: b.cruiseName,
    customerName: b.customerName, phone: b.phone, email: b.email ?? "",
    date: b.date, time: b.time, guests: b.guests, note: b.note ?? "",
    status: b.status as BookingStatus, createdAt: b.createdAt.toISOString(),
  };
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
  try {
    await prisma.booking.update({ where: { id }, data: { status } });
    return true;
  } catch { return false; }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    await prisma.booking.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Posts ─────────────────────────────────────────
export async function getPosts(): Promise<PostData[]> {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return posts.map(p => ({
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
    content: p.content ?? "", thumbnail: p.thumbnail ?? "",
    categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const p = await prisma.post.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
    content: p.content ?? "", thumbnail: p.thumbnail ?? "",
    categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  };
}

export async function createPost(data: Omit<PostData, "id" | "createdAt" | "updatedAt">): Promise<PostData> {
  const p = await prisma.post.create({ data });
  return {
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
    content: p.content ?? "", thumbnail: p.thumbnail ?? "",
    categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  };
}

export async function updatePost(id: string, data: Partial<PostData>): Promise<boolean> {
  try {
    await prisma.post.update({ where: { id }, data });
    return true;
  } catch { return false; }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Pricing ─────────────────────────────────────────
export async function getPricing(): Promise<PricingData> {
  const rows = await prisma.pricing.findMany({ orderBy: { order: "asc" } });
  const result: PricingData = {
    regularNote: "", regularPrices: [],
    dinnerNote: "", dinnerPrices: [],
    fireworksNote: "", fireworksPrices: [],
  };
  for (const r of rows) {
    const prices = parseJSON<PriceItem[]>(r.prices, []);
    if (r.key === "regular") { result.regularNote = r.note ?? ""; result.regularPrices = prices; }
    if (r.key === "dinner") { result.dinnerNote = r.note ?? ""; result.dinnerPrices = prices; }
    if (r.key === "fireworks") { result.fireworksNote = r.note ?? ""; result.fireworksPrices = prices; }
  }
  return result;
}

export async function savePricing(data: PricingData): Promise<void> {
  await prisma.pricing.upsert({
    where: { key: "regular" },
    create: { key: "regular", note: data.regularNote, prices: JSON.stringify(data.regularPrices) },
    update: { note: data.regularNote, prices: JSON.stringify(data.regularPrices) },
  });
  await prisma.pricing.upsert({
    where: { key: "dinner" },
    create: { key: "dinner", note: data.dinnerNote, prices: JSON.stringify(data.dinnerPrices) },
    update: { note: data.dinnerNote, prices: JSON.stringify(data.dinnerPrices) },
  });
  await prisma.pricing.upsert({
    where: { key: "fireworks" },
    create: { key: "fireworks", note: data.fireworksNote, prices: JSON.stringify(data.fireworksPrices) },
    update: { note: data.fireworksNote, prices: JSON.stringify(data.fireworksPrices) },
  });
}

// ── Settings ─────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));

  const settings = { ...DEFAULT_SETTINGS };
  for (const [key, value] of Object.entries(map)) {
    if (key in settings) {
      const defaultVal = (settings as Record<string, unknown>)[key];
      if (Array.isArray(defaultVal)) {
        (settings as Record<string, unknown>)[key] = parseJSON(value, defaultVal);
      } else {
        (settings as Record<string, unknown>)[key] = value;
      }
    }
  }
  return settings;
}

export async function saveSettings(data: Partial<SiteSettings>): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: strValue },
      update: { value: strValue },
    });
  }
}

// ── Contacts ─────────────────────────────────────────
export async function getContacts() {
  return prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createContact(data: { name: string; email?: string; phone?: string; subject?: string; message: string }) {
  return prisma.contact.create({ data });
}
