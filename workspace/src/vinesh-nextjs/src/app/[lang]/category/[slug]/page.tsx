export const revalidate = 60;

import Services, { ServiceWithCategory } from "@/components/Services";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from 'next';

const defaultCategories = [
    {
        id: "cat-about",
        slug: "ve-webcare",
        titleVi: "Về WebCare",
        titleEn: "About WebCare",
        children: [
            { id: "cat-about-1", slug: "gioi-thieu-chung", titleVi: "Giới thiệu chung", titleEn: "General Overview" },
            { id: "cat-about-2", slug: "tam-nhin-su-menh", titleVi: "Tầm nhìn & Sứ mệnh", titleEn: "Vision & Mission" }
        ]
    },
    {
        id: "cat-inspection",
        slug: "kiem-dinh-an-toan",
        titleVi: "Kiểm định an toàn",
        titleEn: "Safety Inspection",
        children: [
            { id: "cat-insp-1", slug: "thiet-bi-ap-luc", titleVi: "Nồi hơi & Thiết bị áp lực", titleEn: "Boilers & Pressure Vessels" },
            { id: "cat-insp-2", slug: "thiet-bi-nang", titleVi: "Thiết bị nâng hạ & Xe nâng", titleEn: "Lifting Gear & Forklifts" }
        ]
    },
    {
        id: "cat-environment",
        slug: "quan-trac-moi-truong",
        titleVi: "Quan trắc môi trường",
        titleEn: "Environmental Monitoring",
        children: [
            { id: "cat-env-1", slug: "moi-truong-lao-dong", titleVi: "Môi trường lao động", titleEn: "Workplace Environment" },
            { id: "cat-env-2", slug: "khi-thai-nuoc-thai", titleVi: "Khí thải & Nước thải", titleEn: "Emission & Wastewater" }
        ]
    },
    {
        id: "cat-certification",
        slug: "chung-nhan-he-thong",
        titleVi: "Chứng nhận hệ thống",
        titleEn: "System Certification",
        children: [
            { id: "cat-cert-1", slug: "chung-nhan-iso", titleVi: "Chứng nhận ISO 9001 / 14001 / 45001", titleEn: "ISO 9001 / 14001 / 45001" }
        ]
    },
    {
        id: "cat-training",
        slug: "dao-tao-huan-luyen",
        titleVi: "Huấn luyện an toàn",
        titleEn: "Safety Training",
        children: [
            { id: "cat-train-1", slug: "an-toan-lao-dong", titleVi: "Huấn luyện Nhóm 1 - 6", titleEn: "Groups 1 - 6 Training" }
        ]
    }
];

