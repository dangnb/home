import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJSON(filename: string, data: unknown): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Categories ──────────────────────────────────────
export interface Category {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export function getCategories(): Category[] {
  return readJSON<Category[]>("categories.json");
}

export function saveCategories(data: Category[]): void {
  writeJSON("categories.json", data);
}

// ── Cruises ─────────────────────────────────────────
export interface Tour {
  name: string;
  icon: string;
  schedule: string[];
}

export interface Cruise {
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
}

export function getCruises(): Cruise[] {
  return readJSON<Cruise[]>("cruises.json");
}

export function getCruiseBySlug(slug: string): Cruise | undefined {
  return getCruises().find((c) => c.slug === slug);
}

export function saveCruises(data: Cruise[]): void {
  writeJSON("cruises.json", data);
}

export function createCruise(cruise: Cruise): void {
  const all = getCruises();
  all.push(cruise);
  saveCruises(all);
}

export function updateCruise(slug: string, update: Partial<Cruise>): boolean {
  const all = getCruises();
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...update };
  saveCruises(all);
  return true;
}

export function deleteCruise(slug: string): boolean {
  const all = getCruises();
  const filtered = all.filter((c) => c.slug !== slug);
  if (filtered.length === all.length) return false;
  saveCruises(filtered);
  return true;
}

// ── Pricing ─────────────────────────────────────────
export interface PriceItem {
  label: string;
  price: string;
}

export interface Pricing {
  regularNote: string;
  regularPrices: PriceItem[];
  dinnerNote: string;
  dinnerPrices: PriceItem[];
  fireworksNote: string;
  fireworksPrices: PriceItem[];
}

export function getPricing(): Pricing {
  return readJSON<Pricing>("pricing.json");
}

export function savePricing(data: Pricing): void {
  writeJSON("pricing.json", data);
}

// ── Bookings ─────────────────────────────────────────
export type BookingStatus = "new" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  cruiseSlug: string;
  cruiseName: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;        // ISO date string YYYY-MM-DD
  time: string;        // e.g. "17:30"
  guests: number;
  note: string;
  status: BookingStatus;
  createdAt: string;   // ISO datetime
}

export function getBookings(): Booking[] {
  return readJSON<Booking[]>("bookings.json");
}

export function saveBookings(data: Booking[]): void {
  writeJSON("bookings.json", data);
}

export function createBooking(booking: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const all = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `BK${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  all.unshift(newBooking); // newest first
  saveBookings(all);
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): boolean {
  const all = getBookings();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return false;
  all[idx].status = status;
  saveBookings(all);
  return true;
}

export function deleteBooking(id: string): boolean {
  const all = getBookings();
  const filtered = all.filter(b => b.id !== id);
  if (filtered.length === all.length) return false;
  saveBookings(filtered);
  return true;
}

// ── Posts ─────────────────────────────────────────
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;        // short description
  content: string;        // HTML from rich editor
  thumbnail: string;      // image URL
  categoryId: string;     // e.g. "tin-tuc", "kinh-nghiem", "gia-ve"
  status: "published" | "draft";
  createdAt: string;      // ISO datetime
  updatedAt: string;
}

export function getPosts(): Post[] {
  return readJSON<Post[]>("posts.json");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function savePosts(data: Post[]): void {
  writeJSON("posts.json", data);
}

export function createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Post {
  const all = getPosts();
  const now = new Date().toISOString();
  const newPost: Post = {
    ...post,
    id: `POST${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(newPost);
  savePosts(all);
  return newPost;
}

export function updatePost(id: string, update: Partial<Omit<Post, "id" | "createdAt">>): boolean {
  const all = getPosts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...update, updatedAt: new Date().toISOString() };
  savePosts(all);
  return true;
}

export function deletePost(id: string): boolean {
  const all = getPosts();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  savePosts(filtered);
  return true;
}

// ── Site Settings ─────────────────────────────────────
export interface SiteSettings {
  // Thông tin liên hệ
  siteName: string;
  tagline: string;
  hotline: string;
  hotline2: string;
  email: string;
  address: string;
  workingHours: string;

  // Mạng xã hội
  facebook: string;
  tiktok: string;
  youtube: string;
  zalo: string;
  instagram: string;

  // Bản đồ
  mapEmbedUrl: string;
  mapLat: string;
  mapLng: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;

  // Nội dung footer
  footerTaglines: string[];
  copyright: string;

  // Giờ xuất bến
  departureSlots: string[];

  // Banner trang chủ
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
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0!2d108.2270!3d16.0600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142195d3a6e8c0f%3A0x2d0d6e31f24c8b4!2zRHUgdGh1eeG7gW4gU8O0bmcgSMOgbg!5e0!3m2!1svi!2svn!4v1234567890",
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
    { value: "10+",   label: "Du Thuyền" },
    { value: "1000+", label: "Đánh Giá 5★" },
    { value: "24/7",  label: "Hỗ Trợ" },
    { value: "0đ",    label: "Phí Giữ Chỗ" },
  ],
};

export function getSettings(): SiteSettings {
  const filePath = path.join(DATA_DIR, "settings.json");
  if (!fs.existsSync(filePath)) return DEFAULT_SETTINGS;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(data: Partial<SiteSettings>): void {
  const current = getSettings();
  writeJSON("settings.json", { ...current, ...data });
}
