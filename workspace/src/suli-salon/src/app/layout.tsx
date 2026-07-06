import type { Metadata } from "next";
import { Montserrat, Marcellus } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getSettings, getCruises } from "@/lib/db";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], variable: '--font-montserrat' });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: '--font-marcellus' });

import NextTopLoader from "nextjs-toploader";
import Preloader from "@/components/Preloader";

export const revalidate = 300; // Khách xem web sẽ tải bản cache tĩnh (siêu nhanh), định kỳ 5 phút (300s) tự động update ngầm dữ liệu mới nhất từ Admin

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL("https://duthuyensonghan.vn"),
    title: s.seoTitle,
    description: s.seoDescription,
    keywords: s.seoKeywords,
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: "https://duthuyensonghan.vn",
      siteName: s.siteName,
      locale: "vi_VN",
      type: "website",
    },
    icons: {
      icon: "https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png",
      apple: "https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const s = await getSettings();
  const allCruises = await getCruises();
  const regularCruises = allCruises.filter(c => c.categoryId === "regular" || c.categoryId.includes("khong-an"));
  const dinnerCruises = allCruises.filter(c => c.categoryId === "dinner" || c.categoryId === "vip" || c.categoryId.includes("nha-hang"));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" async></script>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
          tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-primary-fixed-variant": "#574500",
                        "tertiary-fixed": "#dbe1ff",
                        "surface": "#f9f9f9",
                        "primary-fixed-dim": "#e9c349",
                        "on-error": "#ffffff",
                        "on-primary": "#ffffff",
                        "surface-container-high": "#e8e8e8",
                        "surface-container-highest": "#e2e2e2",
                        "surface-container": "#eeeeee",
                        "primary": "#735c00",
                        "surface-bright": "#f9f9f9",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5e",
                        "inverse-on-surface": "#f0f1f1",
                        "background": "#f9f9f9",
                        "on-background": "#1a1c1c",
                        "secondary-fixed": "#e5e2e1",
                        "on-primary-fixed": "#241a00",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474746",
                        "secondary-container": "#e2dfde",
                        "primary-fixed": "#ffe088",
                        "tertiary-container": "#97b0ff",
                        "on-surface-variant": "#4d4635",
                        "on-error-container": "#93000a",
                        "secondary-fixed-dim": "#c8c6c5",
                        "outline": "#7f7663",
                        "on-secondary-fixed": "#1c1b1b",
                        "inverse-primary": "#e9c349",
                        "surface-container-low": "#f3f3f3",
                        "on-primary-container": "#554300",
                        "outline-variant": "#d0c5af",
                        "surface-tint": "#735c00",
                        "on-tertiary-fixed": "#00174b",
                        "on-tertiary-container": "#254188",
                        "warm-sand": "#F4F1EA",
                        "inverse-surface": "#2f3131",
                        "tertiary": "#415ba4",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "primary-container": "#d4af37",
                        "tertiary-fixed-dim": "#b4c5ff",
                        "surface-dim": "#dadada",
                        "on-tertiary-fixed-variant": "#27438a",
                        "on-secondary-container": "#636262",
                        "error": "#ba1a1a",
                        "subtle-gray": "#4A4A4A",
                        "error-container": "#ffdad6"
                    },
                    borderRadius: {
                        DEFAULT: "0.125rem",
                        lg: "0.25rem",
                        xl: "0.5rem",
                        full: "0.75rem"
                    },
                    spacing: {
                        gutter: "24px",
                        "margin-desktop": "64px",
                        unit: "8px",
                        "margin-mobile": "16px",
                        "container-max": "1280px"
                    },
                    fontFamily: {
                        "label-caps": ["Montserrat"],
                        "button-text": ["Montserrat"],
                        "headline-md": ["Playfair Display"],
                        "display-lg-mobile": ["Playfair Display"],
                        "body-md": ["Montserrat"],
                        "headline-sm": ["Playfair Display"],
                        "display-lg": ["Playfair Display"],
                        "body-lg": ["Montserrat"]
                    },
                    fontSize: {
                        "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "600"}],
                        "button-text": ["14px", {"lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
                        "display-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
                        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "headline-sm": ["24px", {"lineHeight": "1.4", "fontWeight": "600"}],
                        "display-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}]
                    }
                }
            }
          }
        `}} />
      </head>
      <body className={`${montserrat.variable} ${marcellus.variable} font-sans bg-background text-on-background`} suppressHydrationWarning>
        <NextTopLoader color="var(--primary)" height={3} showSpinner={false} />
        <Preloader>
          <PublicShell settings={s} regularCruises={regularCruises} dinnerCruises={dinnerCruises}>
            {children}
          </PublicShell>
        </Preloader>
      </body>
    </html>
  );
}
