import Image from "next/image";

interface PartnersProps {
    lang: string;
    settings?: Record<string, string>;
}

export default function Partners({ lang, settings }: PartnersProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    // Parse dynmic partners from settings
    let partners: { url: string; name: string }[] = [];
    if (settings?.partnerLogos && settings.partnerLogos.trim() !== '') {
        const urls = settings.partnerLogos.split('\n').map(u => u.trim()).filter(u => u !== '');
        partners = urls.map((url, i) => ({ url, name: `Partner ${i + 1}` }));
    } else {
        // Fallback placeholders if not configured
        partners = [
            { name: "Placeholder 1", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150&fit=crop" },
            { name: "Placeholder 2", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150&fit=crop" },
            { name: "Placeholder 3", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150&fit=crop" },
        ];
    }

    return (
        <section className="partners-section" style={{ padding: "60px 0", borderTop: "1px solid var(--border-light)" }}>
            <div className="container" data-aos="fade-up">
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <span className="section-badge" style={{ marginBottom: "8px" }}>
                        <i className="ph-fill ph-handshake"></i> {fallback("Đồng hành cùng phát triển", "Trusted Network")}
                    </span>
                    <h3 style={{ color: "var(--primary-color)", fontSize: "1.25rem", fontWeight: "700", margin: "8px 0 0 0" }}>
                        {fallback("Đối Tác & Khách Hàng Tiêu Biểu", "Our Trusted Partners & Clients")}
                    </h3>
                </div>
                <div className="partners-flex" data-aos="fade-up" data-aos-delay="150">
                    {partners.map((partner, idx) => (
                        <div className="partner-logo" key={idx}>
                            <Image src={partner.url} alt={partner.name} width={150} height={42} unoptimized style={{ height: "42px", objectFit: "contain", filter: "grayscale(100%)", opacity: 0.65, transition: "all 0.3s ease" }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
