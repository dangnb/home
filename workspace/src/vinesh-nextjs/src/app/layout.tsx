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
    default: "WebCare | Giải pháp Doanh nghiệp Toàn diện & Bền vững",
    template: "%s | WebCare"
  },
  description: "Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu.",
  keywords: ["WebCare", "Giải pháp doanh nghiệp", "Dịch vụ kỹ thuật", "Tư vấn chuyên nghiệp", "Hỗ trợ 24/7"],
  authors: [{ name: "WebCare Team" }],
  openGraph: {
    title: "WebCare | Giải pháp Doanh nghiệp Toàn diện & Bền vững",
    description: "Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu.",
    url: 'https://home-theta-blue.vercel.app',
    siteName: 'WebCare',
    images: [
      {
        url: '/assets/hero.png', // Sử dụng ảnh hero làm ảnh share mặc định
        width: 1200,
        height: 630,
        alt: 'WebCare Dashboard',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebCare | Giải pháp Doanh nghiệp Toàn diện & Bền vững',
    description: "Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu.",
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
          color="#8cc63f"
          height={2}
          showSpinner={false}
          shadow="0 0 10px #8cc63f, 0 0 5px #8cc63f"
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
