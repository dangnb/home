export const revalidate = 60;

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
            include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } }
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

    return (
        <main>
            <Header settings={settings} lang={lang} languages={activeLangs} menuCategories={menuCategories} />
            <Hero settings={settings} slides={dbSlides} lang={lang} />
            <AboutUs settings={settings} lang={lang} />
            <Services services={services} settings={settings} lang={lang} />
            <WhyChooseUs lang={lang} />
            <Partners lang={lang} />
            <Testimonials lang={lang} />
            <Footer settings={settings} lang={lang} />
        </main>
    );
}
