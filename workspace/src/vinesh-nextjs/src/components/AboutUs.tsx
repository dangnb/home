import Link from "next/link";
import Image from "next/image";
import { Service } from "@prisma/client";

interface AboutUsProps {
    settings?: Record<string, string>;
    lang: string;
}

export default function AboutUs({ settings, lang }: AboutUsProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    const aboutTitle = settings?.aboutTitle || fallback("Về Chúng Tôi", "About Us");
    const aboutSubtitle = settings?.aboutSubtitle || fallback("Chúng tôi là đối tác tin cậy trong sự phát triển của bạn", "We are a trusted partner in your growth");
    const aboutDesc1 = settings?.aboutDesc1 || fallback(
        "Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào cung cấp các giải pháp tối ưu giúp doanh nghiệp của bạn phát triển bền vững.",
        "With over 10 years of experience in the industry, we proudly provide optimal solutions to help your business grow sustainably."
    );
    const aboutDesc2 = settings?.aboutDesc2 || fallback(
        "Đội ngũ chuyên gia của chúng tôi luôn tận tâm, sáng tạo và cập nhật công nghệ mới nhất để mang lại giá trị cao nhất cho khách hàng. Sự thành công của khách hàng chính là thước đo thành công của chúng tôi.",
        "Our team of experts is dedicated, creative, and up-to-date with the latest technologies to bring maximum value to our clients. Your success is our measure of success."
    );

    return (
        <section id="about" className="about-section section-padding">
            <div className="container">
                <div className="about-grid">
                    <div className="about-image-wrapper" style={{ position: "relative" }}>
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop"
                            alt="About us"
                            fill
                            style={{ objectFit: "cover", borderRadius: "10px" }}
                            loading="lazy"
                        />
                        <div className="about-experience">
                            <div className="exp-years">10+</div>
                            <div>{fallback("Năm Kinh Nghiệm", "Years Exp")}</div>
                        </div>
                    </div>
                    <div className="about-content">
                        <h4 className="about-subtitle-top">{fallback("Giới thiệu", "Introduction")}</h4>
                        <h2 className="section-title" style={{ marginBottom: "20px", textAlign: "left" }}>{aboutTitle}</h2>
                        <div className="divider" style={{ margin: "0 0 20px 0" }}></div>
                        <h3 className="about-subtitle">{aboutSubtitle}</h3>
                        <p className="about-text">{aboutDesc1}</p>
                        <p className="about-text">{aboutDesc2}</p>

                        <ul className="about-features">
                            <li><i className="ph ph-check-circle"></i> {fallback("Chất lượng hàng đầu", "Top Quality")}</li>
                            <li><i className="ph ph-check-circle"></i> {fallback("Đội ngũ chuyên nghiệp", "Professional Team")}</li>
                            <li><i className="ph ph-check-circle"></i> {fallback("Hỗ trợ 24/7", "24/7 Support")}</li>
                            <li><i className="ph ph-check-circle"></i> {fallback("Giá cả cạnh tranh", "Competitive Pricing")}</li>
                        </ul>

                        <Link href="/about" className="btn btn-primary" style={{ marginTop: "30px" }}>
                            {fallback("Tìm hiểu thêm", "Learn More")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
