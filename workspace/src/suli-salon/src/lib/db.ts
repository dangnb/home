// src/lib/db.ts - Database operations for Mộc Salon
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
  phone?: string;
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
  popupEnabled: boolean;
  popupLevel: "info" | "promo" | "warning" | "urgent";
  popupBadge: string;
  popupTitle: string;
  popupContent: string;
  popupCtaText: string;
  popupCtaLink: string;
  popupDismissType: "daily" | "session" | "always" | "until_change";
}

// ── Default Settings ─────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Mộc Salon",
  tagline: "Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp | Refined Nail Artistry & Luxury Care",
  hotline: "0988 123 456",
  hotline2: "024 3988 8888",
  phone: "0988 123 456",
  email: "contact@mocsalon.vn",
  address: "Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội | 123 Pho Hue St, Hang Bai Ward, Hoan Kiem Dist, Hanoi",
  workingHours: "Thứ Hai – Thứ Bảy: 09:00 – 20:00, Chủ Nhật: 09:00 – 18:00 | Mon – Sat: 09:00 – 20:00, Sun: 09:00 – 18:00",
  facebook: "https://facebook.com/mocsalon.vietnam",
  tiktok: "https://tiktok.com/@mocsalon.official",
  youtube: "",
  zalo: "https://zalo.me/0988123456",
  instagram: "https://instagram.com/mocsalon.official",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4854580214644!2d105.85023437596956!3d21.01325128830906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8826555555%3A0x6b6e4e0b0e515d9!2zUGjhu5EgSHXhur8sIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lp!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn",
  mapLat: "21.0132",
  mapLng: "105.8502",
  seoTitle: "Mộc Salon – Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp | Refined Nail Artistry",
  seoDescription: "Mộc Salon chuyên dịch vụ làm móng nghệ thuật, chăm sóc móng cao cấp, sơn gel, nail art và spa thư giãn. | Premium nail artistry, luxury manicure, pedicure, and soothing spa treatments.",
  seoKeywords: "mộc salon, moc salon, làm móng nghệ thuật, nail salon hà nội, chăm sóc móng, sơn gel, nail art, pedicure",
  footerTaglines: [
    "✨ Không gian thư giãn, phong cách mộc tự nhiên | Serene sanctuary with natural warmth",
    "💅 Chuyên viên tận tâm, kỹ thuật nail art chuẩn Nhật – Hàn | Japanese & Korean nail artistry",
    "🌿 100% dụng cụ tiệt trùng y tế & sơn dưỡng chính hãng | 100% autoclave sterilized & genuine polish",
  ],
  copyright: "© 2025 Mộc Salon – Bảo lưu mọi quyền | © 2025 Mộc Salon – All rights reserved",
  departureSlots: [
    "09:00", "10:00", "11:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
  ],
  bannerImage: "",
  bannerBadge: "⭐ Không gian làm đẹp thư giãn hàng đầu | ⭐ Premier Relaxing Beauty Sanctuary",
  bannerTitle: "Mộc Salon\nNghệ thuật móng tinh tế | Mộc Salon\nRefined Nail Artistry",
  bannerSubtitle: "Chăm sóc móng cao cấp, tôn vinh vẻ đẹp tự nhiên và phong cách riêng của bạn | Premium nail care, celebrating your natural elegance and personal style",
  bannerCta1Text: "Đặt lịch ngay | Book Now",
  bannerCta1Link: "/booking",
  bannerCta2Text: "Khám phá dịch vụ ↓ | Explore Services ↓",
  bannerCta2Link: "#services",
  bannerStats: [
    { value: "8+", label: "Năm kinh nghiệm | Years of Experience" },
    { value: "5000+", label: "Khách hàng hài lòng | Happy Guests" },
    { value: "100%", label: "Tiệt trùng y tế | Sterilized Tools" },
    { value: "5★", label: "Đánh giá chất lượng | 5-Star Reviews" },
  ],
  aboutHeadline: "Tỉ mỉ trong từng nét đẹp | Meticulous in Every Detail",
  aboutSubheadline: "Mộc Salon mang đến trải nghiệm chăm sóc móng chỉn chu, kết hợp kỹ thuật tinh tế với không gian thư giãn dành riêng cho bạn. | Mộc Salon delivers thoughtful nail care, uniting delicate craftsmanship with a serene sanctuary tailored for you.",
  aboutImage1: "",
  aboutImage2: "",
  aboutValues: [
    { title: "Tỉ mỉ | Meticulous", description: "Mỗi đường nét và bước chăm sóc đều được thực hiện cẩn trọng. | Every curve and stroke is performed with gentle, uncompromising care." },
    { title: "Vệ sinh y tế | Clinical Hygiene", description: "Dụng cụ được tiệt trùng autoclave chuẩn y khoa để bạn luôn an tâm. | All instruments undergo medical autoclave sterilization for total peace of mind." },
    { title: "Thư giãn | Serene Sanctuary", description: "Không gian nhẹ nhàng ấm cúng để bạn tận hưởng trọn vẹn thời gian làm đẹp. | A tranquil ambiance designed for you to unwind and savour your beauty ritual." },
  ],
  popupEnabled: false,
  popupLevel: "promo",
  popupBadge: "Ưu Đãi Đặc Biệt | Special Offer",
  popupTitle: "Chào mừng quý khách đến với Mộc Salon | Welcome to Mộc Salon",
  popupContent: "Tặng ngay voucher giảm giá 20% cho khách hàng đặt lịch hẹn online lần đầu trong tuần này. Trải nghiệm dịch vụ chăm sóc móng chuẩn y khoa cùng nghệ nhân hàng đầu!\n\n✦ Hotline tư vấn: 0988 123 456\n✦ Địa chỉ: 123 Phố Huế, Hoàn Kiếm, Hà Nội",
  popupCtaText: "Đặt lịch nhận ưu đãi | Book Now",
  popupCtaLink: "/dat-lich",
  popupDismissType: "daily",
};

