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
        <section className="partners-section" style={{ padding: "40px 0", borderTop: "1px solid #eee" }}>
            <div className="container">
                <h3 className="text-center" style={{ marginBottom: "30px", color: "var(--text-light)", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {fallback("Đối tác & Khách hàng tiêu biểu", "Our Trusted Partners & Clients")}
                </h3>
                <div className="partners-flex">
                    {partners.map((partner, idx) => (
                        <div className="partner-logo" key={idx}>
                            <img src={partner.url} alt={partner.name} width={150} height={40} loading="lazy" decoding="async" style={{ height: "40px", objectFit: "contain", filter: "grayscale(100%)", opacity: 0.6, transition: "var(--transition)" }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
