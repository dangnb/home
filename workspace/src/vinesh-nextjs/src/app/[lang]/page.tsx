export const revalidate = 60;
import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import TrustStats from "@/components/TrustStats";
import Services from "@/components/Services";
import AboutUs from "@/components/AboutUs";
import WhyChooseUs from "@/components/WhyChooseUs";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";

export async function generateStaticParams() {
    const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } }).catch(() => []);

    // Always include vi and en as fallbacks in case DB is empty
    const langs = activeLangs.length > 0 ? activeLangs.map(l => ({ lang: l.code })) : [{ lang: 'vi' }, { lang: 'en' }];
    return langs;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const settings = await prisma.setting.findMany({ select: { key: true, value: true } }).catch(() => []);

    // Transform setting array to flat object
    const siteSettings = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

    const isVi = lang === "vi";
    const title = isVi
        ? (siteSettings.heroTitle || "Giải Pháp Chăm Sóc & Vận Hành Doanh Nghiệp | WebCare")
        : (siteSettings[`heroTitle_${lang}`] || "Enterprise Care & Operation Solutions | WebCare");
    const description = isVi
        ? (siteSettings.heroDesc || "Các giải pháp tư vấn toàn diện, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp cho doanh nghiệp.")
        : (siteSettings[`heroDesc_${lang}`] || "Comprehensive consulting solutions, technical services, and professional support for enterprises.");

    return {
        title,
        description,
        openGraph: { title, description },
    };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    const [rawServices, settingsArray, dbSlides] = await Promise.all([
        prisma.service.findMany({ include: { category: true }, orderBy: { order: 'asc' } }).catch(() => []),
        prisma.setting.findMany({ select: { key: true, value: true } }).catch(() => []),
        prisma.slide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }).catch(() => [])
    ]);

    // Sanitize any broken image URLs and auto-repair legacy DB records
    const services = rawServices.map(svc => ({
        ...svc,
        imageUrl: svc.imageUrl?.includes("photo-1504917599217")
            ? "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop"
            : svc.imageUrl
    }));

    if (rawServices.some(s => s.imageUrl?.includes("photo-1504917599217"))) {
        prisma.service.updateMany({
            where: { imageUrl: { contains: "photo-1504917599217" } },
            data: { imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop" }
        }).catch(() => {});
    }

    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": settings.siteName || "WebCare",
        "image": "https://home-theta-blue.vercel.app/assets/hero.png",
        "telephone": settings.phone || "0984 929 693",
        "email": settings.email || "info@webcare.vn",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": settings.address || "Khu Công nghiệp VSIP",
            "addressLocality": "Bình Dương",
            "addressCountry": "VN"
        },
        "url": "https://home-theta-blue.vercel.app"
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero settings={settings} slides={dbSlides} lang={lang} />
            <TrustStats lang={lang} />
            <AboutUs settings={settings} lang={lang} />
            <Services services={services} settings={settings} lang={lang} />
            <WhyChooseUs lang={lang} />
            <Partners lang={lang} settings={settings} />
            <Testimonials lang={lang} settings={settings} />
        </main>
    );
}
