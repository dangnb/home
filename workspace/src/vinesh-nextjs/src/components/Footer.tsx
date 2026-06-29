import Link from "next/link";

interface FooterProps {
  settings?: Record<string, string>;
  lang: string;
}

export default function Footer({ settings, lang }: FooterProps) {
  const phone = settings?.phone || "0984 929 693";
  const siteName = settings?.siteName || "VINESH";

  const isVi = lang === "vi";

  const desc = !isVi ?
    `${siteName} Vietnam provides comprehensive solutions for Health, Safety & Environment for your enterprise.` :
    `Công ty TNHH ${siteName} Việt Nam cung cấp giải pháp tổng thể về An Toàn, Sức Khỏe & Môi Trường cho doanh nghiệp của bạn.`;

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
            <h3 className="footer-logo">{siteName}</h3>
            <p>{desc}</p>
            <div className="social-links">
              <Link href="#"><i className="ph ph-facebook-logo"></i></Link>
              <Link href="#"><i className="ph ph-youtube-logo"></i></Link>
              <Link href="#"><i className="ph ph-linkedin-logo"></i></Link>
            </div>
          </div>

          <div className="footer-col links-col">
            <h4>{linksTitle}</h4>
            <ul>
              <li><Link href="#">{aboutStr}</Link></li>
              <li><Link href="#">{serviceStr}</Link></li>
              <li><Link href="#">{newsStr}</Link></li>
              <li><Link href="#">{contactStr}</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>{infoTitle}</h4>
            <ul>
              <li><i className="ph ph-map-pin"></i> {!isVi ? "123 ABC Street, XYZ District, Hanoi" : "Số 123, Đường ABC, Quận XYZ, Hà Nội"}</li>
              <li><i className="ph ph-phone"></i> {phone}</li>
              <li><i className="ph ph-envelope"></i> contact@{siteName.toLowerCase()}.vn</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container text-center">
          <p>{copyright} <br />Redesigned by Antigravity (Next.js Version).</p>
        </div>
      </div>
    </footer>
  );
}
