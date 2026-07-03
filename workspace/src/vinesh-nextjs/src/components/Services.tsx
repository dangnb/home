import Link from "next/link";
import Image from "next/image";
import { Service } from "@prisma/client";

interface ServicesProps {
  services: Service[];
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
            <h2 className="section-title">{sectionTitle}</h2>
            <div className="divider"></div>
            <p className="section-subtitle">{sectionSubtitle}</p>
          </div>

          {Object.entries(
            services.reduce((acc, service) => {
              let catTitle = (service as any).category?.slug || fallback("Bài viết khác", "Other Posts");
              if ((service as any).category && (service as any).category.translations) {
                try {
                  const t = JSON.parse((service as any).category.translations);
                  if (t[lang] && t[lang].title) catTitle = t[lang].title;
                  else if (t['vi'] && t['vi'].title) catTitle = t['vi'].title;
                } catch (e) { }
              }
              const key = (service as any).categoryId || 'default';
              if (!acc[key]) acc[key] = { title: catTitle, items: [] };
              acc[key].items.push(service);
              return acc;
            }, {} as Record<string, { title: string; items: Service[] }>)
          ).map(([catId, group]: [string, { title: string; items: Service[] }]) => (
            <div key={catId} style={{ marginBottom: "60px" }}>
              <h3 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "30px", borderLeft: "4px solid #8cc63f", paddingLeft: "15px" }}>
                {group.title}
              </h3>
              <div className="services-grid">
                {group.items.map((service) => {
                  let displayTitle = service.title;
                  if (lang !== "vi" && service.translations) {
                    try {
                      const t = JSON.parse(service.translations);
                      if (t[lang] && t[lang].title) {
                        displayTitle = t[lang].title;
                      }
                    } catch (e) { }
                  }

                  return (
                    <div className="service-card" key={service.id} data-aos="fade-up">
                      <div className="service-image" style={{ position: "relative", overflow: "hidden" }}>
                        <Image
                          src={service.imageUrl}
                          alt={displayTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="service-overlay"></div>
                      </div>
                      <div className="service-content">
                        <h4 className="service-title" style={{ margin: 0, fontSize: "1.25rem" }}>
                          <Link href={service.linkUrl || "#"}>{displayTitle}</Link>
                        </h4>
                        <div className="service-divider"></div>
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
