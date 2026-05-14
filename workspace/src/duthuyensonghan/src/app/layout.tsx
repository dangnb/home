import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Du thuyền Sông Hàn – Đặt Vé Uy Tín, Giá Tốt",
  description: "Top Du thuyền Sông Hàn Đà Nẵng Đẹp - Ưu tiên view đẹp, trực tiếp đón và dẫn lên du thuyền. Đặt vé nhanh, an toàn.",
  keywords: "du thuyền sông hàn, du thuyen song han, vé du thuyền đà nẵng, ve du thuyen da nang",
  openGraph: {
    title: "Du thuyền Sông Hàn – Giữ Ghế View Đẹp",
    description: "Trực tiếp đón và dẫn lên du thuyền Đà Nẵng. Top Du thuyền Sông Hàn được đặt nhiều nhất.",
    url: "https://duthuyensonghan.vn",
    siteName: "Du Thuyền Sông Hàn",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