// ── Helper ────────────────────────────────────────
function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// ── In-Memory Read Cache for Static Build & DB Resilience ──
const CACHE_TTL_MS = 20_000;

let cachedSettings: { data: SiteSettings; time: number } | null = null;
let cachedServices: { data: ServiceData[]; time: number } | null = null;
let cachedCategories: { data: CategoryData[]; time: number } | null = null;
let cachedGallery: { data: GalleryItemData[]; time: number } | null = null;
let cachedPosts: { data: PostData[]; time: number } | null = null;
let cachedTeam: { data: TeamMemberData[]; time: number } | null = null;
let cachedPriceLists: { data: PriceListData[]; time: number } | null = null;

export function invalidateDbCache(): void {
  cachedSettings = null;
  cachedServices = null;
  cachedCategories = null;
  cachedGallery = null;
  cachedPosts = null;
  cachedTeam = null;
  cachedPriceLists = null;
}

// ── Categories ──────────────────────────────────────
export async function getCategories(): Promise<CategoryData[]> {
  const now = Date.now();
  if (cachedCategories && now - cachedCategories.time < CACHE_TTL_MS) {
    return cachedCategories.data;
  }
  try {
    const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
    const result = cats.map(c => ({
      id: c.id, label: c.label, slug: c.slug, description: c.description ?? "",
    }));
    cachedCategories = { data: result, time: now };
    return result;
  } catch (error) {
    console.warn("Unable to fetch categories from DB:", error);
    return cachedCategories?.data ?? [];
  }
}

export async function saveCategory(data: { label: string; slug: string; description?: string }) {
  cachedCategories = null;
  return prisma.category.upsert({
    where: { slug: data.slug },
    create: data,
    update: data,
  });
}

// ── Services ────────────────────────────────────────
export async function getServices(): Promise<ServiceData[]> {
  const now = Date.now();
  if (cachedServices && now - cachedServices.time < CACHE_TTL_MS) {
    return cachedServices.data;
  }
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    const result = services.map(s => ({
      id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
      description: s.description ?? "", duration: s.duration,
      price: s.price, promoPrice: s.promoPrice ?? "",
      image: s.image ?? "", gallery: parseJSON(s.gallery, []),
      isActive: s.isActive, order: s.order,
    }));
    cachedServices = { data: result, time: now };
    return result;
  } catch (error) {
    console.warn("Unable to fetch services from DB:", error);
    return cachedServices?.data ?? [];
  }
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
  cachedServices = null;
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
    cachedServices = null;
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
    cachedServices = null;
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

// ── Default Gallery Items ───────────────────────────
export const DEFAULT_GALLERY_ITEMS: GalleryItemData[] = [
  {
    id: "gallery-1",
    title: "Vân Đá Cẩm Thạch Thạch Anh | Rose Quartz & Marble Veins",
    category: "Nghệ Thuật Vẽ Móng | Nail Art",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    order: 0,
    isActive: true,
  },
  {
    id: "gallery-2",
    title: "Sơn Gel Mắt Mèo Ánh Trăng | Moonlight Cat-Eye Gel",
    category: "Móng Gel Cao Cấp | Gel Nails",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    isActive: true,
  },
  {
    id: "gallery-3",
    title: "Pháp Cổ Điển Hiện Đại | Modern Minimalist French",
    category: "Chăm Sóc Móng Tay | Manicure",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    isActive: true,
  },
  {
    id: "gallery-4",
    title: "Nail Art Đính Pha Lê Lấp Lánh | Sparkling Crystal Embellishments",
    category: "Nghệ Thuật Vẽ Móng | Nail Art",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
    order: 3,
    isActive: true,
  },
  {
    id: "gallery-5",
    title: "Nối Móng Gel Dáng Hạnh Nhân | Almond Soft Gel Extensions",
    category: "Nối Móng & Đắp Bột | Extensions",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    order: 4,
    isActive: true,
  },
  {
    id: "gallery-6",
    title: "Ombre Tráng Gương Ngọc Trai | Glazed Pearl Chrome Ombré",
    category: "Móng Gel Cao Cấp | Gel Nails",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    order: 5,
    isActive: true,
  },
  {
    id: "gallery-7",
    title: "Chăm Sóc & Massage Gót Hồng Spa | Relaxing Foot Spa & Pedicure",
    category: "Chăm Sóc Móng Chân | Pedicure",
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80",
    order: 6,
    isActive: true,
  },
  {
    id: "gallery-8",
    title: "Bộ Sưu Tập Nude Thanh Lịch | Timeless Nude Palette",
    category: "Chăm Sóc Móng Tay | Manicure",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
    order: 7,
    isActive: true,
  },
  {
    id: "gallery-9",
    title: "Gel Thạch Ánh Nhũ Kim Tuyến | Shimmer Jelly Gel Art",
    category: "Móng Gel Cao Cấp | Gel Nails",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80",
    order: 8,
    isActive: true,
  },
  {
    id: "gallery-10",
    title: "Họa Tiết Hoa Cúc Thảo Mộc | Botanical Floral Nail Art",
    category: "Nghệ Thuật Vẽ Móng | Nail Art",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    order: 9,
    isActive: true,
  },
  {
    id: "gallery-11",
    title: "Đắp Bột Ombre Nhẹ Nhàng | Soft Powder Ombre Sculpt",
    category: "Nối Móng & Đắp Bột | Extensions",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80",
    order: 10,
    isActive: true,
  },
  {
    id: "gallery-12",
    title: "Liệu Trình Ngâm Chân Cánh Hoa Thảo Dược | Herbal Floral Foot Soak",
    category: "Chăm Sóc Móng Chân | Pedicure",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    order: 11,
    isActive: true,
  },
  {
    id: "gallery-13",
    title: "Sơn Móng Nghệ Thuật Pastel Nhật Bản | Japanese Pastel Craft",
    category: "Nghệ Thuật Vẽ Móng | Nail Art",
    image: "https://images.unsplash.com/photo-1600091166971-7f9faad6a1ce?auto=format&fit=crop&w=1200&q=80",
    order: 12,
    isActive: true,
  },
  {
    id: "gallery-14",
    title: "Tạo Dáng Móng Thang & Tráng Gương | Coffin Shape Mirror Chrome",
    category: "Nối Móng & Đắp Bột | Extensions",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    order: 13,
    isActive: true,
  },
  {
    id: "gallery-15",
    title: "Mẫu Móng Thiết Kế Độc Bản Mộc Salon | Signature Mộc Bespoke Nails",
    category: "Móng Gel Cao Cấp | Gel Nails",
    image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg",
    order: 14,
    isActive: true,
  },
  {
    id: "gallery-16",
    title: "Trị Liệu Dưỡng Ẩm Chuyên Sâu Cắt Da Spa | Deep Hydrating Spa Pedicure",
    category: "Chăm Sóc Móng Chân | Pedicure",
    image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg",
    order: 15,
    isActive: true,
  },
];

