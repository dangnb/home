import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/presentation/components/layout/Header";
import { Footer } from "@/presentation/components/layout/Footer";
import { CartDrawer } from "@/presentation/components/layout/CartDrawer";
import { ToastContainer } from "@/presentation/components/ui/ToastContainer";
import { FloatingChat } from "@/presentation/components/ui/FloatingChat";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Webtaphoa.vn – Chuỗi Tạp Hóa Việt - Chuyên Sỉ Và Lẻ",
  description: "Với hơn 4816 cửa hàng tạp hóa trên địa bàn Thành phố Hồ Chí Minh, Webtaphoa.vn sẽ mang đến quý khách hàng những hàng hóa thiết yếu, phục vụ tốt nhất nhu cầu khách hàng với giá cả hợp lý nhất.",
  keywords: "tạp hóa, chuỗi tạp hóa việt, chuyên sỉ và lẻ, webtaphoa, thực phẩm, đặc sản vùng miền",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`scroll-smooth ${inter.variable}`}>
      <body suppressHydrationWarning className={`min-h-screen flex flex-col bg-[#f5f5f5] text-gray-900 antialiased ${inter.className}`}>
        <Header />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-5 space-y-6">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
        <FloatingChat />
      </body>
    </html>
  );
}
