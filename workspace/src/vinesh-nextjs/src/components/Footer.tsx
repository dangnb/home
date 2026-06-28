import Link from "next/link";

export default function Footer() {
  return (
    <footer id="main-footer" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col about-col">
            <h3 className="footer-logo">VINESH</h3>
            <p>Công ty TNHH VINESH Việt Nam cung cấp giải pháp tổng thể về An Toàn, Sức Khỏe & Môi Trường cho doanh nghiệp của bạn.</p>
            <div className="social-links">
              <Link href="#"><i className="ph ph-facebook-logo"></i></Link>
              <Link href="#"><i className="ph ph-youtube-logo"></i></Link>
              <Link href="#"><i className="ph ph-linkedin-logo"></i></Link>
            </div>
          </div>
          
          <div className="footer-col links-col">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><Link href="#">Về chúng tôi</Link></li>
              <li><Link href="#">Sản phẩm & dịch vụ</Link></li>
              <li><Link href="#">Tin tức & sự kiện</Link></li>
              <li><Link href="#">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div className="footer-col contact-col">
            <h4>Thông tin liên hệ</h4>
            <ul>
              <li><i className="ph ph-map-pin"></i> Số 123, Đường ABC, Quận XYZ, Hà Nội</li>
              <li><i className="ph ph-phone"></i> 0984 929 693</li>
              <li><i className="ph ph-envelope"></i> contact@vinesh.vn</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container text-center">
          <p>&copy; 2026 CÔNG TY TNHH VINESH VIỆT NAM. Đã đăng ký bản quyền. <br />Thiết kế lại bởi Antigravity (Next.js Version).</p>
        </div>
      </div>
    </footer>
  );
}
