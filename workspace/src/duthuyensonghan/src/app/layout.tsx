import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings } from "@/lib/db";

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
  return (
    <html lang="vi">
      <body className={inter.className} suppressHydrationWarning>
        <PublicShell settings={s}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
