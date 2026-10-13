import type { Metadata } from "next";
import { Montserrat, Marcellus, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings } from "@/lib/db";

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
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mocsalon.vn"),
    title: s.seoTitle,
    description: s.seoDescription,
    keywords: s.seoKeywords,
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://mocsalon.vn",
      siteName: s.siteName,
      locale: "vi_VN",
      type: "website",
    },
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
