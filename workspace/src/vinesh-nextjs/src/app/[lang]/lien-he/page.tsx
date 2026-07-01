export const revalidate = 60;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "vi" ? "Liên hệ" : "Contact";
  return {
    title: `${title} | Vinesh`,
    description: `Liên hệ với Vinesh ${lang.toUpperCase()}`,
  };
}

export async function generateStaticParams() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } });
  await prisma.$disconnect();

  const langs = activeLangs.length > 0 ? activeLangs.map(l => ({ lang: l.code })) : [{ lang: 'vi' }, { lang: 'en' }];
  return langs;
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const [activeLangs, menuCategories, settingsArray] = await Promise.all([
    prisma.language.findMany({ where: { isActive: true }, select: { code: true, name: true } }),
    prisma.category.findMany({
      where: { isActive: true, isMenu: true, parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: { where: { isActive: true }, orderBy: { order: 'asc' } },
        services: { orderBy: { order: 'asc' } }
      }
    }),
    prisma.setting.findMany()
  ]);

  const isSupported = activeLangs.some(l => l.code === lang);
  if (!isSupported) return notFound();

  const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
    acc[current.key] = current.value;
    return acc;
  }, {});

  const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;
  const title = fallback("Liên hệ với chúng tôi", "Contact Us");
  const homeText = fallback("Trang chủ", "Home");
  const contactText = fallback("Liên hệ", "Contact");

  const address = settings.address || "Khu Công nghiệp VSIP, Thuận An, Bình Dương";
  const phone = settings.phone || "0984 929 693";
  const email = settings.email || "info@vinesh.com.vn";
  
  // Default map to a central location if not provided
  const mapIframe = settings.mapIframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.427618995574!2d106.70295191533423!3d10.855047292268482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e1d5a7d5b1%3A0x6e9f9024f0e5b7b0!2sVSIP%20I!5e0!3m2!1sen!2svn!4v1622616854992!5m2!1sen!2svn";

  return (
    <main className="contact-page-wrapper">
      <Header settings={settings} lang={lang} languages={activeLangs} menuCategories={menuCategories} />

      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-breadcrumb">
            <Link href={`/${lang}`}>{homeText}</Link>
            <span>/</span>
            <span className="current">{contactText}</span>
          </div>
          <h1 className="contact-title">{title}</h1>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-info-cards">
          <div className="info-card">
            <div className="info-icon">
              <i className="ph-fill ph-map-pin"></i>
            </div>
            <div className="info-text">
              <h3>{fallback("Văn Phòng", "Office")}</h3>
              <p>{address}</p>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">
              <i className="ph-fill ph-phone"></i>
            </div>
            <div className="info-text">
              <h3>{fallback("Điện Thoại", "Phone")}</h3>
              <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-icon">
              <i className="ph-fill ph-envelope"></i>
            </div>
            <div className="info-text">
              <h3>Email</h3>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
        </div>

        <ContactForm lang={lang} />
      </section>

      <section className="map-section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div className="map-wrapper">
          {mapIframe.trim().startsWith("<iframe") ? (
             <div dangerouslySetInnerHTML={{ __html: mapIframe }} style={{ width: "100%", height: "100%" }}></div>
          ) : (
             <iframe src={mapIframe} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          )}
        </div>
      </section>

      <Footer settings={settings} lang={lang} />
    </main>
  );
}
