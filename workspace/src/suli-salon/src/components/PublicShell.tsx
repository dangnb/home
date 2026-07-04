"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import type { SiteSettings, CruiseData } from "@/lib/db";

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
    </>
  );
}
