import type { Metadata } from "next";
import { Be_Vietnam_Pro, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import BrandLoader from "@/components/BrandLoader";
import { LocaleProvider } from "@/components/LocaleProvider";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nếp Journeys — Chạm vào nếp sống Việt",
  description:
    "Nếp tạo nên những hành trình riêng tư, chậm rãi và giàu bản sắc tại Việt Nam.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} ${beVietnamPro.variable} antialiased`}
        suppressHydrationWarning
      >
        <BrandLoader />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
