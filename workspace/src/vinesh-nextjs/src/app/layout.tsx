import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
export const metadata: Metadata = {
  title: "Trang chủ - VINESH Next.js Clone",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Script src="https://unpkg.com/@phosphor-icons/web" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
