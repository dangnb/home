// prisma/seed.ts – Seed data for Suli Salon (Nail Salon)
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Suli Salon database...");

  // ── 1. Admin User ──────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@duthuyensonghan.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashSync(adminPassword, 12),
      name: "Admin",
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${adminEmail} / ${adminPassword}`);

  // ── 2. Categories ─────────────────────────
  const categories = [
    { id: "manicure", label: "Manicure", slug: "manicure", description: "Classic and gel manicure services" },
    { id: "pedicure", label: "Pedicure", slug: "pedicure", description: "Relaxing pedicure treatments" },
    { id: "nail-art", label: "Nail Art", slug: "nail-art", description: "Custom nail art designs" },
    { id: "extensions", label: "Extensions", slug: "extensions", description: "Nail extensions and overlays" },
    { id: "care", label: "Nail Care", slug: "nail-care", description: "Nail repair and care treatments" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, description: cat.description },
      create: cat,
    });
  }
  console.log(`✅ Categories: ${categories.length} items`);

  // ── 3. Services ────────────────────────────
  const services = [
    {
      slug: "classic-manicure", name: "Classic Manicure", categoryId: "manicure",
      description: "A traditional manicure including nail shaping, cuticle care, hand massage, and polish application.",
      duration: 45, price: "490 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600",
    },
    {
      slug: "gel-manicure", name: "Gel Manicure", categoryId: "manicure",
      description: "Long-lasting gel polish manicure with UV curing. Lasts 2-3 weeks without chipping.",
      duration: 60, price: "790 CZK", promoPrice: "690 CZK",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600",
    },
    {
      slug: "luxury-pedicure", name: "Luxury Pedicure", categoryId: "pedicure",
      description: "Full pedicure with foot soak, exfoliation, massage, and gel polish application.",
      duration: 75, price: "890 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600",
    },
    {
      slug: "nail-art-design", name: "Nail Art Design", categoryId: "nail-art",
      description: "Custom hand-painted nail art designs. Price per nail for complex designs.",
      duration: 90, price: "1290 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600",
    },
    {
      slug: "acrylic-extensions", name: "Acrylic Extensions", categoryId: "extensions",
      description: "Full set of acrylic nail extensions with your choice of shape and length.",
      duration: 120, price: "1490 CZK", promoPrice: "1290 CZK",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600",
    },
    {
      slug: "gel-extensions", name: "Gel Extensions", categoryId: "extensions",
      description: "Lightweight gel extensions for a natural look. Includes shaping and gel polish.",
      duration: 100, price: "1390 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600",
    },
    {
      slug: "nail-repair", name: "Nail Repair", categoryId: "care",
      description: "Professional repair for broken or damaged nails.",
      duration: 30, price: "290 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600",
    },
    {
      slug: "express-manicure", name: "Express Manicure", categoryId: "manicure",
      description: "Quick manicure with nail shaping and polish. Perfect for busy days.",
      duration: 25, price: "350 CZK", promoPrice: null,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600",
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: { name: svc.name, categoryId: svc.categoryId, description: svc.description, duration: svc.duration, price: svc.price, promoPrice: svc.promoPrice, image: svc.image },
      create: { ...svc, gallery: "[]" },
    });
  }
  console.log(`✅ Services: ${services.length} items`);

  // ── 4. Price Lists ─────────────────────────
  const priceLists = [
    {
      category: "Manicure",
      items: [
        { name: "Express Manicure", duration: "25 min", price: "350 CZK" },
        { name: "Classic Manicure", duration: "45 min", price: "490 CZK" },
        { name: "Gel Manicure", duration: "60 min", price: "790 CZK" },
        { name: "Gel Removal + Manicure", duration: "75 min", price: "890 CZK" },
      ],
    },
    {
      category: "Pedicure",
      items: [
        { name: "Express Pedicure", duration: "30 min", price: "450 CZK" },
        { name: "Classic Pedicure", duration: "60 min", price: "690 CZK" },
        { name: "Luxury Pedicure", duration: "75 min", price: "890 CZK" },
        { name: "Medical Pedicure", duration: "60 min", price: "790 CZK" },
      ],
    },
    {
      category: "Nail Art",
      items: [
        { name: "Simple Design (per nail)", duration: "5 min", price: "50 CZK" },
        { name: "Complex Design (per nail)", duration: "10 min", price: "100 CZK" },
        { name: "Full Set Nail Art", duration: "90 min", price: "1290 CZK" },
        { name: "Stamping Art", duration: "30 min", price: "390 CZK" },
      ],
    },
    {
      category: "Extensions",
      items: [
        { name: "Gel Extensions (Full Set)", duration: "100 min", price: "1390 CZK" },
        { name: "Acrylic Extensions (Full Set)", duration: "120 min", price: "1490 CZK" },
        { name: "Refill", duration: "60 min", price: "790 CZK" },
        { name: "Extension Removal", duration: "30 min", price: "350 CZK" },
      ],
    },
    {
      category: "Nail Care",
      items: [
        { name: "Nail Repair (per nail)", duration: "15 min", price: "150 CZK" },
        { name: "Cuticle Treatment", duration: "20 min", price: "250 CZK" },
        { name: "Paraffin Treatment", duration: "20 min", price: "290 CZK" },
        { name: "Gel Removal Only", duration: "20 min", price: "250 CZK" },
      ],
    },
  ];

  for (const [i, pl] of priceLists.entries()) {
    await prisma.priceList.upsert({
      where: { category: pl.category },
      update: { items: JSON.stringify(pl.items), order: i },
      create: { category: pl.category, items: JSON.stringify(pl.items), order: i },
    });
  }
  console.log(`✅ Price Lists: ${priceLists.length} categories`);

  // ── 5. Sample Appointment ──────────────────
  await prisma.appointment.create({
    data: {
      customerName: "Anna Novotná",
      phone: "+420 777 123 456",
      email: "anna@example.com",
      serviceName: "Gel Manicure",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      note: "Prefers nude/pink colors",
      status: "new",
    },
  });
  console.log("✅ Sample appointment created");

  // ── 6. Settings ────────────────────────────
  const settings: Record<string, string> = {
    siteName: "Suli Salon – Luxury Nail Gallery",
    tagline: "Premium Nail Care in Prague",
    hotline: "+420 123 456 789",
    email: "info@sulisalon.com",
    address: "Náměstí Míru 12, Prague 2, Czech Republic",
    workingHours: "Mon–Sat: 9:00–20:00, Sun: 10:00–18:00",
    facebook: "https://facebook.com/sulisalon",
    instagram: "https://instagram.com/sulisalon",
    seoTitle: "Suli Salon – Luxury Nail Gallery in Prague",
    seoDescription: "Premium nail care, gel manicures, nail art, and pedicures in Prague. Book your appointment today.",
    seoKeywords: "nail salon prague, gel nails, manicure, pedicure, nail art",
    copyright: "© 2025 Suli Salon – All rights reserved",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✅ Settings: ${Object.keys(settings).length} items`);

  // ── 7. Languages ──────────────────────────
  for (const lang of [
    { code: "en", name: "English", isDefault: true },
    { code: "cs", name: "Čeština", isDefault: false },
    { code: "vi", name: "Tiếng Việt", isDefault: false },
  ]) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: { ...lang, isActive: true },
    });
  }
  console.log("✅ Languages: 3 items");

  console.log("\n🎉 Seed complete!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
