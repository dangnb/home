/* cspell:disable */
import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Linh Ngọc Đường — Xưởng Chế Tác Vòng Tay Phong Thủy Đá Tự Nhiên 3D",
  description:
    "Xưởng chế tác vòng tay đá phong thủy tự nhiên nguyên khối 100%, kiểm định LIULAB & PNJ. Trải nghiệm xoay 3D WebGL thời gian thực, tra cứu Ngũ Hành Nạp Âm và đặt vòng theo chu vi cổ tay chuẩn cung Sinh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-theme="dark"
      className={`js ${cormorant.variable} ${beVietnamPro.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
