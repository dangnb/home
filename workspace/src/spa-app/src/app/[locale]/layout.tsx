import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Ngọc Hương Spa & Clinic | Đánh Thức Vẻ Đẹp Tự Nhiên",
  description: "Trải nghiệm dịch vụ chăm sóc sắc đẹp, điều trị da công nghệ cao và thư giãn chuẩn 5 sao tại Ngọc Hương Spa & Clinic.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${jakarta.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className={`${jakarta.className} min-h-full flex flex-col bg-[#fdfbf9] text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1 flex flex-col">
            {props.children}
          </div>
          <Footer />

          {/* Floating Quick Contact Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <a
              href="https://zalo.me/0902960757"
              target="_blank"
              rel="noreferrer"
              title="Chat Zalo"
              className="w-13 h-13 rounded-full bg-[#0068ff] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center font-extrabold text-xs tracking-tighter hover:scale-110 transition-transform border-2 border-white"
            >
              Zalo
            </a>
            <a
              href="tel:0902960757"
              title="Gọi Hotline 090 296 0757"
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#8e2465] to-[#c23b8f] text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform border-2 border-white animate-bounce"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
