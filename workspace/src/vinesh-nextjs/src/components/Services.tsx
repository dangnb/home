import Link from "next/link";
import Image from "next/image";
import { Service, Category } from "@prisma/client";

export type ServiceWithCategory = Service & {
  category?: Category | null;
};

interface ServicesProps {
  services: ServiceWithCategory[];
  settings?: Record<string, string>;
  lang: string;
}

export default function Services({ services, settings, lang }: ServicesProps) {
  const phone = settings?.phone || "0984 929 693";

  // Custom text for hardcoded sections
  const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;
  const sectionTitle = fallback("Dịch Vụ Của Chúng Tôi", "Our Services");
  const sectionSubtitle = fallback("Cung cấp các giải pháp chuyên nghiệp, đáp ứng các tiêu chuẩn khắt khe nhất.", "Providing professional solutions, meeting the strictest standards.");
  const ctaTitle = fallback("Bạn cần tư vấn chi tiết về dịch vụ?", "Need detailed consultation on services?");
  const ctaDesc = fallback("Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.", "Our team of experts is always ready to assist you 24/7.");
  const ctaCall = fallback("Gọi Ngay", "Call Now");

  return (
    <>
      <section id="services" className="services section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <span className="section-badge">
              <i className="ph-fill ph-shield-check"></i> {fallback("Lĩnh Vực Hoạt Động", "Core Capabilities")}
            </span>
            <h2 className="section-title">{sectionTitle}</h2>
            <div className="divider"></div>
            <p className="section-subtitle">{sectionSubtitle}</p>
          </div>

          {Object.entries(
            services.reduce((acc, service) => {
              let catTitle = service.category?.slug || fallback("Bài viết khác", "Other Posts");
              if (service.category && service.category.translations) {
                try {
                  const t = JSON.parse(service.category.translations);
                  if (t[lang] && t[lang].title) catTitle = t[lang].title;
                  else if (t['vi'] && t['vi'].title) catTitle = t['vi'].title;
                } catch (_e) { }
              }
              const key = service.categoryId || 'default';
              if (!acc[key]) acc[key] = { title: catTitle, items: [] };
              acc[key].items.push(service);
              return acc;
            }, {} as Record<string, { title: string; items: ServiceWithCategory[] }>)
          ).map(([catId, group]: [string, { title: string; items: ServiceWithCategory[] }]) => (
            <div key={catId} style={{ marginBottom: "60px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "26px" }}>
                <span style={{ width: "6px", height: "24px", background: "var(--brand-green)", borderRadius: "99px" }}></span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--primary-color)", margin: 0 }}>
                  {group.title}
                </h3>
              </div>
              <div className="services-grid">
                {group.items.map((service) => {
                  let displayTitle = service.title;
                  let displayDesc = service.description || "";
                  if (lang !== "vi" && service.translations) {
                    try {
                      const t = JSON.parse(service.translations);
                      if (t[lang]?.title) displayTitle = t[lang].title;
                      if (t[lang]?.description) displayDesc = t[lang].description;
                    } catch (_e) { }
                  }

                  return (
                    <div className="service-card" key={service.id} data-aos="fade-up">
                      <div className="service-image">
                        <Image
                          src={service.imageUrl}
                          alt={displayTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="service-overlay"></div>
                      </div>
                      <div className="service-content">
                        <div>
                          <h4 className="service-title">
                            <Link href={service.linkUrl || "#"}>{displayTitle}</Link>
                          </h4>
                          {displayDesc && (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 10px 0" }}>
                              {displayDesc.length > 90 ? `${displayDesc.slice(0, 90)}...` : displayDesc}
                            </p>
                          )}
                        </div>
                        <Link href={service.linkUrl || "#"} className="service-link">
                          <span>{fallback("Xem chi tiết", "Learn More")}</span>
                          <i className="ph-bold ph-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section">
        <div className="container cta-inner" data-aos="zoom-in">
          <div className="cta-text">
            <h2>{ctaTitle}</h2>
            <p>{ctaDesc}</p>
          </div>
          <div className="cta-action">
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-light btn-large">
              <i className="ph ph-phone"></i> {ctaCall}: {phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
