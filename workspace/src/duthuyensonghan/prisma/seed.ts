// prisma/seed.ts – Seed dữ liệu mẫu từ JSON files hiện tại
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function readJSON<T>(filename: string): T {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return [] as unknown as T;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function main() {
    console.log("🌱 Seeding database...");

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
    const categories = readJSON<{ id: string; label: string; slug: string; description: string }[]>("categories.json");
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { label: cat.label, description: cat.description },
            create: {
                id: cat.id,
                label: cat.label,
                slug: cat.slug,
                description: cat.description,
            },
        });
    }
    console.log(`✅ Categories: ${categories.length} items`);

    // ── 3. Cruises ────────────────────────────
    interface CruiseJSON {
        slug: string; name: string; categoryId: string; badge: string;
        tagline: string; originalPrice: string; salePrice: string;
        floors: number; capacity: number; mainImage: string;
        gallery: string[]; highlights: string[]; description: string;
        tours: { name: string; icon: string; schedule: string[] }[];
        includes: string[]; relatedSlugs: string[];
    }
    const cruises = readJSON<CruiseJSON[]>("cruises.json");
    for (let i = 0; i < cruises.length; i++) {
        const c = cruises[i];
        // Map old categoryId format to new category reference
        let categoryId = c.categoryId;
        const existingCat = await prisma.category.findFirst({
            where: { id: categoryId },
        });
        if (!existingCat) {
            // Try to find by matching slug pattern
            const catMap: Record<string, string> = {
                "regular": "regular",
                "dinner": "dinner",
                "vip": "vip",
            };
            const catSlug = catMap[categoryId];
            if (catSlug) {
                const cat = await prisma.category.findFirst({ where: { slug: { contains: catSlug } } });
                if (cat) categoryId = cat.id;
            }
        }

        await prisma.cruise.upsert({
            where: { slug: c.slug },
            update: {
                name: c.name,
                badge: c.badge,
                tagline: c.tagline,
                originalPrice: c.originalPrice,
                salePrice: c.salePrice,
                floors: c.floors,
                capacity: c.capacity,
                mainImage: c.mainImage,
                gallery: JSON.stringify(c.gallery),
                highlights: JSON.stringify(c.highlights),
                description: c.description,
                tours: JSON.stringify(c.tours),
                includes: JSON.stringify(c.includes),
                relatedSlugs: JSON.stringify(c.relatedSlugs),
                order: i,
            },
            create: {
                slug: c.slug,
                name: c.name,
                categoryId,
                badge: c.badge,
                tagline: c.tagline,
                originalPrice: c.originalPrice,
                salePrice: c.salePrice,
                floors: c.floors,
                capacity: c.capacity,
                mainImage: c.mainImage,
                gallery: JSON.stringify(c.gallery),
                highlights: JSON.stringify(c.highlights),
                description: c.description,
                tours: JSON.stringify(c.tours),
                includes: JSON.stringify(c.includes),
                relatedSlugs: JSON.stringify(c.relatedSlugs),
                order: i,
            },
        });
    }
    console.log(`✅ Cruises: ${cruises.length} items`);

    // ── 4. Posts ───────────────────────────────
    interface PostJSON {
        id: string; title: string; slug: string; excerpt: string;
        content: string; thumbnail: string; categoryId: string;
        status: string; createdAt: string; updatedAt: string;
    }
    const posts = readJSON<PostJSON[]>("posts.json");
    for (const p of posts) {
        await prisma.post.upsert({
            where: { slug: p.slug },
            update: {
                title: p.title,
                excerpt: p.excerpt,
                content: p.content,
                thumbnail: p.thumbnail,
                status: p.status,
            },
            create: {
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                thumbnail: p.thumbnail,
                status: p.status,
            },
        });
    }
    console.log(`✅ Posts: ${posts.length} items`);

    // ── 5. Pricing ────────────────────────────
    interface PriceItem { label: string; price: string; }
    interface PricingJSON {
        regularNote: string; regularPrices: PriceItem[];
        dinnerNote: string; dinnerPrices: PriceItem[];
        fireworksNote: string; fireworksPrices: PriceItem[];
    }

    try {
        const pricing = readJSON<PricingJSON>("pricing.json");
        await prisma.pricing.upsert({
            where: { key: "regular" },
            create: { key: "regular", note: pricing.regularNote, prices: JSON.stringify(pricing.regularPrices) },
            update: { note: pricing.regularNote, prices: JSON.stringify(pricing.regularPrices) },
        });
        await prisma.pricing.upsert({
            where: { key: "dinner" },
            create: { key: "dinner", note: pricing.dinnerNote, prices: JSON.stringify(pricing.dinnerPrices) },
            update: { note: pricing.dinnerNote, prices: JSON.stringify(pricing.dinnerPrices) },
        });
        await prisma.pricing.upsert({
            where: { key: "fireworks" },
            create: { key: "fireworks", note: pricing.fireworksNote, prices: JSON.stringify(pricing.fireworksPrices) },
            update: { note: pricing.fireworksNote, prices: JSON.stringify(pricing.fireworksPrices) },
        });
        console.log("✅ Pricing: 3 items");
    } catch (e) {
        console.log("⚠️ Pricing: skipped (file not found or invalid)", e);
    }

    // ── 6. Settings ─────────────────────────────
    try {
        const settings = readJSON<Record<string, unknown>>("settings.json");
        for (const [key, value] of Object.entries(settings)) {
            const strValue = typeof value === "string" ? value : JSON.stringify(value);
            await prisma.setting.upsert({
                where: { key },
                create: { key, value: strValue },
                update: { value: strValue },
            });
        }
        console.log(`✅ Settings: ${Object.keys(settings).length} items`);
    } catch (e) {
        console.log("⚠️ Settings: skipped", e);
    }

    // ── 7. Languages ─────────────────────────────
    await prisma.language.upsert({
        where: { code: "vi" },
        update: {},
        create: { code: "vi", name: "Tiếng Việt", isDefault: true, isActive: true },
    });
    await prisma.language.upsert({
        where: { code: "en" },
        update: {},
        create: { code: "en", name: "English", isDefault: false, isActive: true },
    });
    console.log("✅ Languages: 2 items (vi, en)");

    // ── 8. Bookings ─────────────────────────────
    try {
        interface BookingJSON {
            id: string; cruiseSlug: string; cruiseName: string; customerName: string;
            phone: string; email: string; date: string; time: string;
            guests: number; note: string; status: string; createdAt: string;
        }
        const bookings = readJSON<BookingJSON[]>("bookings.json");
        for (const b of bookings) {
            await prisma.booking.create({
                data: {
                    cruiseSlug: b.cruiseSlug,
                    cruiseName: b.cruiseName,
                    customerName: b.customerName,
                    phone: b.phone,
                    email: b.email,
                    date: b.date,
                    time: b.time,
                    guests: b.guests,
                    note: b.note,
                    status: b.status,
                },
            });
        }
        console.log(`✅ Bookings: ${bookings.length} items`);
    } catch (e) {
        console.log("⚠️ Bookings: skipped", e);
    }

    console.log("\n🎉 Seed complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