// ── Gallery ─────────────────────────────────────────
export async function getGalleryItems(): Promise<GalleryItemData[]> {
  const now = Date.now();
  if (cachedGallery && now - cachedGallery.time < CACHE_TTL_MS) {
    return cachedGallery.data;
  }
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
    const dbItems = items.map(g => ({
      id: g.id, title: g.title ?? "", image: g.image,
      category: g.category ?? "", order: g.order, isActive: g.isActive,
    }));

    if (dbItems.length === 0) {
      cachedGallery = { data: DEFAULT_GALLERY_ITEMS, time: now };
      return DEFAULT_GALLERY_ITEMS;
    }

    // Merge with defaults so there's always a rich, full collection without duplicate images
    const existingImages = new Set(dbItems.map(i => i.image));
    const merged = [
      ...dbItems,
      ...DEFAULT_GALLERY_ITEMS.filter(item => !existingImages.has(item.image)),
    ];
    cachedGallery = { data: merged, time: now };
    return merged;
  } catch (error) {
    console.warn("Unable to fetch gallery items from DB:", error);
    return cachedGallery?.data ?? DEFAULT_GALLERY_ITEMS;
  }
}

export async function createGalleryItem(data: { title?: string; image: string; category?: string }): Promise<GalleryItemData> {
  cachedGallery = null;
  const g = await prisma.galleryItem.create({ data });
  return {
    id: g.id, title: g.title ?? "", image: g.image,
    category: g.category ?? "", order: g.order, isActive: g.isActive,
  };
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    cachedGallery = null;
    await prisma.galleryItem.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Price List ──────────────────────────────────────
export async function getPriceLists(): Promise<PriceListData[]> {
  const now = Date.now();
  if (cachedPriceLists && now - cachedPriceLists.time < CACHE_TTL_MS) {
    return cachedPriceLists.data;
  }
  try {
    const lists = await prisma.priceList.findMany({ orderBy: { order: "asc" } });
    const result = lists.map(p => ({
      id: p.id, category: p.category,
      items: parseJSON<PriceListItem[]>(p.items, []),
      order: p.order,
    }));
    cachedPriceLists = { data: result, time: now };
    return result;
  } catch (error) {
    console.warn("Unable to fetch price lists from DB:", error);
    return cachedPriceLists?.data ?? [];
  }
}

export async function savePriceList(category: string, items: PriceListItem[]): Promise<void> {
  cachedPriceLists = null;
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

// ── Default Blog Posts ──────────────────────────────
export const DEFAULT_POSTS: PostData[] = [
  {
    id: "post-1",
    title: "Top 5 Xu Hướng Móng Nghệ Thuật Được Yêu Thích Nhất 2025 | Top 5 Trending Nail Art Styles for 2025",
    slug: "xu-huong-mong-nghe-thuat-2025",
    excerpt: "Khám phá những phong cách nail art dẫn đầu xu hướng năm 2025: từ tráng gương ngọc trai thanh lịch đến vân đá cẩm thạch huyền bí. | Explore the leading nail art trends of 2025: from understated glazed chrome to ethereal marble textures.",
    content: `<h2>1. Tráng Gương Ngọc Trai (Glazed Pearl Chrome Nails)</h2>
<p>Lấy cảm hứng từ ánh sáng dịu dàng của xà cừ và ngọc trai thiên nhiên, phong cách móng tráng gương đem lại cảm giác sang trọng, thanh khiết và cực kỳ tôn da. Lớp bột chrome tán mịn tạo hiệu ứng bắt sáng óng ánh tựa sương mai dưới ánh nắng.</p>
<h2>2. Vân Đá Cẩm Thạch Huyền Bí (Ethereal Marble Veins)</h2>
<p>Từng đường vân đá uyển chuyển được nghệ nhân vẽ tay tỉ mỉ bằng cọ nét siêu mảnh, kết hợp cùng nhũ vàng 24K ánh kim tạo nên vẻ đẹp độc bản, không mẫu móng nào trùng lặp.</p>
<h2>3. Phong Cách Pháp Hiện Đại (Modern Micro French)</h2>
<p>Đường viền đầu móng siêu mảnh với tone màu pastel, nâu tây hoặc vàng kim loại mang lại nét thanh lịch vượt thời gian, phù hợp hoàn hảo cho cả môi trường công sở lẫn các buổi tiệc dạ hội.</p>
<h2>4. Móng Mắt Mèo Ánh Kim (Magnetic Cat-Eye Velvet)</h2>
<p>Hiệu ứng hạt từ tính chuyển động dưới góc nhìn đa chiều mang đến chiều sâu huyền ảo tựa dải ngân hà, đặc biệt phù hợp trên nền thạch nude hoặc thạch nâu hổ phách.</p>
<h2>5. Đính Pha Lê Tối Giản (Minimalist Crystal Accents)</h2>
<p>Không quá phô trương nhưng vừa đủ tinh tế để thu hút mọi ánh nhìn với các viên pha lê Swarovski cao cấp được cố định khéo léo tại chân móng.</p>
<!-- bilingual-split -->
<h2>1. Glazed Pearl Chrome Nails</h2>
<p>Inspired by the iridescent sheen of mother-of-pearl, glazed chrome nails radiate effortless sophistication and luminous elegance. The micro-fine chrome powder delivers a dewy, translucent finish that complements every skin tone.</p>
<h2>2. Ethereal Marble Veins</h2>
<p>Fluid, organic mineral swirls accented with subtle liquid-gold flakes create a one-of-a-kind bespoke masterpiece on every fingertip, mirroring authentic rose quartz and jade textures.</p>
<h2>3. Modern Micro French</h2>
<p>An ultra-fine tip line rendered in champagne gold or soft earthy pastels offers modern poise, effortlessly transitioning from daytime boardroom meetings to evening galas.</p>
<h2>4. Magnetic Cat-Eye Velvet</h2>
<p>Multidimensional magnetic particles shift dynamically with every hand gesture, capturing ambient light to create a velvety, celestial depth over neutral jelly undertones.</p>
<h2>5. Minimalist Crystal Accents</h2>
<p>Delicate Swarovski crystals placed with intentional restraint bring subtle brilliance to every gesture without overwhelming the natural silhouette of the hand.</p>`,
    categoryId: "xu-huong",
    thumbnail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-02-15T08:30:00.000Z",
    updatedAt: "2025-02-15T08:30:00.000Z",
  },
  {
    id: "post-2",
    title: "Bí Quyết Chăm Sóc Móng Chắc Khỏe Sau Khi Sơn Gel | Expert Guide to Keeping Nails Healthy After Gel Polish",
    slug: "bi-quyet-cham-soc-mong-chac-khoe-sau-son-gel",
    excerpt: "Những lời khuyên từ chuyên gia Mộc Salon giúp bạn bảo vệ màng sừng keratin và duy trì bộ móng chắc khỏe, sáng hồng. | Expert tips from Mộc Salon specialists on protecting natural keratin and maintaining strong, healthy nails.",
    content: `<h2>Tại Sao Móng Tự Nhiên Cần Được Nuôi Dưỡng?</h2>
<p>Dù sơn gel mang lại vẻ đẹp bền bỉ và bóng bẩy đến 3-4 tuần, phiến móng tự nhiên bên dưới vẫn là các lớp keratin sống cần được cung cấp độ ẩm liên tục để không bị giòn và tách lớp.</p>
<h2>4 Thói Quen Quan Trọng Cho Bộ Móng Khỏe Đẹp:</h2>
<ul>
  <li><strong>Dùng dầu dưỡng viền móng (Cuticle Oil):</strong> Thoa 1 giọt dầu jojoba hoặc dầu hạnh nhân quanh viền móng mỗi tối giúp làm mềm da và kích thích móng mọc dày hơn.</li>
  <li><strong>Tuyệt đối không tự cạy hoặc bóc lớp sơn gel:</strong> Việc giật mạnh lớp sơn gel sẽ lột theo lớp sừng ngoài cùng của móng thật, khiến móng mỏng yếu và ê buốt. Hãy đến salon để được ủ tháo chuyên dụng.</li>
  <li><strong>Đeo găng tay bảo hộ:</strong> Khi dọn dẹp nhà cửa hay rửa chén, hóa chất tẩy rửa sẽ làm khô ráp tế bào biểu bì và giảm độ bền của gel.</li>
  <li><strong>Bổ sung dưỡng chất từ bên trong:</strong> Tăng cường thực phẩm giàu Biotin (trứng, hạt hạnh nhân), Kẽm và uống đủ 2 lít nước mỗi ngày.</li>
</ul>
<!-- bilingual-split -->
<h2>Why Natural Nails Need Continuous Care</h2>
<p>While gel polish delivers long-lasting radiance for weeks, the underlying natural nail bed is comprised of delicate keratin layers that require ongoing hydration to avoid brittleness and peeling.</p>
<h2>4 Essential At-Home Habits for Radiant Nails:</h2>
<ul>
  <li><strong>Daily Cuticle Oil Hydration:</strong> Gently massage pure jojoba or almond oil into the nail bed every evening to seal in moisture and promote resilient growth.</li>
  <li><strong>Never Peel or Pick Gel Polish:</strong> Forcibly stripping gel removes vital dorsal layers of natural keratin, resulting in thinning and sensitivity. Always opt for gentle professional soak-off.</li>
  <li><strong>Protect Hands from Household Chemicals:</strong> Detergents and hot water strip essential lipids; wearing gloves protects both skin vitality and polish longevity.</li>
  <li><strong>Nourish from Within:</strong> Ensure balanced intake of Biotin, Zinc, Vitamin E, and generous daily hydration for naturally luminous nail health.</li>
</ul>`,
    categoryId: "cham-soc",
    thumbnail: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-02-12T09:15:00.000Z",
    updatedAt: "2025-02-12T09:15:00.000Z",
  },
  {
    id: "post-3",
    title: "Quy Trình Tiệt Trùng Y Tế Chuẩn 5 Sao Tại Mộc Salon | 5-Star Medical-Grade Sterilization at Mộc Salon",
    slug: "quy-trinh-tiet-trung-y-te-moc-salon",
    excerpt: "Sự an toàn và an tâm tuyệt đối của khách hàng là ưu tiên hàng đầu trong mọi dịch vụ tại Mộc Salon. | Your health, hygiene, and complete peace of mind are the cornerstone of every treatment at Mộc Salon.",
    content: `<h2>Cam Kết Vệ Sinh Chuẩn Y Khoa</h2>
<p>Tại Mộc Salon, chúng tôi quan niệm cái đẹp phải luôn song hành cùng sự an toàn tuyệt đối. Mỗi bộ kìm, que đẩy da và dụng cụ kim loại đều trải qua quy trình khử trùng khép kín 4 bước trước khi chạm vào tay khách hàng.</p>
<h2>Chi Tiết Quy Trình 4 Bước:</h2>
<ul>
  <li><strong>Bước 1 - Ngâm dung dịch khử khuẩn:</strong> Dụng cụ sau khi sử dụng được ngâm lập tức trong dung dịch sát khuẩn y tế chuyên dụng để loại bỏ vi sinh vật.</li>
  <li><strong>Bước 2 - Rửa siêu âm cavitation:</strong> Sóng siêu âm tần số cao rung lắc đánh bay các bụi bẩn và tế bào chết trong từng kẽ kìm siêu nhỏ.</li>
  <li><strong>Bước 3 - Đóng túi vô trùng:</strong> Mỗi bộ dụng cụ được niêm phong trong túi ép tiệt trùng y tế có vạch chỉ thị nhiệt độ đổi màu chuẩn quốc tế.</li>
  <li><strong>Bước 4 - Hấp tiệt trùng Autoclave:</strong> Sấy và hấp áp suất cao ở nhiệt độ 134°C, sau đó bảo quản trong tủ chiếu tia cực tím UV cho đến khi mở trước mặt khách hàng.</li>
</ul>
<!-- bilingual-split -->
<h2>Our Uncompromising Hygiene Philosophy</h2>
<p>At Mộc Salon, true luxury begins with clinical-grade safety. Every metal nipper, pusher, and file undergoes a meticulous four-stage medical sterilization protocol before every single appointment.</p>
<h2>Our 4-Stage Protocol Explained:</h2>
<ul>
  <li><strong>Stage 1 - Medical Enzymatic Soak:</strong> Instruments are immersed in hospital-grade disinfectant to neutralize surface pathogens immediately.</li>
  <li><strong>Stage 2 - Ultrasonic Cavitation:</strong> High-frequency sound waves dislodge microscopic residue from intricate joints and hinges.</li>
  <li><strong>Stage 3 - Sealed Indicator Pouches:</strong> Tools are individually packaged in medical pouches featuring temperature-responsive sterility test strips.</li>
  <li><strong>Stage 4 - High-Pressure Autoclave:</strong> Pressurized steam sterilization at 134°C eliminates 99.99% of bacteria, followed by UV-cabinet storage until opened table-side in front of you.</li>
</ul>`,
    categoryId: "tin-tuc",
    thumbnail: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-02-08T14:20:00.000Z",
    updatedAt: "2025-02-08T14:20:00.000Z",
  },
  {
    id: "post-4",
    title: "Bí Quyết Chọn Dáng Móng Tôn Dáng Bàn Tay Thon Dài | How to Choose the Perfect Nail Shape for Your Hands",
    slug: "cach-chon-dang-mong-phu-hop-voi-ban-tay",
    excerpt: "Dáng tròn, vuông, oval, hạnh nhân hay dáng thang? Khám phá cách chọn dáng móng chuẩn xác để tôn lên nét thon gọn tự nhiên của bàn tay bạn. | Almond, oval, square, or coffin? Discover how to find the most flattering nail shape to elongate and enhance your natural hand silhouette.",
    content: `<h2>Dáng Móng Có Quyết Định Đến Vẻ Đẹp Của Bàn Tay?</h2>
<p>Cũng như kiểu tóc tôn lên đường nét khuôn mặt, một phom móng phù hợp có thể tạo hiệu ứng thị giác giúp ngón tay trông thon thả, dài và thanh thoát hơn rõ rệt.</p>
<h2>Hướng Dẫn Chi Tiết Theo Từng Dáng Tay:</h2>
<ul>
  <li><strong>Ngón tay ngắn, bản móng rộng:</strong> Phù hợp nhất với dáng <em>Oval</em> hoặc <em>Hạnh nhân (Almond)</em>. Đầu móng thuôn nhọn nhẹ nhàng kéo dài trục ngón tay, tạo cảm giác mềm mại nữ tính.</li>
  <li><strong>Ngón tay thon dài gầy:</strong> Dáng <em>Vuông bo góc (Squoval)</em> hoặc <em>Vuông cổ điển</em> sẽ tạo sự cân đối, đầy đặn và sang trọng hiện đại.</li>
  <li><strong>Móng tự nhiên giòn yếu:</strong> Dáng <em>Tròn tự nhiên (Round)</em> ôm theo viền đầu ngón tay là lựa chọn an toàn nhất, hạn chế tối đa va quẹt làm gãy mẻ góc móng.</li>
  <li><strong>Phong cách cá tính, tiệc tùng:</strong> Dáng <em>Thang (Coffin/Ballerina)</em> mang lại vẻ đẹp thời thượng, cực kỳ tôn các thiết kế móng đắp bột và đính đá cầu kỳ.</li>
</ul>
<!-- bilingual-split -->
<h2>The Impact of Silhouette on Hand Aesthetics</h2>
<p>Just as a flattering hairstyle frames your facial contour, the right nail architecture visually elongates fingers, balances hand proportions, and elevates your overall posture.</p>
<h2>Expert Recommendations by Hand Profile:</h2>
<ul>
  <li><strong>Shorter Fingers or Broad Nail Beds:</strong> Opt for <em>Soft Almond</em> or <em>Oval</em>. Tapered contours visually draw the eye outward, creating the illusion of slender length.</li>
  <li><strong>Naturally Slender, Long Fingers:</strong> <em>Squoval</em> (squared with softened corners) or sharp classic square adds structure and poise without looking fragile.</li>
  <li><strong>Sensitive or Brittle Natural Nails:</strong> The <em>Natural Round</em> contour follows your fingertip curvature, providing optimal structural resistance against accidental chipping.</li>
  <li><strong>Avant-Garde & High Fashion:</strong> The <em>Coffin / Ballerina</em> silhouette offers an expansive canvas for architectural gel enhancements and crystal artistry.</li>
</ul>`,
    categoryId: "kinh-nghiem",
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-02-04T10:00:00.000Z",
    updatedAt: "2025-02-04T10:00:00.000Z",
  },
  {
    id: "post-5",
    title: "Nghệ Thuật Spa Pedicure: Thư Giãn Đôi Chân Với Thảo Dược Đông Y | The Art of Herbal Foot Spa Pedicure for Total Rejuvenation",
    slug: "nghe-thuat-spa-pedicure-thu-gian-dong-y",
    excerpt: "Liệu trình ngâm chân thảo mộc kết hợp massage bấm huyệt giải tỏa mệt mỏi và nuôi dưỡng làn da gót hồng mịn màng. | A soothing blend of herbal bath soaks, acupressure foot massage, and deep heel hydration for holistic wellness.",
    content: `<h2>Đôi Chân - Nơi Nâng Niu Toàn Bộ Cơ Thể</h2>
<p>Mỗi ngày đôi bàn chân phải chịu áp lực của hàng ngàn bước đi và những đôi giày cao gót. Liệu trình Spa Pedicure tại Mộc Salon không chỉ đơn thuần là làm sạch móng mà là một nghi thức phục hồi năng lượng toàn diện.</p>
<h2>Trải Nghiệm Đẳng Cấp Tại Mộc Salon:</h2>
<ul>
  <li><strong>Bồn ngâm thảo dược ấm áp:</strong> Hòa quyện giữa gừng tươi, quế chi, hoa hồng và muối khoáng biển sâu giúp kích thích tuần hoàn máu và khử mùi tự nhiên.</li>
  <li><strong>Tẩy tế bào chết đường mía & mật ong:</strong> Nhẹ nhàng lấy đi lớp sừng thô ráp mà không làm xước da, trả lại độ mịn màng cho gót chân.</li>
  <li><strong>Ủ dưỡng chất phục hồi gót sen:</strong> Tinh chất bơ hạt mỡ và sáp ong thẩm thấu sâu, giải quyết dứt điểm tình trạng nứt nẻ gót chân.</li>
  <li><strong>Massage bấm huyệt chuyên sâu 30 phút:</strong> Tác động lên các huyệt đạo Dũng Tuyền, Thái Xung giúp xua tan cảm giác nặng nề, mang lại giấc ngủ ngon và sâu hơn.</li>
</ul>
<!-- bilingual-split -->
<h2>Honouring the Foundation of Your Body</h2>
<p>Every day, your feet absorb the momentum of thousands of footsteps and high-heeled strain. The Signature Spa Pedicure at Mộc Salon transcends routine nail grooming into an indulgent therapeutic sanctuary.</p>
<h2>Signature Treatment Highlights:</h2>
<ul>
  <li><strong>Warming Herbal Infusion Bath:</strong> Infused with fresh ginger root, cinnamon bark, dried rose petals, and dead sea mineral salts to stimulate microcirculation.</li>
  <li><strong>Organic Cane Sugar & Honey Exfoliation:</strong> Gently sweeps away dry keratinized skin cells without irritation, unveiling baby-soft skin.</li>
  <li><strong>Deep Heel Repair Mask:</strong> Enriched with organic shea butter and beeswax to soothe fissures and restore enduring suppleness.</li>
  <li><strong>30-Minute Acupressure Reflexology:</strong> Targeting key pressure meridians (Yongquan, Taichong) to release lower-leg fatigue and promote deep restorative sleep.</li>
</ul>`,
    categoryId: "cham-soc",
    thumbnail: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-01-28T16:45:00.000Z",
    updatedAt: "2025-01-28T16:45:00.000Z",
  },
  {
    id: "post-6",
    title: "Bí Mật Kỹ Thuật Vẽ Vân Đá Cẩm Thạch & Thạch Anh Hồng | The Art of Handcrafted Marble & Rose Quartz Nail Art",
    slug: "bi-mat-ve-mong-van-da-cam-thach-rose-quartz",
    excerpt: "Tìm hiểu cách các nghệ nhân Mộc Salon tạo nên từng tầng vân đá cẩm thạch sống động, kết hợp lá vàng 24k mang lại phong thủy thịnh vượng. | Discover how Mộc Salon artisans layer translucent pigments and 24k gold leaf to create mesmerizing, gemstone-inspired nail designs.",
    content: `<h2>Nghệ Thuật Mô Phỏng Đá Quý Trên Móng</h2>
<p>Vân đá cẩm thạch (Marble Nails) và thạch anh hồng (Rose Quartz) luôn giữ vị trí độc tôn trong làng nail art cao cấp bởi vẻ đẹp vừa kiêu sa, vừa huyền bí lại mang ý nghĩa phong thủy tốt lành.</p>
<h2>Kỹ Thuật Tạo Tầng Đa Chiều Độc Bản:</h2>
<p>Để tạo ra độ sâu quang học như viên ngọc thật, nghệ nhân tại Mộc Salon không vẽ một nét đơn thuần mà phủ chồng từ 3 đến 5 lớp thạch trong mờ (translucent jelly):</p>
<ul>
  <li>Lớp nền thạch hồng phấn phớt nhẹ tạo độ trong trẻo cho phiến móng.</li>
  <li>Cọ nét siêu mảnh tán loang từng đường vân trắng sữa và xám khói bằng cồn loang chuyên dụng của Nhật Bản.</li>
  <li>Điểm xuyết lá vàng lá bạc 24K siêu mỏng ở các điểm giao thoa của đường vân.</li>
  <li>Phủ lớp top gel bóng gương dày dặn bảo vệ và tạo khúc xạ ánh sáng lấp lánh như mặt hồ nước mùa thu.</li>
</ul>
<!-- bilingual-split -->
<h2>Recreating Nature's Gemstones on Fingertips</h2>
<p>Marble and Rose Quartz nail art maintain an iconic status in haute nail couture due to their ethereal translucent depth, understated opulence, and harmonious positive energy symbolism.</p>
<h2>The Multi-Layer Dimensional Technique:</h2>
<p>To achieve genuine mineral depth, Mộc Salon technicians build designs through 3 to 5 delicate layers of sheer translucent jelly gel:</p>
<ul>
  <li>A subtle blush-pink jelly foundation establishes deep glass-like clarity.</li>
  <li>Ultra-fine liner brushes diffuse milky mineral veins using Japanese blending alcohols.</li>
  <li>Wisps of 24K genuine gold leaf accent structural fracture lines for celestial luminescence.</li>
  <li>A plush high-refraction top gel locks in the design, creating a mirror-like finish reminiscent of polished quartz crystals.</li>
</ul>`,
    categoryId: "xu-huong",
    thumbnail: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-01-22T11:30:00.000Z",
    updatedAt: "2025-01-22T11:30:00.000Z",
  },
  {
    id: "post-7",
    title: "Sơn Gel Có Làm Hư Tổn Móng? Góc Nhìn Chuyên Gia | Does Gel Polish Damage Nails? Expert Truths & Myth Busting",
    slug: "son-gel-hu-ton-mong-that-hay-hieu-lam",
    excerpt: "Giải đáp những thắc mắc phổ biến về tác động của đèn LED/UV, độ bám dính của gel và cách tháo sơn an toàn bảo vệ móng gốc. | Addressing common misconceptions about UV/LED curing, nail thinning, and safe removal techniques to protect natural nail integrity.",
    content: `<h2>Sự Thật Về Sơn Gel Và Sức Khỏe Móng</h2>
<p>Nhiều khách hàng lo ngại sơn gel thường xuyên sẽ khiến móng bị ố vàng, mỏng giòn và dễ gãy. Tuy nhiên, theo các chuyên gia da liễu và nail master tại Mộc Salon, bản thân chất sơn gel không làm hại móng nếu được thao tác đúng cách.</p>
<h2>3 Hiểu Lầm Phổ Biến Nhất:</h2>
<ul>
  <li><strong>Hiểu lầm 1: Sơn gel làm móng bị nghẹt không thở được.</strong><br/><em>Thực tế:</em> Phiến móng bên ngoài là tế bào sừng chết, không có chức năng hô hấp. Móng được nuôi dưỡng từ ma trận móng (matrix) nằm dưới da thông qua mạch máu trong cơ thể.</li>
  <li><strong>Hiểu lầm 2: Đèn hơ gel làm sạm da tay.</strong><br/><em>Thực tế:</em> Mộc Salon sử dụng đèn LED ánh sáng bước sóng chuẩn 365-405nm với thời gian hơ chỉ từ 30-60 giây, hoàn toàn an toàn và không gây tăng sắc tố da tay.</li>
  <li><strong>Hiểu lầm 3: Khâu làm hư móng nhiều nhất là gì?</strong><br/><em>Thực tế:</em> 90% tổn thương móng xảy ra ở công đoạn mài móng quá mức và việc khách hàng tự bóc sơn gel ở nhà. Khi được tháo sơn bằng dung dịch ủ mềm chuẩn y tế, lớp móng tự nhiên vẫn dày dặn và chắc khỏe.</li>
</ul>
<!-- bilingual-split -->
<h2>The Scientific Reality of Gel Polish</h2>
<p>Many clients worry that regular gel treatments inherently thin or discolor natural nails. According to dermatological research and master educators at Mộc Salon, high-quality gel does not cause damage when applied and removed with precision care.</p>
<h2>3 Common Myths Debunked:</h2>
<ul>
  <li><strong>Myth 1: Nails Need to 'Breathe' Between Gel Applications.</strong><br/><em>The Truth:</em> The visible nail plate is composed of dead keratinocytes that do not breathe. All cellular nourishment originates from the vascular nail matrix beneath the cuticle.</li>
  <li><strong>Myth 2: LED Curing Lamps Prematurely Age Hand Skin.</strong><br/><em>The Truth:</em> Mộc Salon utilizes certified dual-wavelength LED lamps (365–405nm) requiring only 30–60 seconds per layer, emitting negligible UV radiation that causes zero photo-damage.</li>
  <li><strong>Myth 3: What Actually Causes Nail Thinning?</strong><br/><em>The Truth:</em> Over 90% of nail trauma stems from over-filing the nail plate or forcefully peeling polish off at home. Gentle chemical soaking keeps the natural keratin structure pristine and resilient.</li>
</ul>`,
    categoryId: "kinh-nghiem",
    thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-01-16T15:00:00.000Z",
    updatedAt: "2025-01-16T15:00:00.000Z",
  },
  {
    id: "post-8",
    title: "Chương Trình Đặc Quyền Hội Viên & Ưu Đãi Tháng Mới | VIP Membership Privileges & Seasonal Exclusive Offers",
    slug: "dac-quyen-khach-hang-than-thiet-moc-salon",
    excerpt: "Trải nghiệm những ưu đãi tích điểm, quà tặng sinh nhật và dịch vụ chăm sóc móng cao cấp dành riêng cho hội viên thân thiết của Mộc Salon. | Exclusive tier privileges, birthday celebrations, and complimentary treatments tailored for cherished members of Mộc Salon.",
    content: `<h2>Tri Ân Khách Hàng Thân Thiết Của Mộc Salon</h2>
<p>Mộc Salon trân trọng từng khoảnh khắc bạn trao gửi niềm tin và thời gian làm đẹp cùng chúng tôi. Để bày tỏ sự tri ân, chương trình Thẻ Hội Viên Đặc Quyền mang đến những ưu đãi bất ngờ trong suốt cả năm.</p>
<h2>Các Hạng Thành Viên & Đặc Quyền Hấp Dẫn:</h2>
<ul>
  <li><strong>Hạng Bạc (Silver Member):</strong> Giảm ngay 10% cho mọi dịch vụ từ lần ghé thăm thứ hai; tặng liệu trình massage tay thư giãn trong tháng sinh nhật.</li>
  <li><strong>Hạng Vàng (Gold Member):</strong> Giảm 15% tổng hóa đơn, ưu tiên đặt lịch hẹn vào các khung giờ vàng cuối tuần và tặng voucher 200.000đ dịp lễ Tết.</li>
  <li><strong>Hạng Kim Cương (Diamond VIP):</strong> Giảm 20% trọn đời, miễn phí 100% dịch vụ tháo sơn gel và cắt da định kỳ, nhận set quà tặng tinh dầu dưỡng móng cao cấp nhập khẩu độc quyền.</li>
</ul>
<p><em>Hãy đăng ký thông tin hoặc liên hệ hotline <strong>0988 123 456</strong> để được tư vấn và kích hoạt hạng thẻ ngay trong hôm nay!</em></p>
<!-- bilingual-split -->
<h2>Celebrating Our Cherished Guests</h2>
<p>At Mộc Salon, we celebrate every appointment you entrust to our hands. To express our gratitude, our Privileged Membership Program presents thoughtful surprises, bespoke perks, and generous savings all year round.</p>
<h2>Membership Tiers & Exclusive Benefits:</h2>
<ul>
  <li><strong>Silver Tier:</strong> 10% savings on all nail and spa services starting from your second visit; complimentary revitalizing hand massage during your birthday month.</li>
  <li><strong>Gold Tier:</strong> 15% privileges across all bookings, VIP priority slot reservations during peak weekends, and celebratory holiday gift vouchers.</li>
  <li><strong>Diamond VIP Tier:</strong> 20% lifetime savings, complimentary gel soak-off and hygiene manicures on every visit, plus an exclusive bespoke organic cuticle care gift set.</li>
</ul>
<p><em>Inquire with your nail artist or contact our reception concierge at <strong>0988 123 456</strong> to activate your personal tier benefits today!</em></p>`,
    categoryId: "uu-dai",
    thumbnail: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
  },
];

export async function getPublishedPosts(): Promise<PostData[]> {
  const now = Date.now();
  if (cachedPosts && now - cachedPosts.time < CACHE_TTL_MS) {
    return cachedPosts.data;
  }
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });
    const dbPosts = posts.map(p => ({
      id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
      content: p.content ?? "", thumbnail: p.thumbnail ?? "",
      categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    }));

    if (dbPosts.length === 0) {
      cachedPosts = { data: DEFAULT_POSTS, time: now };
      return DEFAULT_POSTS;
    }

    const existingSlugs = new Set(dbPosts.map(p => p.slug));
    const merged = [
      ...dbPosts,
      ...DEFAULT_POSTS.filter(p => !existingSlugs.has(p.slug)),
    ];
    cachedPosts = { data: merged, time: now };
    return merged;
  } catch (error) {
    console.warn("Unable to fetch published posts from DB:", error);
    return cachedPosts?.data ?? DEFAULT_POSTS;
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const p = await prisma.post.findFirst({ where: { slug, status: "published" } });
    if (p) {
      return {
        id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "",
        content: p.content ?? "", thumbnail: p.thumbnail ?? "",
        categoryId: p.categoryId ?? "", status: p.status as "published" | "draft",
        createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.warn("Unable to fetch post by slug from DB:", error);
  }

  const fallback = DEFAULT_POSTS.find(p => p.slug === slug && p.status === "published");
  return fallback ?? null;
}

export async function createPost(data: Omit<PostData, "id" | "createdAt" | "updatedAt">): Promise<PostData> {
  cachedPosts = null;
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
    cachedPosts = null;
    await prisma.post.update({ where: { id }, data });
    return true;
  } catch { return false; }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    cachedPosts = null;
    await prisma.post.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ── Settings ─────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - cachedSettings.time < CACHE_TTL_MS) {
    return cachedSettings.data;
  }

  let rows: { key: string; value: string }[] = [];

  try {
    rows = await prisma.setting.findMany();
  } catch (error) {
    console.warn("Unable to fetch settings from DB, using fallback:", error);
    if (cachedSettings) return cachedSettings.data;
    return DEFAULT_SETTINGS;
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
      if (typeof defaultVal === "boolean") {
        (settings as Record<string, unknown>)[key] = value === "true" || value === "1" || (value as unknown) === true;
      } else if (Array.isArray(defaultVal)) {
        (settings as Record<string, unknown>)[key] = parseJSON(value, defaultVal);
      } else {
        (settings as Record<string, unknown>)[key] = value;
      }
    }
  }

  if (!settings.phone) {
    settings.phone = settings.hotline;
  }

  cachedSettings = { data: settings, time: now };
  return settings;
}

