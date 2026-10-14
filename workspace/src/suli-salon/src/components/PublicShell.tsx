"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { SiteSettings } from "@/lib/db";
import Link from "next/link";
import { MdCalendarMonth } from "react-icons/md";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath } from "@/lib/i18n/routes";

interface Props {
  children: React.ReactNode;
  settings: SiteSettings;
}

export default function PublicShell({ children, settings }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { locale, dictionary } = useLocale();

  if (isAdmin) return <>{children}</>;

  const bookingHref = getLocalizedPath(locale, "booking");

  return (
    <>
      <Navbar />
      {children}
      <Footer settings={settings} />
      {/* One shared quick-book action for public pages on small screens. */}
      <Link
        href={bookingHref}
        aria-label={dictionary.common.bookNow}
        className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-transform active:scale-95 md:hidden gold-shimmer-btn"
        style={{ right: "max(16px, env(safe-area-inset-right))", bottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <MdCalendarMonth size={24} aria-hidden="true" />
      </Link>
    </>
  );
}
