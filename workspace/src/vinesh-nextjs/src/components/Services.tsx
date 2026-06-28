import Link from "next/link";

export default function Services() {
  return (
    <>
      <section id="services" className="services section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Dịch Vụ Của Chúng Tôi</h2>
            <div className="divider"></div>
            <p className="section-subtitle">Cung cấp các giải pháp chuyên nghiệp, đáp ứng các tiêu chuẩn khắt khe nhất.</p>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card">
              <div className="service-image" style={{ backgroundImage: "url('/assets/service1.png')" }}>
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title"><Link href="#">Quan trắc môi trường lao động</Link></h3>
                <div className="service-divider"></div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card">
              <div className="service-image" style={{ backgroundImage: "url('/assets/service2.png')" }}>
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title"><Link href="#">Phân loại lao động</Link></h3>
                <div className="service-divider"></div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card">
              <div className="service-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop')" }}>
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title"><Link href="#">Hợp chuẩn – hợp quy</Link></h3>
                <div className="service-divider"></div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="service-card">
              <div className="service-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop')" }}>
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title"><Link href="#">Huấn luyện an toàn, vệ sinh</Link></h3>
                <div className="service-divider"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Bạn cần tư vấn chi tiết về dịch vụ?</h2>
            <p>Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>
          <div className="cta-action">
            <a href="tel:0984929693" className="btn btn-light btn-large">
              <i className="ph ph-phone"></i> Gọi Ngay: 0984 929 693
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
