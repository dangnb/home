"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1A1A1A", color: "#ccc", paddingTop: 72, paddingBottom: 0 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontStyle: "italic", fontWeight: 700, color: "#C2A979", marginBottom: 16 }}>Suli Salon</div>
          <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#888", maxWidth: 240 }}>
            Elevating beauty through precision and artistry. Your destination for premium nail care in Prague.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <a href="#" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none" }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href="#" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none" }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Services", "/services"], ["Gallery", "/gallery"], ["About Us", "/about"], ["Contact Us", "/contact"]].map(([l, h]) => (
              <li key={l}>
                <Link href={h} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", textDecoration: "none" }}>{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branch */}
        <div>
          <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Our Branches</h4>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 1.8 }}>
            <div style={{ fontWeight: 600, color: "#ccc", marginBottom: 6 }}>Suli Salon – Praha 12</div>
            <div>📍 Cs. exilu 2154, 143 00 Praha 12</div>
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Opening Hours</h4>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 2 }}>
            <div>🕐 Mon – Fri: 10:00 – 18:00</div>
            <div>🕐 Sat – Sun: 09:00 – 19:00</div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #2a2a2a", padding: "20px 64px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#555", margin: 0 }}>© 2024 Suli Salon. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Service", "Careers"].map((l) => (
            <Link key={l} href="#" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#555", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
