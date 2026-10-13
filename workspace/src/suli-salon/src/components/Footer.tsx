"use client";
import React from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
import BrandLogo from "@/components/BrandLogo";

export default function Footer({ settings }: { settings: SiteSettings }) {
    if (!settings) return null;
    return (
        <footer style={{ background: "#1A1A1A", color: "#ccc", paddingTop: 80, paddingBottom: 0 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
                {/* Brand */}
                <div>
                    <BrandLogo light style={{ marginBottom: 16 }} />
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#888", maxWidth: 240 }}>
                        Nơi mỗi bộ móng được chăm chút tỉ mỉ, để bạn tự tin tỏa sáng theo cách riêng của mình.
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                        {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>f</a>}
                        {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>ig</a>}
                        {settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}>tk</a>}
                    </div>
                </div>
                {/* Quick Links */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Liên kết nhanh</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Dịch vụ", href: "/services" },
                            { label: "Bộ sưu tập", href: "/gallery" },
                            { label: "Bài viết", href: "/bai-viet" },
                            { label: "Giới thiệu", href: "/about" },
                            { label: "Liên hệ", href: "/contact" },
                        ].map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", textDecoration: "none", transition: "color .25s" }}
                                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#C2A979")}
                                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                                >{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Contact */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Liên hệ</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
                        <div style={{ fontWeight: 600, color: "#ccc", marginBottom: 6 }}>Hotline: {settings.hotline}</div>
                        <div>📍 {settings.address}</div>
                        <div>✉️ {settings.email}</div>
                    </div>
                </div>
                {/* Hours */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Giờ mở cửa</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 2 }}>
                        {settings.workingHours ? (
                            <div>{settings.workingHours}</div>
                        ) : (
                            <>
                                <div>🕐 Thứ Hai – Thứ Sáu: 10:00 – 18:00</div>
                                <div>🕐 Thứ Bảy – Chủ Nhật: 09:00 – 19:00</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #2a2a2a", padding: "20px 64px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#555", margin: 0 }}>{settings.copyright || "© 2025 Mộc Salon – Bảo lưu mọi quyền"}</p>
                <div style={{ display: "flex", gap: 24 }}>
                    {settings.footerTaglines && settings.footerTaglines.length > 0 ? (
                        settings.footerTaglines.map((l, i) => (
                            <span key={i} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#555" }}>{l}</span>
                        ))
                    ) : (
                        ["Chính sách bảo mật", "Điều khoản sử dụng", "Tuyển dụng"].map((l) => (
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
