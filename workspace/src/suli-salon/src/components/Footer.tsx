"use client";
import React from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";

export default function Footer({ settings }: { settings: SiteSettings }) {
    if (!settings) return null;
    return (
        <footer style={{ background: "#1A1A1A", color: "#ccc", paddingTop: 80, paddingBottom: 0 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
                {/* Brand */}
                <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontStyle: "italic", fontWeight: 700, color: "#C2A979", marginBottom: 16 }}>{settings.siteName || "Suli Salon"}</div>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#888", maxWidth: 240 }}>
                        {settings.tagline || "Elevating beauty through precision and artistry. Your destination for premium nail care in Prague."}
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                        {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>f</a>}
                        {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>ig</a>}
                        {settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>tk</a>}
                    </div>
                </div>
                {/* Quick Links */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Quick Links</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {["Services", "Gallery", "About", "Contact"].map((l) => (
                            <li key={l}>
                                <Link href={`/${l.toLowerCase()}`} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", textDecoration: "none", transition: "color .25s" }}
                                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#C2A979")}
                                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                                >{l}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Contact */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Contact</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
                        <div style={{ fontWeight: 600, color: "#ccc", marginBottom: 6 }}>Hotline: {settings.hotline}</div>
                        <div>📍 {settings.address}</div>
                        <div>✉️ {settings.email}</div>
                    </div>
                </div>
                {/* Hours */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Opening Hours</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 2 }}>
                        {settings.workingHours ? (
                            <div>{settings.workingHours}</div>
                        ) : (
                            <>
                                <div>🕐 Mon – Fri: 10:00 – 18:00</div>
                                <div>🕐 Sat – Sun: 09:00 – 19:00</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #2a2a2a", padding: "20px 64px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#555", margin: 0 }}>{settings.copyright || "© 2024 Suli Salon. All rights reserved."}</p>
                <div style={{ display: "flex", gap: 24 }}>
                    {settings.footerTaglines && settings.footerTaglines.length > 0 ? (
                        settings.footerTaglines.map((l, i) => (
                            <span key={i} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#555" }}>{l}</span>
                        ))
                    ) : (
                        ["Privacy Policy", "Terms of Service", "Careers"].map((l) => (
                            <Link key={l} href="#" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#555", textDecoration: "none", transition: "color .25s" }}
                                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#C2A979")}
                                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
                            >{l}</Link>
                        ))
                    )}
                </div>
            </div>
        </footer>
    );
}
