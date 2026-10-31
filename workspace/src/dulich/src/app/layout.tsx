import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const fontText = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nếp Journeys · Hành trình văn hóa và nghỉ dưỡng chậm Việt Nam",
  description:
    "Nếp kiến tạo những hành trình riêng tư, chậm rãi và giàu bản sắc qua ba miền Việt Nam.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: ["/favicon.svg"],
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
        className={`${fontDisplay.variable} ${fontText.variable} antialiased`}
        suppressHydrationWarning
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
