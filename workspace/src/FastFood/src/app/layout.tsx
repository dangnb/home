import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TriKun FastFood - Thức Ăn Nhanh & Đồ Uống Ngon Nóng Hổi",
  description: "Đặt món ăn nhanh trực tuyến tại TriKun FastFood: Gà rán, Burger, Mì Ý, Tiramisu, Trà sữa trân châu, Combo hot. Giao hàng tận nơi 15 phút!",
  keywords: ["FastFood", "Gà rán", "Burger", "TriKun", "Đặt đồ ăn online", "Mì Ý", "Nước uống"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
