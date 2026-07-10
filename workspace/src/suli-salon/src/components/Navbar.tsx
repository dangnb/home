"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/db";

export default function Navbar({ settings }: { settings: SiteSettings }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    const pathname = usePathname();

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 100,
                transition: "all .5s ease",
                background: scrolled ? "rgba(253,251,247,.95)" : "rgba(253,251,247,.65)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: scrolled ? "1px solid rgba(194,169,121,.25)" : "1px solid rgba(194,169,121,.12)",
                boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.06)" : "none",
                padding: scrolled ? "10px 0" : "18px 0",
            }}
        >
            <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontStyle: "italic", fontWeight: 700, color: "#C2A979", textDecoration: "none", letterSpacing: "-0.01em", transition: "transform .3s" }}>
                    {settings?.siteName || "Suli Salon"}
                </Link>

                <ul style={{ display: "flex", gap: 40, listStyle: "none", margin: 0, padding: 0 }}>
                    {["Services", "About", "Gallery", "Contact"].map((item) => {
                        const href = `/${item.toLowerCase()}`;
                        const isActive = pathname === href || pathname.startsWith(href + '/');
                        const defaultColor = isActive ? "#C2A979" : "#2E2E2E";
                        const defaultBorder = isActive ? "#C2A979" : "transparent";

                        return (
                            <li key={item}>
                                <Link href={href} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: defaultColor, textDecoration: "none", transition: "color .3s, border-bottom-color .3s", paddingBottom: 2, borderBottom: `1.5px solid ${defaultBorder}` }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "#C2A979"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#C2A979"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = defaultColor; (e.currentTarget as HTMLElement).style.borderBottomColor = defaultBorder; }}
                                >{item}</Link>
                            </li>
                        );
                    })}
                </ul>

                <Link href="/booking">
                    <button style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "14px 28px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", borderRadius: "20px 4px 20px 4px", cursor: "pointer", transition: "all .3s", boxShadow: "0 4px 16px rgba(194,169,121,.35)" }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(194,169,121,.45)"; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(194,169,121,.35)"; }}
                    >
                        Book Appointment
                    </button>
                </Link>
            </nav>
        </header>
    );
}
