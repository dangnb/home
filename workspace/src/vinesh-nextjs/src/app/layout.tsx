import type { Metadata } from "next";
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
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
