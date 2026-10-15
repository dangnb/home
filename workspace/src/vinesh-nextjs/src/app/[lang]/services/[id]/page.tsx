export const revalidate = 60;

import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import "./ServiceDetail.css";

// Fallback demo services matching default seed
const defaultServices = [
  {
    id: "demo-1",
    title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
    description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH. Quy trình thử nghiệm áp lực cao, kiểm tra siêu âm khuyết tật và đánh giá van an toàn đảm bảo vận hành ổn định cho nhà máy.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    categoryTitleVi: "Kiểm định an toàn",
    categoryTitleEn: "Safety Inspection",
    categorySlug: "kiem-dinh-an-toan",
    translations: JSON.stringify({
      vi: {
        title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
        description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH. Quy trình thử nghiệm áp lực cao, kiểm tra siêu âm khuyết tật và đánh giá van an toàn đảm bảo vận hành ổn định cho nhà máy."
      },
      en: {
        title: "Boilers & Water Heaters Inspection",
        description: "Periodic technical safety inspection and compliance testing for industrial boilers under national regulations QCVN 01:2008/BLDTBXH. High-pressure testing and ultrasonic flaw detection."
      }
    })
  },
  {
    id: "demo-2",
    title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
    description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn theo quy chuẩn kỹ thuật quốc gia. Đảm bảo an toàn tuyệt đối cho người lao động và hệ thống đường ống công nghiệp.",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
    categoryTitleVi: "Kiểm định an toàn",
    categoryTitleEn: "Safety Inspection",
    categorySlug: "kiem-dinh-an-toan",
    translations: JSON.stringify({
      vi: {
        title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
        description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn theo quy chuẩn kỹ thuật quốc gia. Đảm bảo an toàn tuyệt đối cho người lao động và hệ thống đường ống công nghiệp."
      },
      en: {
        title: "Pressure Vessels & Gas Storage Tanks Inspection",
        description: "Hydrostatic testing, weld ultrasonic inspection, and maximum safe operating pressure verification under national safety standards."
      }
    })
  },
  {
    id: "demo-3",
    title: "Quan trắc Môi trường lao động định kỳ",
    description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất theo Thông tư 19/2016/TT-BYT. Lập hồ sơ vệ sinh lao động và đề xuất giải pháp cải thiện điều kiện làm việc.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    categoryTitleVi: "Quan trắc môi trường",
    categoryTitleEn: "Environmental Monitoring",
    categorySlug: "quan-trac-moi-truong",
    translations: JSON.stringify({
      vi: {
        title: "Quan trắc Môi trường lao động định kỳ",
        description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất theo Thông tư 19/2016/TT-BYT. Lập hồ sơ vệ sinh lao động và đề xuất giải pháp cải thiện điều kiện làm việc."
      },
      en: {
        title: "Workplace Environmental Monitoring",
        description: "Comprehensive measurement of microclimate, noise levels, illumination, dust, and toxic fumes across factories per ministry health circulars."
      }
    })
  },
  {
    id: "demo-4",
    title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
    description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP. Chương trình giảng dạy trực quan, thực hành thực tế với đội ngũ giảng viên giàu kinh nghiệm thực chiến.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    categoryTitleVi: "Huấn luyện an toàn",
    categoryTitleEn: "Safety Training",
    categorySlug: "dao-tao-huan-luyen",
    translations: JSON.stringify({
      vi: {
        title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
        description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP. Chương trình giảng dạy trực quan, thực hành thực tế với đội ngũ giảng viên giàu kinh nghiệm thực chiến."
      },
      en: {
        title: "Occupational Safety & Health Training (Groups 1 - 6)",
        description: "Standardized safety courses and official certification per governmental occupational safety regulations Decree 44/2016/ND-CP."
      }
    })
  }
];

