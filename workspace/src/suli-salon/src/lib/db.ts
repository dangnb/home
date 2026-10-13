// src/lib/db.ts - Database operations for Mộc Salon
import { Prisma } from "@prisma/client";
import prisma from "./prisma";

// Re-export prisma for direct access
export { prisma };

// ── Types ──────────────────────────────────────────

export interface ServiceData {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  duration: number;
  price: string;
  promoPrice: string;
  image: string;
  gallery: string[];
  isActive: boolean;
  order: number;
}

export interface CategoryData {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export type AppointmentStatus = "new" | "confirmed" | "cancelled" | "completed";

export interface AppointmentData {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceName: string;
  date: string;
  time: string;
  note: string;
  status: AppointmentStatus;
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

export interface PriceListItem {
  name: string;
  duration: string;
  price: string;
}

export interface PriceListData {
  id: string;
  category: string;
  items: PriceListItem[];
  order: number;
}

export interface GalleryItemData {
  id: string;
  title: string;
  image: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  isActive: boolean;
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
  aboutHeadline: string;
  aboutSubheadline: string;
  aboutImage1: string;
  aboutImage2: string;
  aboutValues: { title: string; description: string }[];
}

// ── Default Settings ─────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Mộc Salon",
  tagline: "Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp",
  hotline: "0988 123 456",
  hotline2: "024 3988 8888",
  email: "contact@mocsalon.vn",
  address: "Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
  workingHours: "Thứ Hai – Thứ Bảy: 09:00 – 20:00, Chủ Nhật: 09:00 – 18:00",
  facebook: "https://facebook.com/mocsalon.vietnam",
  tiktok: "https://tiktok.com/@mocsalon.official",
  youtube: "",
  zalo: "https://zalo.me/0988123456",
  instagram: "https://instagram.com/mocsalon.official",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4854580214644!2d105.85023437596956!3d21.01325128830906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8826555555%3A0x6b6e4e0b0e515d9!2zUGjhu5EgSHXhur8sIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lp!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn",
  mapLat: "21.0132",
  mapLng: "105.8502",
  seoTitle: "Mộc Salon – Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp",
  seoDescription: "Mộc Salon chuyên dịch vụ làm móng nghệ thuật, chăm sóc móng cao cấp, sơn gel, nail art và spa thư giãn. Đặt lịch ngay hôm nay.",
  seoKeywords: "mộc salon, moc salon, làm móng nghệ thuật, nail salon hà nội, chăm sóc móng, sơn gel, nail art, pedicure",
  footerTaglines: [
    "✨ Không gian thư giãn, phong cách mộc tự nhiên",
    "💅 Chuyên viên tận tâm, kỹ thuật nail art chuẩn Nhật – Hàn",
    "🌿 100% dụng cụ tiệt trùng y tế & sơn dưỡng chính hãng",
  ],
  copyright: "© 2025 Mộc Salon – Bảo lưu mọi quyền",
  departureSlots: [
    "09:00", "10:00", "11:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
  ],
  bannerImage: "",
  bannerBadge: "⭐ Không gian làm đẹp thư giãn hàng đầu",
  bannerTitle: "Mộc Salon\nNghệ thuật móng tinh tế",
  bannerSubtitle: "Chăm sóc móng cao cấp, tôn vinh vẻ đẹp tự nhiên và phong cách riêng của bạn",
  bannerCta1Text: "Đặt lịch ngay",
  bannerCta1Link: "/booking",
  bannerCta2Text: "Khám phá dịch vụ ↓",
  bannerCta2Link: "#services",
  bannerStats: [
    { value: "10+", label: "Dịch vụ cao cấp" },
    { value: "500+", label: "Khách hàng hài lòng" },
    { value: "5★", label: "Đánh giá chất lượng" },
    { value: "7", label: "Ngày phục vụ / tuần" },
  ],
  aboutHeadline: "Tỉ mỉ trong từng nét đẹp",
  aboutSubheadline: "Mộc Salon mang đến trải nghiệm chăm sóc móng chỉn chu, kết hợp kỹ thuật tinh tế với không gian thư giãn dành riêng cho bạn.",
  aboutImage1: "",
  aboutImage2: "",
  aboutValues: [
    { title: "Tỉ mỉ", description: "Mỗi đường nét và bước chăm sóc đều được thực hiện cẩn trọng." },
    { title: "Vệ sinh", description: "Dụng cụ được khử khuẩn kỹ lưỡng chuẩn y khoa để bạn luôn an tâm." },
    { title: "Thư giãn", description: "Không gian nhẹ nhàng để bạn tận hưởng trọn vẹn thời gian làm đẹp." }
  ],
};

// ── Helper ────────────────────────────────────────
function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// ── Categories ──────────────────────────────────────
export async function getCategories(): Promise<CategoryData[]> {
  const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return cats.map(c => ({
    id: c.id, label: c.label, slug: c.slug, description: c.description ?? "",
  }));
}

export async function saveCategory(data: { label: string; slug: string; description?: string }) {
  return prisma.category.upsert({
    where: { slug: data.slug },
    create: data,
    update: data,
  });
}

// ── Services ────────────────────────────────────────
export async function getServices(): Promise<ServiceData[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return services.map(s => ({
    id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
    description: s.description ?? "", duration: s.duration,
    price: s.price, promoPrice: s.promoPrice ?? "",
    image: s.image ?? "", gallery: parseJSON(s.gallery, []),
    isActive: s.isActive, order: s.order,
  }));
}

export async function getAllServices(): Promise<ServiceData[]> {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return services.map(s => ({
    id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
    description: s.description ?? "", duration: s.duration,
    price: s.price, promoPrice: s.promoPrice ?? "",
    image: s.image ?? "", gallery: parseJSON(s.gallery, []),
    isActive: s.isActive, order: s.order,
  }));
}

export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  const s = await prisma.service.findUnique({ where: { slug } });
  if (!s) return null;
  return {
    id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
    description: s.description ?? "", duration: s.duration,
    price: s.price, promoPrice: s.promoPrice ?? "",
    image: s.image ?? "", gallery: parseJSON(s.gallery, []),
    isActive: s.isActive, order: s.order,
  };
}

