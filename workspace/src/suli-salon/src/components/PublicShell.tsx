"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import type { SiteSettings, CruiseData } from "@/lib/db";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  settings: SiteSettings;
  regularCruises: Pick<CruiseData, "name" | "slug">[];
  dinnerCruises: Pick<CruiseData, "name" | "slug">[];
}

export default function PublicShell({ children, settings, regularCruises, dinnerCruises }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* CTA Widget (Mobile Mobile) */}
      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <Link href="/booking">
          <button className="gold-shimmer-btn text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
          </button>
        </Link>
      </div>
    </>
  );
}
