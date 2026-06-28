import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-bg" id="hero-bg-image" style={{ backgroundImage: "url('/assets/hero.png')" }}></div>
      <div className="container hero-content">
        <h2 className="hero-subtitle">Giải pháp tổng thể</h2>
        <h1 className="hero-title">AN TOÀN - SỨC KHỎE - MÔI TRƯỜNG</h1>
        <p className="hero-desc">
          Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.
        </p>
        <div className="hero-buttons">
          <Link href="#services" className="btn btn-primary">Khám phá dịch vụ</Link>
          <Link href="#" className="btn btn-outline">Liên hệ tư vấn</Link>
        </div>
      </div>
    </section>
  );
}