export async function saveSettings(data: Partial<SiteSettings>): Promise<void> {
  cachedSettings = null;
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
  const now = Date.now();
  if (cachedTeam && now - cachedTeam.time < CACHE_TTL_MS) {
    return cachedTeam.data;
  }
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
    const result = members.map(m => ({
      id: m.id, name: m.name, role: m.role,
      image: m.image ?? "", bio: m.bio ?? "",
      order: m.order, isActive: m.isActive,
    }));
    cachedTeam = { data: result, time: now };
    return result;
  } catch (error) {
    console.warn("Unable to fetch team members from DB:", error);
    return cachedTeam?.data ?? [];
  }
}

export async function createTeamMember(data: Omit<TeamMemberData, "id">): Promise<TeamMemberData> {
  cachedTeam = null;
  const m = await prisma.teamMember.create({ data });
  return {
    id: m.id, name: m.name, role: m.role,
    image: m.image ?? "", bio: m.bio ?? "",
    order: m.order, isActive: m.isActive,
  };
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberData>): Promise<boolean> {
  try {
    cachedTeam = null;
    await prisma.teamMember.update({ where: { id }, data });
    return true;
  } catch { return false; }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    cachedTeam = null;
    await prisma.teamMember.delete({ where: { id } });
    return true;
  } catch { return false; }
}
