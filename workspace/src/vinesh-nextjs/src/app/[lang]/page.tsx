export const revalidate = 60;
import { Metadata } from 'next';

export async function generateStaticParams() {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } });
    await prisma.$disconnect();

    // Always include vi and en as fallbacks in case DB is empty
    const langs = activeLangs.length > 0 ? activeLangs.map(l => ({ lang: l.code })) : [{ lang: 'vi' }, { lang: 'en' }];
    return langs;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const settings = await prisma.setting.findMany();
    await prisma.$disconnect();

    // Transform setting array to flat object
    const siteSettings = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

    const title = siteSettings[`heroTitle_${lang}`] || siteSettings.heroTitle || "Tư vấn & Kiểm định An toàn Vinesh";
    const description = siteSettings[`heroDesc_${lang}`] || siteSettings.heroDesc || "Các giải pháp đo lường, kiểm định và huấn luyện an toàn, sức khỏe.";

    return {
        title,
        description,
        openGraph: { title, description },
    };
}
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import dynamic from 'next/dynamic';

const AboutUs = dynamic(() => import("@/components/AboutUs"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Partners = dynamic(() => import("@/components/Partners"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Footer = dynamic(() => import("@/components/Footer"));
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    const [activeLangs, services, menuCategories, settingsArray, dbSlides] = await Promise.all([
        prisma.language.findMany({ where: { isActive: true }, select: { code: true, name: true } }),
        prisma.service.findMany({ include: { category: true }, orderBy: { order: 'asc' } }),
        prisma.category.findMany({
            where: { isActive: true, isMenu: true, parentId: null },
            orderBy: { order: 'asc' },
            include: {
                children: { where: { isActive: true }, orderBy: { order: 'asc' } },
                services: { orderBy: { order: 'asc' } }
            }
        }),
        prisma.setting.findMany(),
        prisma.slide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
    ]);

    const isSupported = activeLangs.some(l => l.code === lang);
    if (!isSupported) return notFound();

    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Vinesh",
        "image": "https://home-theta-blue.vercel.app/assets/hero.png",
        "telephone": settings.phone || "0984 929 693",
        "email": settings.email || "info@vinesh.com.vn",
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
            <Header settings={settings} lang={lang} languages={activeLangs} menuCategories={menuCategories} />
            <Hero settings={settings} slides={dbSlides} lang={lang} />
            <AboutUs settings={settings} lang={lang} />
            <Services services={services} settings={settings} lang={lang} />
            <WhyChooseUs lang={lang} />
            <Partners lang={lang} settings={settings} />
            <Testimonials lang={lang} settings={settings} />
            <Footer settings={settings} lang={lang} />
        </main>
    );
}
