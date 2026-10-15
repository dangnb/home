import Link from "next/link";

interface FooterProps {
  settings?: Record<string, string>;
  lang: string;
}

export default function Footer({ settings, lang }: FooterProps) {
  const phone = settings?.phone || "0984 929 693";
  const siteName = settings?.siteName || "WebCare";
  const email = settings?.email || `info@webcare.vn`;

  const isVi = lang === "vi";

  // Dynamic Content with Fallbacks
  const footerDescRaw = isVi ? settings?.footerDesc : settings?.[`footerDesc_${lang}`];
  const desc = footerDescRaw || (!isVi ?
    `${siteName} Vietnam provides comprehensive solutions & services for your enterprise.` :
    `Công ty TNHH ${siteName} Việt Nam cung cấp các giải pháp và dịch vụ toàn diện cho doanh nghiệp của bạn.`);

  const addressRaw = isVi ? settings?.address : settings?.[`address_${lang}`];
  const address = addressRaw || (!isVi ? "123 ABC Street, XYZ District, Hanoi" : "Số 123, Đường ABC, Quận XYZ, Hà Nội");

  const linksTitle = !isVi ? "Quick Links" : "Liên kết nhanh";
  const aboutStr = !isVi ? "About Us" : "Về chúng tôi";
  const serviceStr = !isVi ? "Products & Services" : "Sản phẩm & dịch vụ";
  const newsStr = !isVi ? "News & Events" : "Tin tức & sự kiện";
  const contactStr = !isVi ? "Contact" : "Liên hệ";

  const infoTitle = !isVi ? "Contact Info" : "Thông tin liên hệ";
  const copyright = !isVi ? `© ${new Date().getFullYear()} ${siteName} VIETNAM CO., LTD. All rights reserved.` : `© ${new Date().getFullYear()} CÔNG TY TNHH ${siteName} VIỆT NAM. Đã đăng ký bản quyền.`;

  return (
    <footer id="main-footer" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col about-col">
            <Link href={`/${lang}`} className="footer-logo" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "18px", textDecoration: "none" }}>
              <div className="site-logo-icon" style={{ width: "36px", height: "36px", fontSize: "18px" }}>
                <span className="site-logo-icon-inner">W</span>
              </div>
              <span style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "1px", color: "#ffffff" }}>Web<span style={{ color: "#22c55e" }}>Care</span></span>
            </Link>
            <p>{desc}</p>
            <div className="social-links">
              <a href={settings?.facebook || "https://facebook.com/webcare.vn"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={settings?.zalo ? (settings.zalo.startsWith("http") ? settings.zalo : `https://zalo.me/${settings.zalo.replace(/\s+/g, '')}`) : `https://zalo.me/${phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
                title="Zalo Chat"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{ fontWeight: 900, fontSize: "11px", background: "#0068ff", color: "#fff", padding: "3px 6px", borderRadius: "5px", lineHeight: "1" }}>Zalo</span>
              </a>
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {settings?.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.27c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="footer-col links-col">
            <h4>{linksTitle}</h4>
            <ul>
              <li><Link href={`/${lang}#about`}><i className="ph ph-caret-right" style={{ fontSize: "14px" }}></i> {aboutStr}</Link></li>
              <li><Link href={`/${lang}#services`}><i className="ph ph-caret-right" style={{ fontSize: "14px" }}></i> {serviceStr}</Link></li>
              <li><Link href={`/${lang}#news`}><i className="ph ph-caret-right" style={{ fontSize: "14px" }}></i> {newsStr}</Link></li>
              <li><Link href={`/${lang}/lien-he`}><i className="ph ph-caret-right" style={{ fontSize: "14px" }}></i> {contactStr}</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>{infoTitle}</h4>
            <ul>
              <li><i className="ph-fill ph-map-pin"></i> <span>{address}</span></li>
              <li><i className="ph-fill ph-phone"></i> <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: "#cbd5e1" }}>{phone}</a></li>
              <li><i className="ph-fill ph-envelope"></i> <a href={`mailto:${email}`} style={{ color: "#cbd5e1" }}>{email}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container text-center">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
