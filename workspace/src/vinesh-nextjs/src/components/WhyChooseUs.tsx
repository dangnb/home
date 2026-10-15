interface WhyChooseUsProps {
    lang: string;
}

export default function WhyChooseUs({ lang }: WhyChooseUsProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    const features = [
        {
            icon: "ph-fill ph-rocket-launch",
            title: fallback("Giải Pháp Nhanh Chóng", "Fast Solutions"),
            desc: fallback("Triển khai dịch vụ trong thời gian ngắn nhất nhưng vẫn đảm bảo chất lượng hàng đầu.", "Deploy services in the shortest time while ensuring top quality.")
        },
        {
            icon: "ph-fill ph-shield-check",
            title: fallback("Uy Tín & An Toàn", "Trust & Safety"),
            desc: fallback("Mọi dịch vụ và sản phẩm đều được kiểm định khắt khe trước khi bàn giao.", "All services and products are rigorously tested before delivery.")
        },
        {
            icon: "ph-fill ph-users-three",
            title: fallback("Đội Ngũ Chuyên Gia", "Expert Team"),
            desc: fallback("Nhân sự được đào tạo bài bản, có khả năng giải quyết các bài toán phức tạp.", "Well-trained personnel capable of solving complex problems.")
        },
        {
            icon: "ph-fill ph-headset",
            title: fallback("Hỗ Trợ Tận Tâm", "Dedicated Support"),
            desc: fallback("Sẵn sàng lắng nghe và giải quyết mọi vấn đề của bạn mọi lúc, mọi nơi.", "Ready to listen and solve your problems anytime, anywhere.")
        }
    ];

    return (
        <section className="why-choose-us section-padding">
            <div className="container">
                <div className="section-header text-center" data-aos="fade-up">
                    <span className="section-badge">
                        <i className="ph-fill ph-trophy"></i> {fallback("Thế mạnh vượt trội", "Our Advantages")}
                    </span>
                    <h2 className="section-title">{fallback("Tại Sao Chọn Chúng Tôi?", "Why Choose Us?")}</h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        {fallback("Những giá trị khác biệt làm nên thương hiệu của chúng tôi trên thị trường.", "The distinct values that build our brand in the market.")}
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div className="feature-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 120}>
                            <div className="feature-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
