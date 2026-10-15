import Link from "next/link";
import Image from "next/image";

interface AboutUsProps {
    settings?: Record<string, string>;
    lang: string;
}

export default function AboutUs({ settings, lang }: AboutUsProps) {
    const isVi = lang === "vi";
    const fallback = (vi: string, en: string) => isVi ? vi : en;

    const aboutTitle = isVi
        ? (settings?.aboutTitle || "Về Chúng Tôi")
        : (settings?.[`aboutTitle_${lang}`] || "About Us");

    const aboutSubtitle = isVi
        ? (settings?.aboutSubtitle || "Chúng tôi là đối tác tin cậy trong sự phát triển của bạn")
        : (settings?.[`aboutSubtitle_${lang}`] || "We are a trusted partner in your growth");

    const aboutDesc1 = isVi
        ? (settings?.aboutDesc1 || "Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào cung cấp các giải pháp tối ưu giúp doanh nghiệp của bạn phát triển bền vững.")
        : (settings?.[`aboutDesc1_${lang}`] || "With over 10 years of experience in the industry, we proudly provide optimal solutions to help your business grow sustainably.");

    const aboutDesc2 = isVi
        ? (settings?.aboutDesc2 || "Đội ngũ chuyên gia của chúng tôi luôn tận tâm, sáng tạo và cập nhật công nghệ mới nhất để mang lại giá trị cao nhất cho khách hàng. Sự thành công của khách hàng chính là thước đo thành công của chúng tôi.")
        : (settings?.[`aboutDesc2_${lang}`] || "Our team of experts is dedicated, creative, and up-to-date with the latest technologies to bring maximum value to our clients. Your success is our measure of success.");

    return (
        <section id="about" className="about-section section-padding">
            <div className="container">
                <div className="about-grid">
                    <div className="about-image-wrapper" style={{ position: "relative" }} data-aos="fade-right">
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop"
                            alt="About us"
                            fill
                            sizes="(max-width: 900px) 100vw, 50vw"
                            style={{ objectFit: "cover", borderRadius: "20px" }}
                            loading="lazy"
                        />
                        <div className="about-experience">
                            <div className="exp-icon-circle">
                                <i className="ph-fill ph-trophy"></i>
                            </div>
                            <div>
                                <div className="exp-years">10+</div>
                                <div className="exp-label">{fallback("Năm Kinh Nghiệm Uy Tín", "Years Experience")}</div>
                            </div>
                        </div>
                    </div>
                    <div className="about-content" data-aos="fade-left">
                        <span className="about-subtitle-top">
                            <i className="ph-fill ph-sparkle"></i> {fallback("Giới thiệu WebCare", "About WebCare")}
                        </span>
                        <h2 className="section-title" style={{ marginBottom: "16px", textAlign: "left" }}>{aboutTitle}</h2>
                        <div className="divider" style={{ margin: "0 0 22px 0" }}></div>
                        <h3 className="about-subtitle">{aboutSubtitle}</h3>
                        <p className="about-text">{aboutDesc1}</p>
                        <p className="about-text">{aboutDesc2}</p>

                        <ul className="about-features">
                            <li>
                                <span className="about-feature-icon"><i className="ph-fill ph-check-circle"></i></span>
                                <span>{fallback("Chất lượng tiêu chuẩn cao", "Top Quality Standards")}</span>
                            </li>
                            <li>
                                <span className="about-feature-icon"><i className="ph-fill ph-users-three"></i></span>
                                <span>{fallback("Đội ngũ chuyên nghiệp", "Professional Experts")}</span>
                            </li>
                            <li>
                                <span className="about-feature-icon"><i className="ph-fill ph-headset"></i></span>
                                <span>{fallback("Hỗ trợ kỹ thuật 24/7", "24/7 Technical Support")}</span>
                            </li>
                            <li>
                                <span className="about-feature-icon"><i className="ph-fill ph-shield-check"></i></span>
                                <span>{fallback("Chi phí tối ưu & minh bạch", "Optimal & Fair Pricing")}</span>
                            </li>
                        </ul>

                        <Link href={`/${lang}/category/ve-webcare`} className="btn btn-primary" style={{ marginTop: "32px" }}>
                            {fallback("Tìm hiểu thêm", "Learn More")} <i className="ph ph-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
