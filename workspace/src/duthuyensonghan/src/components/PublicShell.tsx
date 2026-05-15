"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import type { SiteSettings } from "@/lib/db";

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
      <Navbar hotline={settings.hotline} />
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
