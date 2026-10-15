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

  const defaultServices: ServiceWithCategory[] = [
    {
      id: "demo-1",
      title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
      description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH.",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
      linkUrl: "#",
      order: 1,
      categoryId: "cat-inspection",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-inspection",
        slug: "kiem-dinh-an-toan",
        order: 1,
        isActive: true,
        isMenu: true,
        parentId: null,
        translations: JSON.stringify({
          vi: { title: "Kiểm định an toàn" },
          en: { title: "Safety Inspection" }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      translations: JSON.stringify({
        vi: {
          title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
          description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH."
        },
        en: {
          title: "Boilers & Water Heaters Inspection",
          description: "Periodic technical safety inspection and compliance testing for industrial boilers under national regulations."
        }
      })
    },
    {
      id: "demo-2",
      title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
      description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn.",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
      linkUrl: "#",
      order: 2,
      categoryId: "cat-inspection",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-inspection",
        slug: "kiem-dinh-an-toan",
        order: 1,
        isActive: true,
        isMenu: true,
        parentId: null,
        translations: JSON.stringify({
          vi: { title: "Kiểm định an toàn" },
          en: { title: "Safety Inspection" }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      translations: JSON.stringify({
        vi: {
          title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
          description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn."
        },
        en: {
          title: "Pressure Vessels & Gas Storage Tanks Inspection",
          description: "Hydrostatic testing, weld ultrasonic inspection, and maximum safe operating pressure verification."
        }
      })
    },
    {
      id: "demo-3",
      title: "Quan trắc Môi trường lao động định kỳ",
      description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất.",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
      linkUrl: "#",
      order: 1,
      categoryId: "cat-environment",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-environment",
        slug: "quan-trac-moi-truong",
        order: 2,
        isActive: true,
        isMenu: true,
        parentId: null,
        translations: JSON.stringify({
          vi: { title: "Quan trắc môi trường" },
          en: { title: "Environmental Monitoring" }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      translations: JSON.stringify({
        vi: {
          title: "Quan trắc Môi trường lao động định kỳ",
          description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất."
        },
        en: {
          title: "Workplace Environmental Monitoring",
          description: "Comprehensive measurement of microclimate, noise levels, illumination, dust, and toxic fumes across factories."
        }
      })
    },
    {
      id: "demo-4",
      title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
      description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP.",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      linkUrl: "#",
      order: 1,
      categoryId: "cat-training",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "cat-training",
        slug: "dao-tao-huan-luyen",
        order: 3,
        isActive: true,
        isMenu: true,
        parentId: null,
        translations: JSON.stringify({
          vi: { title: "Huấn luyện an toàn" },
          en: { title: "Safety Training" }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      translations: JSON.stringify({
        vi: {
          title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
          description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP."
        },
        en: {
          title: "Occupational Safety & Health Training (Groups 1 - 6)",
          description: "Standardized safety courses and official certification per governmental occupational safety regulations."
        }
      })
    }
  ];

  const activeServices = (services && services.length > 0) ? services : defaultServices;

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
            activeServices.reduce((acc, service) => {
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
              <div className="service-category-header">
                <div className="service-category-title-wrap">
                  <span className="service-category-indicator"></span>
                  <h3 className="service-category-title">{group.title}</h3>
                </div>
                <span className="service-category-count">
                  {group.items.length} {fallback("dịch vụ", "services")}
                </span>
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

                  let safeImageUrl = (service.imageUrl && service.imageUrl.trim() !== "")
                    ? service.imageUrl
                    : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop";

                  if (safeImageUrl.includes("photo-1504917599217")) {
                    safeImageUrl = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop";
                  }

                  return (
                    <div className="service-card" key={service.id} data-aos="fade-up">
                      <div className="service-image">
                        <span className="service-card-tag">{group.title}</span>
                        <Image
                          src={safeImageUrl}
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
                            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.6", margin: "0 0 10px 0" }}>
                              {displayDesc.length > 95 ? `${displayDesc.slice(0, 95)}...` : displayDesc}
                            </p>
                          )}
                          <div className="service-meta-pills">
                            <span className="service-pill">
                              <i className="ph-fill ph-seal-check"></i> {fallback("Chuẩn QCVN", "Certified")}
                            </span>
                            <span className="service-pill">
                              <i className="ph-fill ph-shield-check"></i> {fallback("Chính xác & Khách quan", "Objective & Precise")}
                            </span>
                          </div>
                        </div>
                        <Link href={service.linkUrl || "#"} className="service-link">
                          <span>{fallback("Xem chi tiết", "Learn More")}</span>
                          <span className="service-link-circle">
                            <i className="ph-bold ph-arrow-right"></i>
                          </span>
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
