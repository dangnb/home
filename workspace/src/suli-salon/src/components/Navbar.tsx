"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Montserrat:wght@500;600&display=swap');
        .nav-link-item {
          font-family: Montserrat, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color .25s;
          position: relative;
          padding-bottom: 3px;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1.5px;
          background: #C2A979;
          transition: width .3s ease;
        }
        .nav-link-item:hover::after,
        .nav-link-item.active::after { width: 100%; }
        .nav-link-item:hover { color: #C2A979 !important; }
        .nav-link-item.active { color: #C2A979 !important; }

        .book-btn {
          font-family: Montserrat, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #C2A979, #a08040);
          border: none;
          padding: 12px 28px;
          cursor: pointer;
          transition: all .3s;
          box-shadow: 0 3px 14px rgba(194,169,121,.35);
        }
        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194,169,121,.45);
        }
      `}</style>

      <header style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        transition: "all .45s ease",
        background: scrolled ? "rgba(253,251,247,0.92)" : "rgba(253,251,247,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(194,169,121,.2)" : "1px solid rgba(194,169,121,.08)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,.06)" : "none",
      }}>
        <nav style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: scrolled ? "14px 64px" : "20px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding .45s ease",
        }}>

          {/* ── Logo ──────────────────────────────────── */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: scrolled ? 22 : 26,
              color: "#2E2E2E",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              transition: "font-size .45s ease",
            }}>
              Suli
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: scrolled ? 22 : 26,
              color: "#C2A979",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              transition: "font-size .45s ease",
            }}>
              Salon
            </span>
          </Link>

          {/* ── Desktop Links ─────────────────────────── */}
          <ul style={{ display: "flex", gap: 36, alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nav-link-item${pathname === l.href ? " active" : ""}`}
                  style={{ color: pathname === l.href ? "#C2A979" : "#4A4A4A" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Book Button ───────────────────────────── */}
          <Link href="/booking">
            <button className="book-btn">Book Appointment</button>
          </Link>
        </nav>
      </header>
    </>
  );
}
