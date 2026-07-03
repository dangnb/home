import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/bold";
import ScrollToTop from "@/components/ui/ScrollToTop";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Giải pháp tổng thể An Toàn, Sức Khỏe & Môi Trường",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <NextTopLoader
          color="#3b82f6"
          height={2}
          showSpinner={false}
          shadow="0 0 10px #3b82f6, 0 0 5px #3b82f6"
          speed={300}
          crawlSpeed={250}
        />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