export async function createService(data: Omit<ServiceData, "id" | "isActive" | "order">): Promise<ServiceData> {
  const s = await prisma.service.create({
    data: {
      slug: data.slug, name: data.name, categoryId: data.categoryId,
      description: data.description, duration: data.duration,
      price: data.price, promoPrice: data.promoPrice || null,
      image: data.image, gallery: JSON.stringify(data.gallery),
    },
  });
  return {
    id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
    description: s.description ?? "", duration: s.duration,
    price: s.price, promoPrice: s.promoPrice ?? "",
    image: s.image ?? "", gallery: parseJSON(s.gallery, []),
    isActive: s.isActive, order: s.order,
  };
}

export async function updateService(slug: string, data: Partial<ServiceData>): Promise<boolean> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.promoPrice !== undefined) updateData.promoPrice = data.promoPrice || null;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.gallery !== undefined) updateData.gallery = JSON.stringify(data.gallery);
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await prisma.service.update({ where: { slug }, data: updateData });
    return true;
  } catch { return false; }
}

export async function deleteService(slug: string): Promise<boolean> {
  try {
    await prisma.service.delete({ where: { slug } });
    return true;
  } catch { return false; }
}

// ── Backward Compatibility ──────────────────────────
// These aliases keep old public pages working without changes
export const getCruises = getServices;
export const getCruiseBySlug = getServiceBySlug;
export type CruiseData = ServiceData & {
  badge: string; tagline: string; originalPrice: string; salePrice: string;
  floors: number; capacity: number; mainImage: string; highlights: string[];
  tours: { name: string; icon: string; schedule: string[] }[];
  includes: string[]; relatedSlugs: string[];
};

export interface PriceItem { label: string; price: string; }
export interface PricingData {
  regularNote: string; regularPrices: PriceItem[];
  dinnerNote: string; dinnerPrices: PriceItem[];
  fireworksNote: string; fireworksPrices: PriceItem[];
}

export async function getPricing(): Promise<PricingData> {
  // Map new PriceList data to old PricingData format for backward compat
  const lists = await getPriceLists();
  const manicure = lists.find(l => l.category === "Manicure");
  const pedicure = lists.find(l => l.category === "Pedicure");
  const nailArt = lists.find(l => l.category === "Nail Art");
  return {
    regularNote: "Manicure Services",
    regularPrices: (manicure?.items ?? []).map(i => ({ label: `${i.name} (${i.duration})`, price: i.price })),
    dinnerNote: "Pedicure Services",
    dinnerPrices: (pedicure?.items ?? []).map(i => ({ label: `${i.name} (${i.duration})`, price: i.price })),
    fireworksNote: "Nail Art & Extensions",
    fireworksPrices: (nailArt?.items ?? []).map(i => ({ label: `${i.name} (${i.duration})`, price: i.price })),
  };
}