export async function generateStaticParams() {
  const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } }).catch(() => []);
  const dbServices = await prisma.service.findMany({ select: { id: true } }).catch(() => []);

  const langs = activeLangs.length > 0 ? activeLangs.map(l => l.code) : ['vi', 'en'];
  const serviceIds = Array.from(new Set([
    ...dbServices.map(s => s.id),
    ...defaultServices.map(s => s.id)
  ]));

  const params: { lang: string; id: string }[] = [];
  for (const lang of langs) {
    for (const id of serviceIds) {
      params.push({ lang, id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const isVi = lang === "vi";

  let service = await prisma.service.findUnique({
    where: { id },
    include: { category: true }
  }).catch(() => null);

  let title = "Chi tiết Dịch vụ";
  let description = "Dịch vụ kỹ thuật chuyên nghiệp, kiểm định an toàn và quan trắc môi trường toàn diện của WebCare.";

  if (service) {
    title = service.title;
    description = service.description?.replace(/<[^>]+>/g, '').slice(0, 160) || description;
    if (!isVi && service.translations) {
      try {
        const t = JSON.parse(service.translations);
        if (t[lang]?.title) title = t[lang].title;
        if (t[lang]?.description) description = t[lang].description.replace(/<[^>]+>/g, '').slice(0, 160);
      } catch (_e) { }
    }
  } else {
    const demo = defaultServices.find(s => s.id === id);
    if (demo) {
      title = isVi ? demo.title : (JSON.parse(demo.translations).en?.title || demo.title);
      description = isVi ? demo.description : (JSON.parse(demo.translations).en?.description || demo.description);
    }
  }

  return {
    title: `${title} | WebCare`,
    description,
    openGraph: {
      title: `${title} - WebCare`,
      description,
      type: "article",
    }
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const isVi = lang === "vi";
  const fallback = (viText: string, enText: string) => isVi ? viText : enText;

  // Defensive queries
  const [dbService, dbRelated, dbCategories, settingsArray] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: { category: true }
    }).catch(() => null),

    prisma.service.findMany({
      where: { id: { not: id } },
      include: { category: true },
      take: 4,
      orderBy: { order: 'asc' }
    }).catch(() => []),

    prisma.category.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { order: 'asc' }
    }).catch(() => []),

    prisma.setting.findMany({ select: { key: true, value: true } }).catch(() => [])
  ]);

  const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
    acc[current.key] = current.value;
    return acc;
  }, {});

  const phone = settings.phone || "0984 929 693";
  const cleanPhone = phone.replace(/\s+/g, '');
  const zaloNumber = settings.zalo || cleanPhone;
  const zaloUrl = zaloNumber.startsWith("http") ? zaloNumber : `https://zalo.me/${zaloNumber.replace(/\s+/g, '')}`;

  // Resolve target service from DB or fallback demo
  let serviceData: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    categoryTitle: string;
    categorySlug: string;
    createdAt: Date;
  } | null = null;

  if (dbService) {
    let title = dbService.title;
    let description = dbService.description || "";
    let catTitle = fallback("Dịch vụ kỹ thuật", "Technical Services");

    if (!isVi && dbService.translations) {
      try {
        const t = JSON.parse(dbService.translations);
        if (t[lang]?.title) title = t[lang].title;
        if (t[lang]?.description) description = t[lang].description;
      } catch (_e) { }
    }

    if (dbService.category) {
      catTitle = dbService.category.slug;
      if (dbService.category.translations) {
        try {
          const ct = JSON.parse(dbService.category.translations);
          if (ct[lang]?.title) catTitle = ct[lang].title;
          else if (ct['vi']?.title) catTitle = ct['vi'].title;
        } catch (_e) { }
      }
    }

    let safeImg = (dbService.imageUrl && dbService.imageUrl.trim() !== "")
      ? dbService.imageUrl
      : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop";
    if (safeImg.includes("photo-1504917599217")) {
      safeImg = "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop";
    }

    serviceData = {
      id: dbService.id,
      title,
      description,
      imageUrl: safeImg,
      categoryTitle: catTitle,
      categorySlug: dbService.category?.slug || "dich-vu",
      createdAt: dbService.createdAt || new Date()
    };
  } else {
    // Try matching demo service
    const demo = defaultServices.find(s => s.id === id) || defaultServices[0];
    if (demo) {
      let title = demo.title;
      let description = demo.description;
      try {
        const dt = JSON.parse(demo.translations);
        if (!isVi && dt[lang]?.title) title = dt[lang].title;
        if (!isVi && dt[lang]?.description) description = dt[lang].description;
      } catch (_e) { }

      serviceData = {
        id: demo.id,
        title,
        description,
        imageUrl: demo.imageUrl,
        categoryTitle: isVi ? demo.categoryTitleVi : demo.categoryTitleEn,
        categorySlug: demo.categorySlug,
        createdAt: new Date()
      };
    }
  }

  if (!serviceData) {
    notFound();
  }

  // Determine if content is HTML from Rich Text Editor
  const isHtmlContent = /<[a-z][\s\S]*>/i.test(serviceData.description);

  // Format date display
  const publishDateStr = new Intl.DateTimeFormat(isVi ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(serviceData.createdAt);

  // Related services list
  const relatedList = dbRelated.length > 0 ? dbRelated : defaultServices.filter(s => s.id !== serviceData?.id).slice(0, 3);

  return (
    <main className="service-detail-wrapper">
      {/* HERO & BREADCRUMB SECTION */}
      <section className="service-detail-hero">
        <div className="container">
          <nav className="service-breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${lang}`}>{fallback("Trang chủ", "Home")}</Link>
            <span className="separator">/</span>
            <Link href={`/${lang}/category/${serviceData.categorySlug}`}>{serviceData.categoryTitle}</Link>
            <span className="separator">/</span>
            <span className="current">{serviceData.title}</span>
          </nav>

          <span className="service-header-badge">
            <i className="ph-fill ph-shield-check"></i> {serviceData.categoryTitle}
          </span>

          <h1 className="service-detail-title">{serviceData.title}</h1>

          <div className="service-meta-bar">
            <div className="service-meta-item">
              <i className="ph-fill ph-calendar"></i>
              <span>{publishDateStr}</span>
            </div>
            <div className="service-meta-item">
              <i className="ph-fill ph-user-circle"></i>
              <span>{fallback("Chuyên gia Kỹ thuật WebCare", "WebCare Technical Team")}</span>
            </div>
            <div className="service-meta-item">
              <i className="ph-fill ph-seal-check"></i>
              <span>{fallback("Đạt chuẩn QCVN / TCVN", "Compliant with QCVN / TCVN")}</span>
            </div>
            <div className="service-meta-item">
              <i className="ph-fill ph-clock"></i>
              <span>{fallback("4 phút đọc", "4 min read")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="service-detail-content">
        <div className="container">
          <div className="service-grid-layout">

            {/* LEFT: ARTICLE MAIN BODY */}
            <article className="service-main-card">
              <div className="service-featured-image">
                <Image
                  src={serviceData.imageUrl}
                  alt={serviceData.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* ARTICLE TEXT BODY */}
              <div className="service-article-body">
                {isHtmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: serviceData.description }} />
                ) : (
                  <>
                    <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "#1e293b", lineHeight: "1.8" }}>
                      {serviceData.description}
                    </p>

                    <h2>{fallback("1. Tổng quan & Tầm quan trọng", "1. Overview & Significance")}</h2>
                    <p>
                      {fallback(
                        "Trong quá trình vận hành nhà máy và cơ sở sản xuất công nghiệp, việc đảm bảo an toàn tuyệt đối cho thiết bị máy móc và môi trường làm việc của người lao động là yếu tố tiên quyết giúp doanh nghiệp phát triển bền vững và tuân thủ đầy đủ các quy định pháp luật hiện hành.",
                        "During the operation of industrial factories and facilities, ensuring absolute safety for equipment and the working environment is an essential prerequisite for sustainable development and full regulatory compliance."
                      )}
                    </p>
                    <p>
                      {fallback(
                        "WebCare tự hào cung cấp dịch vụ kỹ thuật toàn diện, với quy trình đánh giá nghiêm ngặt, sử dụng trang thiết bị đo kiểm hiện đại được hiệu chuẩn định kỳ tại các viện đo lường chuyên ngành hàng đầu.",
                        "WebCare proudly provides comprehensive technical services with rigorous evaluation procedures, utilizing modern testing equipment periodically calibrated at leading national metrology institutes."
                      )}
                    </p>

                    {/* 4-STEP STANDARDIZED PROCEDURE */}
                    <div className="service-callout-box">
                      <div className="service-callout-title">
                        <i className="ph-fill ph-flow-arrow" style={{ fontSize: "22px" }}></i>
                        <span>{fallback("Quy trình 4 bước thực hiện chuẩn hóa", "4-Step Standardized Procedure")}</span>
                      </div>
                      <div className="service-steps-list">
                        <div className="service-step-card">
                          <div className="service-step-number">1</div>
                          <div className="service-step-info">
                            <h4>{fallback("Khảo sát & Lập phương án", "Survey & Planning")}</h4>
                            <p>{fallback("Đánh giá hiện trạng kỹ thuật và xây dựng kế hoạch thực hiện tối ưu.", "Assess site status and draft optimal execution plan.")}</p>
                          </div>
                        </div>

                        <div className="service-step-card">
                          <div className="service-step-number">2</div>
                          <div className="service-step-info">
                            <h4>{fallback("Đo kiểm & Thử nghiệm", "Testing & Inspection")}</h4>
                            <p>{fallback("Áp dụng thiết bị chuyên dụng kiểm tra trực tiếp theo quy chuẩn.", "Deploy certified gear for precise measurement and testing.")}</p>
                          </div>
                        </div>

                        <div className="service-step-card">
                          <div className="service-step-number">3</div>
                          <div className="service-step-info">
                            <h4>{fallback("Đánh giá & Lập biên bản", "Evaluation & Report")}</h4>
                            <p>{fallback("Tổng hợp dữ liệu, phân tích khuyết tật và lập biên bản chính thức.", "Analyze test results and compile official evaluation records.")}</p>
                          </div>
                        </div>

                        <div className="service-step-card">
                          <div className="service-step-number">4</div>
                          <div className="service-step-info">
                            <h4>{fallback("Cấp chứng nhận / Thẻ an toàn", "Certification Issuance")}</h4>
                            <p>{fallback("Bàn giao hồ sơ pháp lý hoàn chỉnh và tem chứng nhận hợp chuẩn.", "Deliver full legal dossiers and regulatory compliance stamps.")}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2>{fallback("2. Lợi ích khi lựa chọn WebCare", "2. Advantages of Choosing WebCare")}</h2>
                    <ul>
                      <li>
                        <strong>{fallback("Đội ngũ chuyên gia được cấp phép:", "Licensed Expert Team:")}</strong>{" "}
                        {fallback("100% kiểm định viên và kỹ sư đều có chứng chỉ hành nghề do Bộ quản lý ngành cấp, giàu kinh nghiệm giải quyết các ca kỹ thuật phức tạp.", "100% of inspectors hold government-issued practicing licenses with vast field experience.")}
                      </li>
                      <li>
                        <strong>{fallback("Hồ sơ pháp lý vững chắc:", "Robust Legal Compliance:")}</strong>{" "}
                        {fallback("Giúp doanh nghiệp hoàn toàn yên tâm trước các đợt thanh tra, kiểm tra của cơ quan nhà nước về an toàn vệ sinh lao động và bảo vệ môi trường.", "Guarantees complete readiness for regulatory inspections on occupational safety and environment.")}
                      </li>
                      <li>
                        <strong>{fallback("Tối ưu hóa chi phí & thời gian:", "Cost & Time Efficiency:")}</strong>{" "}
                        {fallback("Quy trình tinh gọn, hỗ trợ xử lý linh hoạt giúp giảm thiểu thời gian gián đoạn dây chuyền sản xuất của khách hàng.", "Streamlined workflow minimizes factory downtime while optimizing client operational expenses.")}
                      </li>
                    </ul>

                    <blockquote>
                      {fallback(
                        "“An toàn của người lao động và sự an tâm của doanh nghiệp là kim chỉ nam trong mọi dịch vụ kỹ thuật mà WebCare cung cấp.”",
                        "“Worker safety and enterprise peace of mind are the guiding principles in every technical service WebCare delivers.”"
                      )}
                    </blockquote>
                  </>
                )}
              </div>

              {/* FOOTER ACTIONS & TAGS */}
              <div className="service-footer-actions">
                <div className="service-tags-wrap">
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Tags:</span>
                  <span className="service-tag">#{serviceData.categorySlug}</span>
                  <span className="service-tag">#WebCare</span>
                  <span className="service-tag">#QCVN</span>
                  <span className="service-tag">#AnToan</span>
                </div>

                <Link href={`/${lang}/lien-he`} className="btn btn-primary" style={{ padding: "10px 22px", fontSize: "14px", textDecoration: "none" }}>
                  <i className="ph-fill ph-paper-plane-tilt"></i> {fallback("Đăng Ký Tư Vấn Ngay", "Request Consultation")}
                </Link>
              </div>
            </article>

            {/* RIGHT SIDEBAR */}
            <aside className="service-sidebar">

              {/* FAST CONSULTATION BOX */}
              <div className="service-widget service-consult-widget">
                <h3 className="service-widget-title">
                  <i className="ph-fill ph-headset"></i> {fallback("Tư Vấn Nhanh 24/7", "Quick Support 24/7")}
                </h3>
                <p>
                  {fallback(
                    "Quý khách cần giải đáp kỹ thuật hoặc báo giá dịch vụ? Hãy liên hệ ngay với đội ngũ chuyên gia WebCare.",
                    "Need technical assistance or a service quote? Connect with WebCare specialists now."
                  )}
                </p>

                <div className="sidebar-contact-btns">
                  <a href={`tel:${cleanPhone}`} className="sidebar-btn-call">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{phone}</span>
                  </a>

                  <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="sidebar-btn-zalo">
                    <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="16" fill="#ffffff" />
                      <text x="18" y="22" textAnchor="middle" fill="#0068FF" fontSize="11" fontWeight="900" fontFamily="sans-serif">Zalo</text>
                    </svg>
                    <span>{fallback("Chat Zalo Ngay", "Chat on Zalo")}</span>
                  </a>
                </div>
              </div>

              {/* RELATED SERVICES WIDGET */}
              <div className="service-widget">
                <h3 className="service-widget-title">
                  <i className="ph-fill ph-sparkle"></i> {fallback("Dịch Vụ Liên Quan", "Related Services")}
                </h3>
                <div className="service-related-list">
                  {relatedList.map((rel: any) => {
                    let relTitle = rel.title;
                    if (!isVi && rel.translations) {
                      try {
                        const t = JSON.parse(rel.translations);
                        if (t[lang]?.title) relTitle = t[lang].title;
                      } catch (_e) { }
                    }
                    const relImg = (rel.imageUrl && !rel.imageUrl.includes("photo-1504917599217"))
                      ? rel.imageUrl
                      : "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop";

                    const relUrl = (rel.linkUrl && rel.linkUrl !== "#" && rel.linkUrl.trim() !== "")
                      ? rel.linkUrl
                      : `/${lang}/services/${rel.id}`;

                    return (
                      <Link href={relUrl} key={rel.id} className="related-item">
                        <div className="related-thumb">
                          <Image src={relImg} alt={relTitle} fill style={{ objectFit: "cover" }} sizes="72px" />
                        </div>
                        <div className="related-info">
                          <h4>{relTitle}</h4>
                          <span>{fallback("Xem chi tiết", "Learn more")} &rarr;</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* CATEGORIES NAVIGATION WIDGET */}
              {dbCategories.length > 0 && (
                <div className="service-widget">
                  <h3 className="service-widget-title">
                    <i className="ph-fill ph-list-dashes"></i> {fallback("Lĩnh Vực Hoạt Động", "Categories")}
                  </h3>
                  <ul className="service-cat-list">
                    {dbCategories.map(cat => {
                      let cTitle = cat.slug;
                      if (cat.translations) {
                        try {
                          const ct = JSON.parse(cat.translations);
                          if (ct[lang]?.title) cTitle = ct[lang].title;
                          else if (ct['vi']?.title) cTitle = ct['vi'].title;
                        } catch (_e) { }
                      }
                      const isCurrentCat = cat.slug === serviceData?.categorySlug;
                      return (
                        <li key={cat.id}>
                          <Link href={`/${lang}/category/${cat.slug}`} className={`service-cat-link ${isCurrentCat ? "active" : ""}`}>
                            <span>{cTitle}</span>
                            <i className="ph ph-caret-right" style={{ fontSize: "12px" }}></i>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
