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
        <footer className="bg-[#161514] text-[#ECE7DE] pt-16 md:pt-20 pb-0 font-sans border-t border-[#2F2B24]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div>
                    <BrandLogo light className="mb-4" />
                    <p className="font-sans text-[14px] leading-[1.75] text-[#D8D2C7] max-w-[290px] mt-3 font-normal">
                        Nơi mỗi bộ móng được chăm chút tỉ mỉ, để bạn tự tin tỏa sáng theo cách riêng của mình. Không gian thư giãn, phong cách mộc tự nhiên.
                    </p>
                    <div className="flex gap-3 mt-6">
                        {settings.facebook && (
                            <a
                                href={settings.facebook}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook Mộc Salon"
                                className="w-10 h-10 rounded-full border border-[#4A4337] bg-[#23211D] flex items-center justify-center text-[#E5C989] hover:text-[#FFFFFF] hover:bg-[#C2A979] hover:border-[#C2A979] hover:scale-110 transition-all duration-300 shadow-sm"
                            >
                                <FaFacebookF size={15} />
                            </a>
                        )}
                        {settings.instagram && (
                            <a
                                href={settings.instagram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram Mộc Salon"
                                className="w-10 h-10 rounded-full border border-[#4A4337] bg-[#23211D] flex items-center justify-center text-[#E5C989] hover:text-[#FFFFFF] hover:bg-[#C2A979] hover:border-[#C2A979] hover:scale-110 transition-all duration-300 shadow-sm"
                            >
                                <FaInstagram size={16} />
                            </a>
                        )}
                        {settings.tiktok && (
                            <a
                                href={settings.tiktok}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="TikTok Mộc Salon"
                                className="w-10 h-10 rounded-full border border-[#4A4337] bg-[#23211D] flex items-center justify-center text-[#E5C989] hover:text-[#FFFFFF] hover:bg-[#C2A979] hover:border-[#C2A979] hover:scale-110 transition-all duration-300 shadow-sm"
                            >
                                <FaTiktok size={15} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-sans text-[13px] font-bold tracking-[0.16em] uppercase text-[#E5C989] mb-5 flex items-center gap-2">
                        <span className="w-2 h-0.5 bg-[#C2A979] inline-block rounded-full"></span>
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
                                    className="font-sans text-[14px] text-[#D8D2C7] no-underline hover:text-[#FFFFFF] hover:translate-x-1.5 inline-flex items-center gap-1.5 transition-all duration-200 font-medium group"
                                >
                                    <span className="text-[#C2A979] text-[12px] group-hover:text-white transition-colors">›</span>
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-sans text-[13px] font-bold tracking-[0.16em] uppercase text-[#E5C989] mb-5 flex items-center gap-2">
                        <span className="w-2 h-0.5 bg-[#C2A979] inline-block rounded-full"></span>
                        Thông tin liên hệ
                    </h4>
                    <div className="font-sans text-[14px] leading-[1.8] flex flex-col gap-3.5">
                        {settings.hotline && (
                            <div className="flex items-start gap-3">
                                <MdPhone size={20} className="text-[#E5C989] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#A89F91] font-semibold block mb-0.5">Hotline đặt lịch</span>
                                    <a
                                        href={`tel:${settings.hotline.replace(/\s+/g, "")}`}
                                        className="font-bold text-[16px] text-[#FFFFFF] hover:text-[#E5C989] transition-colors tracking-wide"
                                    >
                                        {settings.hotline}
                                    </a>
                                </div>
                            </div>
                        )}
                        {settings.address && (
                            <div className="flex items-start gap-3">
                                <MdLocationOn size={20} className="text-[#E5C989] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#A89F91] font-semibold block mb-0.5">Địa chỉ salon</span>
                                    <span className="text-[#ECE7DE] text-[14px] leading-relaxed block font-medium">{settings.address}</span>
                                </div>
                            </div>
                        )}
                        {settings.email && (
                            <div className="flex items-start gap-3">
                                <MdEmail size={20} className="text-[#E5C989] mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#A89F91] font-semibold block mb-0.5">Email hỗ trợ</span>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="text-[#ECE7DE] text-[14px] font-medium hover:text-[#E5C989] transition-colors"
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
                    <h4 className="font-sans text-[13px] font-bold tracking-[0.16em] uppercase text-[#E5C989] mb-5 flex items-center gap-2">
                        <span className="w-2 h-0.5 bg-[#C2A979] inline-block rounded-full"></span>
                        Giờ mở cửa
                    </h4>
                    <div className="font-sans text-[14px] leading-[1.8] flex flex-col gap-2.5">
                        {hoursList.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-[#ECE7DE] font-medium text-[14px]">
                                <MdAccessTime size={18} className="text-[#E5C989] mt-1 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                        <div className="mt-3 p-3.5 rounded-lg bg-[#23211D] border border-[#3E372B] text-[13px] text-[#E0D8CB] leading-relaxed flex items-start gap-2">
                            <span className="text-[#E5C989] text-[15px] shrink-0 leading-none mt-0.5">💡</span>
                            <span>Quý khách nên đặt lịch trước để được chuẩn bị chu đáo và không phải chờ đợi.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#2F2B24] py-6 px-6 md:px-12 lg:px-16 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <p className="font-sans text-[13px] text-[#ACA395] m-0 font-normal">
                    {settings.copyright || "© 2025 Mộc Salon – Bảo lưu mọi quyền"}
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {settings.footerTaglines && settings.footerTaglines.length > 0 ? (
                        settings.footerTaglines.map((l, i) => (
                            <span key={i} className="font-sans text-[12px] text-[#CBC4B7] font-medium">
                                {l}
                            </span>
                        ))
                    ) : (
                        ["Chính sách bảo mật", "Điều khoản sử dụng", "Quy chuẩn an toàn"].map((l) => (
                            <Link
                                key={l}
                                href="#"
                                className="font-sans text-[12px] text-[#CBC4B7] no-underline hover:text-[#FFFFFF] transition-colors font-medium"
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
