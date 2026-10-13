"use client";
import React from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
import BrandLogo from "@/components/BrandLogo";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdPhone, MdLocationOn, MdEmail, MdAccessTime } from "react-icons/md";

export default function Footer({ settings }: { settings: SiteSettings }) {
    if (!settings) return null;

    const hoursList = settings.workingHours
        ? settings.workingHours.split(/[,|]/).map(h => h.trim()).filter(Boolean)
        : [
            "Thứ Hai – Thứ Bảy: 09:00 – 20:00",
            "Chủ Nhật: 09:00 – 18:00",
        ];

    return (
        <footer className="bg-[#1A1A1A] text-[#ccc] pt-16 md:pt-20 pb-0 font-sans border-t border-[#2a2a2a]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div>
                    <BrandLogo light className="mb-4" />
                    <p className="font-sans text-[14px] leading-[1.7] text-[#888] max-w-[280px] mt-3">
                        Nơi mỗi bộ móng được chăm chút tỉ mỉ, để bạn tự tin tỏa sáng theo cách riêng của mình. Không gian thư giãn, phong cách mộc tự nhiên.
                    </p>
                    <div className="flex gap-3 mt-6">
                        {settings.facebook && (
                            <a
                                href={settings.facebook}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook Mộc Salon"
                                className="w-9 h-9 rounded-full border border-[#333] flex items-center justify-center text-[#888] hover:text-[#C2A979] hover:border-[#C2A979] hover:scale-105 transition-all duration-300"
                            >
                                <FaFacebookF size={14} />
                            </a>
                        )}
                        {settings.instagram && (
                            <a
                                href={settings.instagram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram Mộc Salon"
                                className="w-9 h-9 rounded-full border border-[#333] flex items-center justify-center text-[#888] hover:text-[#C2A979] hover:border-[#C2A979] hover:scale-105 transition-all duration-300"
                            >
                                <FaInstagram size={15} />
                            </a>
                        )}
                        {settings.tiktok && (
                            <a
                                href={settings.tiktok}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="TikTok Mộc Salon"
                                className="w-9 h-9 rounded-full border border-[#333] flex items-center justify-center text-[#888] hover:text-[#C2A979] hover:border-[#C2A979] hover:scale-105 transition-all duration-300"
                            >
                                <FaTiktok size={14} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C2A979] mb-5">
                        Liên kết nhanh
                    </h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                        {[
                            { label: "Dịch vụ móng", href: "/services" },
                            { label: "Bộ sưu tập Nail Art", href: "/gallery" },
                            { label: "Cẩm nang làm đẹp", href: "/bai-viet" },
                            { label: "Về Mộc Salon", href: "/about" },
                            { label: "Đặt lịch hẹn", href: "/booking" },
                            { label: "Liên hệ & Vị trí", href: "/contact" },
                        ].map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    className="font-sans text-[14px] text-[#888] no-underline hover:text-[#C2A979] hover:translate-x-1 inline-block transition-all duration-200"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C2A979] mb-5">
                        Thông tin liên hệ
                    </h4>
                    <div className="font-sans text-[14px] text-[#888] leading-[1.8] flex flex-col gap-3">
                        {settings.hotline && (
                            <div className="flex items-start gap-2.5">
                                <MdPhone size={18} className="text-[#C2A979] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[12px] uppercase text-[#666] block">Hotline đặt lịch</span>
                                    <a
                                        href={`tel:${settings.hotline.replace(/\s+/g, "")}`}
                                        className="font-semibold text-[#ccc] hover:text-[#C2A979] transition-colors"
                                    >
                                        {settings.hotline}
                                    </a>
                                </div>
                            </div>
                        )}
                        {settings.address && (
                            <div className="flex items-start gap-2.5">
                                <MdLocationOn size={18} className="text-[#C2A979] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[12px] uppercase text-[#666] block">Địa chỉ salon</span>
                                    <span className="text-[#aaa]">{settings.address}</span>
                                </div>
                            </div>
                        )}
                        {settings.email && (
                            <div className="flex items-start gap-2.5">
                                <MdEmail size={18} className="text-[#C2A979] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[12px] uppercase text-[#666] block">Email hỗ trợ</span>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="text-[#aaa] hover:text-[#C2A979] transition-colors"
                                    >
                                        {settings.email}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hours */}
                <div>
                    <h4 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C2A979] mb-5">
                        Giờ mở cửa
                    </h4>
                    <div className="font-sans text-[14px] text-[#888] leading-[1.8] flex flex-col gap-2.5">
                        {hoursList.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[#aaa]">
                                <MdAccessTime size={16} className="text-[#C2A979] mt-1 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                        <div className="mt-3 p-3 rounded-lg bg-[#222] border border-[#2e2e2e] text-[12px] text-[#777] leading-relaxed">
                            💡 Quý khách nên đặt lịch trước để được chuẩn bị chu đáo và không phải chờ đợi.
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#2a2a2a] py-5 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <p className="font-sans text-[12px] text-[#555] m-0">
                    {settings.copyright || "© 2025 Mộc Salon – Bảo lưu mọi quyền"}
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {settings.footerTaglines && settings.footerTaglines.length > 0 ? (
                        settings.footerTaglines.map((l, i) => (
                            <span key={i} className="font-sans text-[11px] text-[#666]">
                                {l}
                            </span>
                        ))
                    ) : (
                        ["Chính sách bảo mật", "Điều khoản sử dụng", "Quy chuẩn an toàn"].map((l) => (
                            <Link
                                key={l}
                                href="#"
                                className="font-sans text-[11px] text-[#555] no-underline hover:text-[#C2A979] transition-colors"
                            >
                                {l}
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </footer>
    );
}
