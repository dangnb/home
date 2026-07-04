import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "F8 - Học lập trình để đi làm",
  description: "F8 clone built with Next.js",
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
    <html lang="vi" className={`${beVietnamPro.variable}`}>
      <body className={beVietnamPro.className}>
        <Header />
        <div style={{ display: "flex", minHeight: "calc(100vh - var(--header-height))" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "20px 40px", maxWidth: "calc(100vw - var(--layout-sidebar-width))" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
