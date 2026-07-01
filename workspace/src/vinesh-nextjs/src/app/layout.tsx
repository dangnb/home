import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <Script src="https://unpkg.com/@phosphor-icons/web" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <NextTopLoader color="#f39c12" height={3} showSpinner={true} />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
