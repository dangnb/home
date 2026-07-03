interface TestimonialsProps {
    lang: string;
    settings?: Record<string, string>;
}

export default function Testimonials({ lang, settings }: TestimonialsProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    let testimonials: any[] = [];
    try {
        if (settings?.testimonialsData) {
            testimonials = JSON.parse(settings.testimonialsData);
        }
    } catch (e) { }

    if (testimonials.length === 0) {
        testimonials = [
            {
                name: "Nguyễn Văn A",
                role_vi: "Giám đốc Cty ABC",
                role_en: "CEO of ABC Corp",
                content_vi: "Chất lượng dịch vụ tuyệt vời, đội ngũ hỗ trợ nhiệt tình. Chúng tôi rất hài lòng khi hợp tác.",
                content_en: "Excellent service quality, enthusiastic support team. We are very satisfied with our partnership.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                name: "Trần Thị B",
                role_vi: "Trưởng phòng Marketing",
                role_en: "Marketing Manager",
                content_vi: "Giải pháp công nghệ mà công ty cung cấp đã giúp chúng tôi tối ưu 30% chi phí vận hành.",
                content_en: "The technology solution provided by the company helped us optimize operating costs by 30%.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
            }
        ];
    }

    return (
        <section className="testimonials-section section-padding">
            <div className="container">
                <div className="section-header text-center" data-aos="fade-up">
                    <h2 className="section-title">{fallback("Khách Hàng Nói Gì Về Chúng Tôi", "Client Testimonials")}</h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        {fallback("Sự hài lòng của khách hàng là thước đo thành công lớn nhất của chúng tôi.", "Customer satisfaction is our greatest measure of success.")}
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((item, idx) => (
                        <div className="testimonial-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 150}>
                            <div className="testi-stars">
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                            </div>
                            <p className="testi-content">"{lang === 'vi' ? item.content_vi : (item[`content_${lang}`] || item.content_en)}"</p>
                            <div className="testi-author">
                                <img src={item.avatar} alt={item.name} className="testi-avatar" width={60} height={60} loading="lazy" decoding="async" />
                                <div className="testi-info">
                                    <h4>{item.name}</h4>
                                    <span>{lang === 'vi' ? item.role_vi : (item[`role_${lang}`] || item.role_en)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
