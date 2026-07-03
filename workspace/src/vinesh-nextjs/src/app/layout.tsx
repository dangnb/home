import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/bold";
import ScrollToTop from "@/components/ui/ScrollToTop";
import NextTopLoader from 'nextjs-toploader';
import AosInitializer from "@/components/ui/AosInitializer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://home-theta-blue.vercel.app'),
  title: {
    default: "Vinesh | Giải pháp An Toàn, Sức Khỏe & Môi Trường",
    template: "%s | Vinesh"
  },
  description: "Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện hàng đầu.",
  keywords: ["Vinesh", "Kiểm định", "Chứng nhận", "Huấn luyện an toàn", "Quan trắc môi trường", "HSE", "An toàn lao động"],
  authors: [{ name: "Vinesh Team" }],
  openGraph: {
    title: "Vinesh | Giải pháp An Toàn, Sức Khỏe & Môi Trường",
    description: "Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.",
    url: 'https://home-theta-blue.vercel.app',
    siteName: 'Vinesh',
    images: [
      {
        url: '/assets/hero.png', // Sử dụng ảnh hero làm ảnh share mặc định
        width: 1200,
        height: 630,
        alt: 'Vinesh Dashboard',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinesh | Giải pháp An Toàn, Sức Khỏe & Môi Trường',
    description: 'Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.',
    images: ['/assets/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
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
        <AosInitializer />
        <ScrollToTop />
      </body>
    </html>
  );
}
