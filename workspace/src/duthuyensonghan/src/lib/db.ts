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
