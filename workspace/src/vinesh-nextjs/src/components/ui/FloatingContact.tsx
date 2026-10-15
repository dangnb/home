"use client";

interface FloatingContactProps {
  phone?: string;
  zalo?: string;
  facebook?: string;
  lang: string;
}

export default function FloatingContact({
  phone = "0984 929 693",
  zalo,
  facebook,
  lang
}: FloatingContactProps) {
  const cleanPhone = phone.replace(/\s+/g, '');

  // Xử lý link Zalo: nếu truyền URL đầy đủ thì dùng, còn nếu chỉ truyền số điện thoại thì map về zalo.me
  const zaloTarget = (zalo && zalo.trim() !== "") ? zalo.trim() : cleanPhone;
  const cleanZalo = zaloTarget.startsWith("http")
    ? zaloTarget
    : `https://zalo.me/${zaloTarget.replace(/\s+/g, '')}`;

  // Xử lý link Facebook: fallback sang trang chính nếu chưa cấu hình
  const cleanFacebook = (facebook && facebook.trim() !== "")
    ? facebook.trim()
    : "https://facebook.com/webcare.vn";

  return (
    <div className="floating-contact-group" aria-label="Quick contact channels">
      {/* Nút Chat Facebook Messenger */}
      <a
        href={cleanFacebook}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-facebook"
        title={lang === "vi" ? "Nhắn tin Facebook" : "Chat on Facebook"}
        aria-label="Facebook Messenger"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2C7.373 2 2 7.042 2 13.26c0 3.542 1.743 6.697 4.475 8.76V26l3.82-2.098c1.173.326 2.417.502 3.705.502 6.627 0 12-5.042 12-11.26C26 7.042 20.627 2 14 2zm1.188 15.176l-3.063-3.268-5.979 3.268 6.574-6.979 3.14 3.268 5.902-3.268-6.574 6.979z" fill="#ffffff"/>
        </svg>
        <span className="floating-tooltip">{lang === "vi" ? "Facebook Chat" : "Facebook Chat"}</span>
      </a>

      {/* Nút Chat Zalo */}
      <a
        href={cleanZalo}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-zalo"
        title={lang === "vi" ? "Chat qua Zalo" : "Chat on Zalo"}
        aria-label="Zalo"
      >
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#ffffff" />
          <text x="18" y="22" textAnchor="middle" fill="#0068FF" fontSize="11.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.3px">Zalo</text>
        </svg>
        <span className="floating-tooltip">Chat Zalo</span>
      </a>

      {/* Nút Gọi Hotline */}
      <a
        href={`tel:${cleanPhone}`}
        className="floating-btn floating-phone"
        title={lang === "vi" ? `Gọi Hotline: ${phone}` : `Call Hotline: ${phone}`}
        aria-label="Call Hotline"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <span className="floating-tooltip">{lang === "vi" ? `Hotline: ${phone}` : `Hotline: ${phone}`}</span>
      </a>
    </div>
  );
}
