"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import type { SiteSettings, Cruise } from "@/lib/db";

interface Props {
  children: React.ReactNode;
  settings: SiteSettings;
  regularCruises: Pick<Cruise, "name" | "slug">[];
  dinnerCruises: Pick<Cruise, "name" | "slug">[];
}

export default function PublicShell({ children, settings, regularCruises, dinnerCruises }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar
        hotline={settings.hotline}
        regularCruises={regularCruises.map(c => ({ label: c.name, href: `/du-thuyen/${c.slug}` }))}
        dinnerCruises={dinnerCruises.map(c => ({ label: c.name, href: `/du-thuyen/${c.slug}` }))}
      />
      {children}
      <Footer settings={settings} />
      <FloatingButtons
        hotline={settings.hotline}
        zalo={settings.zalo}
        messenger="https://m.me/2datickets"
      />
    </>
  );
}
