import type { Metadata } from "next";
import { Montserrat, Marcellus, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], variable: "--font-montserrat" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${marcellus.variable} ${playfairDisplay.variable} font-sans bg-background text-on-background`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