// ── Appointments ─────────────────────────────────────
export async function getAppointments(): Promise<AppointmentData[]> {
  const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" } });
  return appointments.map(a => ({
    id: a.id, customerName: a.customerName, phone: a.phone,
    email: a.email ?? "", serviceName: a.serviceName,
    date: a.date, time: a.time, note: a.note ?? "",
    status: a.status as AppointmentStatus,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function createAppointment(data: Omit<AppointmentData, "id" | "createdAt" | "status">): Promise<AppointmentData> {
  const a = await prisma.appointment.create({ data: { ...data, status: "new" } });
  return {
    id: a.id, customerName: a.customerName, phone: a.phone,
    email: a.email ?? "", serviceName: a.serviceName,
    date: a.date, time: a.time, note: a.note ?? "",
    status: a.status as AppointmentStatus,
    createdAt: a.createdAt.toISOString(),
  };
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<boolean> {
  try {
    await prisma.appointment.update({ where: { id }, data: { status } });
    return true;
  } catch { return false; }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    await prisma.appointment.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Gallery ─────────────────────────────────────────
export async function getGalleryItems(): Promise<GalleryItemData[]> {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return items.map(g => ({
    id: g.id, title: g.title ?? "", image: g.image,
    category: g.category ?? "", order: g.order, isActive: g.isActive,
  }));
}

export async function createGalleryItem(data: { title?: string; image: string; category?: string }): Promise<GalleryItemData> {
  const g = await prisma.galleryItem.create({ data });
  return {
    id: g.id, title: g.title ?? "", image: g.image,
    category: g.category ?? "", order: g.order, isActive: g.isActive,
  };
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    await prisma.galleryItem.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Price List ──────────────────────────────────────
export async function getPriceLists(): Promise<PriceListData[]> {
  const lists = await prisma.priceList.findMany({ orderBy: { order: "asc" } });
  return lists.map(p => ({
    id: p.id, category: p.category,
    items: parseJSON<PriceListItem[]>(p.items, []),
    order: p.order,
  }));
}

export async function savePriceList(category: string, items: PriceListItem[]): Promise<void> {
  await prisma.priceList.upsert({
    where: { category },
    create: { category, items: JSON.stringify(items) },
    update: { items: JSON.stringify(items) },
  });
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

export async function getPublishedPosts(): Promise<PostData[]> {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(p => ({
    id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
    content: p.content ?? "", thumbnail: p.thumbnail ?? "",
    categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
    createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getPublishedPostBySlug(slug: string): Promise<PostData | null> {
  const p = await prisma.post.findFirst({ where: { slug, status: "published" } });
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

// ── Settings ─────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings> {
  let rows: { key: string; value: string }[] = [];

  try {
    rows = await prisma.setting.findMany();
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021")) {
      throw error;
    }
  }

  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));

  const settings = { ...DEFAULT_SETTINGS };
  for (const [key, value] of Object.entries(map)) {
    if (key in settings) {
      const lowerVal = typeof value === "string" ? value.toLowerCase() : "";
      if (
        lowerVal.includes("suli") ||
        lowerVal.includes("duthuyen") ||
        lowerVal.includes("songhan") ||
        lowerVal.includes("2da tickets") ||
        lowerVal.includes("sông thu") ||
        lowerVal.includes("prague") ||
        lowerVal.includes("náměstí") ||
        lowerVal.includes("czech")
      ) {
        continue;
      }
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

// ── Team Members ────────────────────────────────────
export async function getTeamMembers(): Promise<TeamMemberData[]> {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return members.map(m => ({
    id: m.id, name: m.name, role: m.role,
    image: m.image ?? "", bio: m.bio ?? "",
    order: m.order, isActive: m.isActive,
  }));
}

export async function createTeamMember(data: Omit<TeamMemberData, "id">): Promise<TeamMemberData> {
  const m = await prisma.teamMember.create({ data });
  return {
    id: m.id, name: m.name, role: m.role,
    image: m.image ?? "", bio: m.bio ?? "",
    order: m.order, isActive: m.isActive,
  };
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberData>): Promise<boolean> {
  try {
    await prisma.teamMember.update({ where: { id }, data });
    return true;
  } catch { return false; }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    await prisma.teamMember.delete({ where: { id } });
    return true;
  } catch { return false; }
}
