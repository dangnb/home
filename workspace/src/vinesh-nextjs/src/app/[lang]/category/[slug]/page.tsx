import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const category = await prisma.category.findFirst({ where: { slug, isActive: true } });
    if (!category) return {};

    let title = category.slug.replace(/-/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1); // fallback

    if (category.translations) {
        try {
            const t = JSON.parse(category.translations);
            if (t[lang]?.title) title = t[lang].title;
            else if (t['vi']?.title) title = t['vi'].title;
        } catch (e) { }
    }

    return {
        title: `${title} | Vinesh`,
        description: `Danh mục ${title} - Cập nhật tất cả các thông tin và bài viết mới nhất tại Vinesh ${lang.toUpperCase()}.`,
        openGraph: {
            title: `${title} - Vinesh`,
            url: `/${lang}/category/${slug}`,
            type: 'website',
        }
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;

    const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true, name: true } });
    const isSupported = activeLangs.some(l => l.code === lang);
    if (!isSupported) return notFound();

    // Fetch the target category
    const category = await prisma.category.findFirst({
        where: { slug, isActive: true },
        include: { children: true }
    });

    if (!category) return notFound();

    // Determine category title based on lang
    let categoryTitle = category.slug;
    if (category.translations) {
        try {
            const t = JSON.parse(category.translations);
            if (t[lang]?.title) categoryTitle = t[lang].title;
            else if (t['vi']?.title) categoryTitle = t['vi'].title;
        } catch (e) { }
    }

    // Fetch services falling into this category or its children
    const childIds = category.children.map(c => c.id);
    const targetCategoryIds = [category.id, ...childIds];

    const services = await prisma.service.findMany({
        where: { categoryId: { in: targetCategoryIds } },
        include: { category: true },
        orderBy: { order: 'asc' }
    });

    // Root menu categories for Header
    const menuCategories = await prisma.category.findMany({
        where: { isActive: true, isMenu: true, parentId: null },
        orderBy: { order: 'asc' },
        include: {
            children: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
            }
        }
    });

    const settingsArray = await prisma.setting.findMany();
    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;

    return (
        <main>
            <Header settings={settings} lang={lang} languages={activeLangs} menuCategories={menuCategories} />

            {/* Minimal Inner Hero */}
            <div style={{ paddingTop: "180px", paddingBottom: "60px", paddingLeft: "20px", paddingRight: "20px", backgroundColor: "#0f172a", color: "#fff", textAlign: "center" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "15px", color: "#8cc63f", fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Link href={`/${lang}`} style={{ color: "#8cc63f", textDecoration: "none" }}>{fallback("Trang chủ", "Home")}</Link>
                        <span style={{ margin: "0 10px", color: "#475569" }}>/</span>
                        <span style={{ color: "#cbd5e1" }}>{categoryTitle}</span>
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", margin: "0", letterSpacing: "-0.5px" }}>{categoryTitle}</h1>
                </div>
            </div>

            {/* If no services configured yet, show a nice empty state */}
            {services.length === 0 ? (
                <div style={{ padding: "100px 20px", textAlign: "center", backgroundColor: "#f8fafc" }}>
                    <i className="ph-fill ph-package" style={{ fontSize: "64px", color: "#cbd5e1", marginBottom: "20px" }}></i>
                    <h3 style={{ fontSize: "1.5rem", color: "#334155", margin: "0 0 10px 0" }}>
                        {fallback("Chưa có nội dung cho danh mục này", "No content found for this category")}
                    </h3>
                    <p style={{ color: "#64748b", margin: 0 }}>
                        {fallback("Hệ thống sẽ sớm cập nhật thông tin tại khu vực này.", "System will update contents here soon.")}
                    </p>
                </div>
            ) : (
                <Services services={services} settings={settings} lang={lang} />
            )}

            <Footer settings={settings} lang={lang} />
        </main>
    );
}
