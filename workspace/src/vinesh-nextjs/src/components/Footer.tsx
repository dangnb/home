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
                <span className="site-logo-icon-inner"><span style={{ color: "#8cc63f" }}>W</span></span>
              </div>
              <span style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "1px", color: "#ffffff" }}>Web<span style={{ color: "#8cc63f" }}>Care</span></span>
            </Link>
            <p>{desc}</p>
            <div className="social-links">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="ph-fill ph-facebook-logo"></i></a>}
              {settings?.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="ph-fill ph-youtube-logo"></i></a>}
              {settings?.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="ph-fill ph-linkedin-logo"></i></a>}
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
