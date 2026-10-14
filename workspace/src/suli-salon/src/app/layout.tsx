import type { Metadata } from "next";
import { Montserrat, Marcellus, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings } from "@/lib/db";
import { createBeautySalonJsonLd, getSiteUrl, serializeJsonLd } from "@/lib/seo";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], variable: "--font-montserrat" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

import NextTopLoader from "nextjs-toploader";
import Preloader from "@/components/Preloader";

export const revalidate = 300; // Khách xem web sẽ tải bản cache tĩnh (siêu nhanh), định kỳ 5 phút (300s) tự động update ngầm dữ liệu mới nhất từ Admin

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = getSiteUrl();
  const socialImage = settings.bannerImage
    ? [{ url: settings.bannerImage, alt: `Không gian và dịch vụ tại ${settings.siteName}` }]
    : undefined;
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(siteUrl),
    title: settings.seoTitle || settings.siteName,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: settings.seoTitle || settings.siteName,
      description: settings.seoDescription,
      url: siteUrl,
      siteName: settings.siteName,
      locale: "vi_VN",
      type: "website",
      images: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle || settings.siteName,
      description: settings.seoDescription,
      images: socialImage,
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const s = await getSettings();

  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${marcellus.variable} ${playfairDisplay.variable} font-sans bg-background text-on-background`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(createBeautySalonJsonLd(s)) }}
        />
        <NextTopLoader color="var(--primary)" height={3} showSpinner={false} />
        <Preloader>
          <PublicShell settings={s}>
            {children}
          </PublicShell>
        </Preloader>
      </body>
    </html>
  );
}