export async function generateStaticParams() {
    const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } }).catch(() => []);
    const categories = await prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }).catch(() => []);

    const langs = activeLangs.length > 0 ? activeLangs.map(l => l.code) : ['vi', 'en'];
    const defaultSlugs = defaultCategories.flatMap(c => [c.slug, ...c.children.map(ch => ch.slug)]);
    const slugs = Array.from(new Set([...categories.map(c => c.slug), ...defaultSlugs]));

    const params: { lang: string, slug: string }[] = [];
    for (const lang of langs) {
        for (const slug of slugs) {
            params.push({ lang, slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
    const { lang, slug } = await params;
    const category = await prisma.category.findFirst({ where: { slug, isActive: true } }).catch(() => null);

    let title = slug.replace(/-/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (category && category.translations) {
        try {
            const t = JSON.parse(category.translations);
            if (t[lang]?.title) title = t[lang].title;
            else if (t['vi']?.title) title = t['vi'].title;
        } catch (_e) { }
    } else {
        const found = defaultCategories.find(c => c.slug === slug) ||
            defaultCategories.flatMap(c => c.children).find(ch => ch.slug === slug);
        if (found) {
            title = lang === 'vi' ? found.titleVi : found.titleEn;
        }
    }

    return {
        title: `${title} | WebCare`,
        description: `Danh mục ${title} - Cập nhật tất cả các thông tin và dịch vụ mới nhất tại WebCare ${lang.toUpperCase()}.`,
        openGraph: {
            title: `${title} - WebCare`,
            url: `/${lang}/category/${slug}`,
            type: 'website',
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;

    // Fetch the target category with defensive catch
    let category = await prisma.category.findFirst({
        where: { slug, isActive: true },
        include: { children: true }
    }).catch(() => null);

    // If not found in DB, resolve from default categories
    if (!category) {
        const found = defaultCategories.find(c => c.slug === slug) ||
            defaultCategories.find(c => c.children.some(ch => ch.slug === slug));

        if (found) {
            category = {
                id: found.id,
                slug: found.slug,
                translations: JSON.stringify({
                    vi: { title: found.titleVi },
                    en: { title: found.titleEn }
                }),
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                children: found.children.map(ch => ({
                    id: ch.id,
                    slug: ch.slug,
                    translations: JSON.stringify({
                        vi: { title: ch.titleVi },
                        en: { title: ch.titleEn }
                    }),
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: found.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }))
            };
        }
    }

    // Determine category title based on lang
    let categoryTitle = slug.replace(/-/g, ' ');
    categoryTitle = categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1);

    if (category && category.translations) {
        try {
            const t = JSON.parse(category.translations);
            if (t[lang]?.title) categoryTitle = t[lang].title;
            else if (t['vi']?.title) categoryTitle = t['vi'].title;
        } catch (_e) { }
    }

    // Fetch services falling into this category or its children
    const childIds = category ? category.children.map(c => c.id) : [];
    const targetCategoryIds = category ? [category.id, ...childIds] : [];

    const [dbServices, settingsArray] = await Promise.all([
        targetCategoryIds.length > 0
            ? prisma.service.findMany({
                where: { categoryId: { in: targetCategoryIds } },
                include: { category: true },
                orderBy: { order: 'asc' }
            }).catch(() => [])
            : Promise.resolve([]),
        prisma.setting.findMany({ select: { key: true, value: true } }).catch(() => [])
    ]);

    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;

    // Fallback services for category if DB is empty
    const fallbackCategoryServices: ServiceWithCategory[] = [
        {
            id: `cat-svc-1-${slug}`,
            title: fallback(`Quy trình tiêu chuẩn ${categoryTitle}`, `Standard Procedures for ${categoryTitle}`),
            description: fallback(
                `Dịch vụ chuyên nghiệp hàng đầu, áp dụng đầy đủ quy chuẩn kỹ thuật quốc gia và chứng nhận chất lượng nghiêm ngặt.`,
                `Top professional service adhering to national technical safety standards and strict regulatory compliance.`
            ),
            imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
            linkUrl: "#",
            order: 1,
            categoryId: category?.id || slug,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: category ? {
                id: category.id,
                slug: category.slug,
                translations: category.translations,
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            } : null,
            translations: JSON.stringify({
                vi: {
                    title: `Quy trình tiêu chuẩn ${categoryTitle}`,
                    description: `Dịch vụ chuyên nghiệp hàng đầu, áp dụng đầy đủ quy chuẩn kỹ thuật quốc gia và chứng nhận chất lượng nghiêm ngặt.`
                },
                en: {
                    title: `Standard Procedures for ${categoryTitle}`,
                    description: `Top professional service adhering to national technical safety standards and strict regulatory compliance.`
                }
            })
        },
        {
            id: `cat-svc-2-${slug}`,
            title: fallback(`Tư vấn & Thẩm định kỹ thuật ${categoryTitle}`, `Consulting & Technical Audit for ${categoryTitle}`),
            description: fallback(
                `Khảo sát hiện trường, đánh giá rủi ro và cung cấp giải pháp tối ưu cho doanh nghiệp với độ chính xác cao.`,
                `On-site survey, risk assessment, and optimal solutions tailored for enterprises with high accuracy.`
            ),
            imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
            linkUrl: "#",
            order: 2,
            categoryId: category?.id || slug,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: category ? {
                id: category.id,
                slug: category.slug,
                translations: category.translations,
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            } : null,
            translations: JSON.stringify({
                vi: {
                    title: `Tư vấn & Thẩm định kỹ thuật ${categoryTitle}`,
                    description: `Khảo sát hiện trường, đánh giá rủi ro và cung cấp giải pháp tối ưu cho doanh nghiệp với độ chính xác cao.`
                },
                en: {
                    title: `Consulting & Technical Audit for ${categoryTitle}`,
                    description: `On-site survey, risk assessment, and optimal solutions tailored for enterprises with high accuracy.`
                }
            })
        },
        {
            id: `cat-svc-3-${slug}`,
            title: fallback(`Cấp chứng nhận & Báo cáo kết quả ${categoryTitle}`, `Certification & Final Reports for ${categoryTitle}`),
            description: fallback(
                `Hồ sơ báo cáo pháp lý đầy đủ, minh bạch, được cơ quan nhà nước và các tổ chức quốc tế công nhận.`,
                `Full legal documentation and transparent reporting recognized by regulatory authorities and international organizations.`
            ),
            imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
            linkUrl: "#",
            order: 3,
            categoryId: category?.id || slug,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: category ? {
                id: category.id,
                slug: category.slug,
                translations: category.translations,
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            } : null,
            translations: JSON.stringify({
                vi: {
                    title: `Cấp chứng nhận & Báo cáo kết quả ${categoryTitle}`,
                    description: `Hồ sơ báo cáo pháp lý đầy đủ, minh bạch, được cơ quan nhà nước và các tổ chức quốc tế công nhận.`
                },
                en: {
                    title: `Certification & Final Reports for ${categoryTitle}`,
                    description: `Full legal documentation and transparent reporting recognized by regulatory authorities and international organizations.`
                }
            })
        }
    ];

    const sanitizedDbServices = dbServices.map(svc => ({
        ...svc,
        imageUrl: svc.imageUrl?.includes("photo-1504917599217")
            ? "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop"
            : svc.imageUrl
    }));

    const finalServices = (sanitizedDbServices && sanitizedDbServices.length > 0) ? sanitizedDbServices : fallbackCategoryServices;

    return (
        <main>
            {/* Minimal Inner Hero */}
            <div style={{
                paddingTop: "170px",
                paddingBottom: "85px",
                paddingLeft: "20px",
                paddingRight: "20px",
                background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat",
                color: "#fff",
                textAlign: "center"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.14)", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "6px 18px", borderRadius: "9999px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <Link href={`/${lang}`} style={{ color: "#34d399", textDecoration: "none" }}>{fallback("Trang chủ", "Home")}</Link>
                        <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>/</span>
                        <span style={{ color: "#ffffff" }}>{categoryTitle}</span>
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "900", margin: "0", letterSpacing: "-0.02em", textShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>{categoryTitle}</h1>
                </div>
            </div>

            <Services services={finalServices} settings={settings} lang={lang} />
        </main>
    );
}
