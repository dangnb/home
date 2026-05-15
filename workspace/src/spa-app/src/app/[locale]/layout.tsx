import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ngọc Hương Spa & Clinic",
  description: "Awaken Your Natural Beauty at Ngoc Huong Spa & Clinic.",
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
    <html lang={locale}>
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50 text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1 flex flex-col">
            {props.children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
