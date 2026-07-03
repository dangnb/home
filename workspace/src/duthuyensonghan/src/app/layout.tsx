import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings, getCruises } from "@/lib/db";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

import NextTopLoader from "nextjs-toploader";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
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
      <body className={inter.className} suppressHydrationWarning>
        <NextTopLoader color="#01bf93" height={3} showSpinner={false} />
        <PublicShell settings={s} regularCruises={regularCruises} dinnerCruises={dinnerCruises}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
