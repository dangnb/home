import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings, getCruises } from "@/lib/db";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: "--font-playfair" });

import NextTopLoader from "nextjs-toploader";

export const revalidate = 300; // Khách xem web sẽ tải bản cache tĩnh (siêu nhanh), định kỳ 5 phút (300s) tự động update ngầm dữ liệu mới nhất từ Admin

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL("https://duthuyensonghan.vn"),
    title: s.seoTitle,
    description: s.seoDescription,
    keywords: s.seoKeywords,
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: "https://duthuyensonghan.vn",
      siteName: s.siteName,
      locale: "vi_VN",
      type: "website",
    },
    icons: {
      icon: "https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png",
      apple: "https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const s = await getSettings();
  const allCruises = await getCruises();
  const regularCruises = allCruises.filter(c => c.categoryId === "regular" || c.categoryId.includes("khong-an"));
  const dinnerCruises = allCruises.filter(c => c.categoryId === "dinner" || c.categoryId === "vip" || c.categoryId.includes("nha-hang"));

  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
        <NextTopLoader color="#01bf93" height={3} showSpinner={false} />
        <PublicShell settings={s} regularCruises={regularCruises} dinnerCruises={dinnerCruises}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
