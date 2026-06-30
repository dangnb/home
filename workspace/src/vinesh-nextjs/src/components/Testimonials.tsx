interface TestimonialsProps {
    lang: string;
}

export default function Testimonials({ lang }: TestimonialsProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    const testimonials = [
        {
            name: "Nguyễn Văn A",
            role: fallback("Giám đốc Cty ABC", "CEO of ABC Corp"),
            content: fallback("Chất lượng dịch vụ tuyệt vời, đội ngũ hỗ trợ nhiệt tình. Chúng tôi rất hài lòng khi hợp tác.", "Excellent service quality, enthusiastic support team. We are very satisfied with our partnership."),
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Trần Thị B",
            role: fallback("Trưởng phòng Marketing", "Marketing Manager"),
            content: fallback("Giải pháp công nghệ mà công ty cung cấp đã giúp chúng tôi tối ưu 30% chi phí vận hành.", "The technology solution provided by the company helped us optimize operating costs by 30%."),
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Lê Hoàng C",
            role: fallback("Founder Startup XYZ", "Founder of XYZ"),
            content: fallback("Tiến độ công việc luôn được đảm bảo, thậm chí là hoàn thành trước thời hạn. Rất đáng tin cậy!", "Work progress is always guaranteed, even completed ahead of schedule. Very reliable!"),
            avatar: "https://randomuser.me/api/portraits/men/68.jpg"
        }
    ];

    return (
        <section className="testimonials-section section-padding">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">{fallback("Khách Hàng Nói Gì Về Chúng Tôi", "Client Testimonials")}</h2>
                    <div className="divider"></div>
                    <p className="section-subtitle">
                        {fallback("Sự hài lòng của khách hàng là thước đo thành công lớn nhất của chúng tôi.", "Customer satisfaction is our greatest measure of success.")}
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((item, idx) => (
                        <div className="testimonial-card" key={idx}>
                            <div className="testi-stars">
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                                <i className="ph-fill ph-star"></i>
                            </div>
                            <p className="testi-content">"{item.content}"</p>
                            <div className="testi-author">
                                <img src={item.avatar} alt={item.name} className="testi-avatar" />
                                <div className="testi-info">
                                    <h4>{item.name}</h4>
                                    <span>{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
