"use client";

import Link from "next/link";

interface FloatingContactProps {
  phone?: string;
  lang: string;
}

export default function FloatingContact({ phone = "0984 929 693", lang }: FloatingContactProps) {
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <div className="floating-contact-group" aria-label="Quick contact">
      {/* Hotline Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="floating-btn floating-phone"
        title={lang === "vi" ? `Gọi Hotline: ${phone}` : `Call Hotline: ${phone}`}
        aria-label="Call Hotline"
      >
        <i className="ph-fill ph-phone-call"></i>
      </a>

      {/* Quick Message / Contact Link */}
      <Link
        href={`/${lang}/lien-he`}
        className="floating-btn"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" }}
        title={lang === "vi" ? "Gửi yêu cầu tư vấn" : "Send contact request"}
        aria-label="Send message"
      >
        <i className="ph-fill ph-chat-teardrop-dots"></i>
      </Link>
    </div>
  );
}
