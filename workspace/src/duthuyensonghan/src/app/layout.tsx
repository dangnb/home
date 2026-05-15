import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings, getCruises } from "@/lib/db";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings();
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const s = getSettings();
  const allCruises = getCruises();
  const regularCruises = allCruises.filter(c => c.categoryId === "regular");
  const dinnerCruises = allCruises.filter(c => c.categoryId === "dinner" || c.categoryId === "vip");
  return (
    <html lang="vi">
      <body className={inter.className} suppressHydrationWarning>
        <PublicShell settings={s} regularCruises={regularCruises} dinnerCruises={dinnerCruises}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
