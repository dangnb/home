interface PartnersProps {
    lang: string;
}

export default function Partners({ lang }: PartnersProps) {
    const fallback = (vi: string, en: string) => lang === "vi" ? vi : en;

    // Placeholder partners
    const partners = [
        { name: "Partner 1", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Partner 2", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
        { name: "Partner 3", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%(2012%).svg" },
        { name: "Partner 4", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
        { name: "Partner 5", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
    ];

    return (
        <section className="partners-section" style={{ padding: "40px 0", borderTop: "1px solid #eee" }}>
            <div className="container">
                <h3 className="text-center" style={{ marginBottom: "30px", color: "var(--text-light)", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {fallback("Đối tác & Khách hàng tiêu biểu", "Our Trusted Partners & Clients")}
                </h3>
                <div className="partners-flex">
                    {partners.map((partner, idx) => (
                        <div className="partner-logo" key={idx}>
                            <img src={partner.url} alt={partner.name} style={{ height: "40px", objectFit: "contain", filter: "grayscale(100%)", opacity: 0.6, transition: "var(--transition)" }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
