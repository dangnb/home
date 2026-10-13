"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { SiteSettings } from "@/lib/db";
import Link from "next/link";
import { MdCalendarMonth } from "react-icons/md";

interface Props {
  children: React.ReactNode;
  settings: SiteSettings;
}

export default function PublicShell({ children, settings }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer settings={settings} />
      {/* CTA Widget (Mobile Mobile) */}
      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <Link href="/booking">
          <button className="gold-shimmer-btn text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
            <MdCalendarMonth size={24} aria-hidden="true" />
          </button>
        </Link>
      </div>
    </>
  );
}
