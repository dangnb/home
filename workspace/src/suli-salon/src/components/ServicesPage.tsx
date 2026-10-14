"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ServiceData, CategoryData } from "@/lib/db";
import { getServiceImageFallback } from "@/lib/service-images";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath, getLocalizedText, getLocalizedPrice } from "@/lib/i18n/routes";

/* ─────────────────────────────────────────────────────── */
/* Reveal Hook                                              */
/* ─────────────────────────────────────────────────────── */
function useReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const delay = parseInt(e.target.getAttribute("data-delay") || "0");
                        setTimeout(() => e.target.classList.add("is-visible"), delay);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

/* ─────────────────────────────────────────────────────── */
/* Service Row Component                                    */
/* ─────────────────────────────────────────────────────── */
type ServiceItem = { name: string; price: string; duration: string; popular: boolean };

function ServiceRow({ item, index }: { item: ServiceItem; index: number }) {
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";
    const [hov, setHov] = useState(false);
    const bookingBase = getLocalizedPath(locale, "booking");
    const bookUrl = `${bookingBase}?service=${encodeURIComponent(item.name)}`;

    return (
        <div
            className="service-row reveal"
            data-delay={String(index * 50)}
            onMouseOver={() => setHov(true)}
            onMouseOut={() => setHov(false)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 0",
                borderBottom: "1px solid #EAE5DC",
                gap: 16,
                transition: "padding .25s",
                paddingLeft: hov ? 12 : 0,
            }}
        >
            {/* Left */}
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 600, color: "#2E2E2E" }}>{item.name}</span>
                    {item.popular && (
                        <span style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", fontSize: 9, fontFamily: "Montserrat,sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2 }}>
                            {isEn ? "Featured" : "Nổi bật"}
                        </span>
                    )}
                </div>
                <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA" }}>⏱ {item.duration}</span>
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#C2A979", minWidth: 90, textAlign: "right" }}>{item.price}</span>
                <Link
                    href={bookUrl}
                    style={{
                        display: "inline-block",
                        background: hov ? "linear-gradient(135deg,#C2A979,#a08040)" : "transparent",
                        color: hov ? "#fff" : "#C2A979",
                        border: "1.5px solid #C2A979",
                        padding: "10px 22px",
                        borderRadius: 8,
                        fontFamily: "Montserrat,sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "all .3s",
                        whiteSpace: "nowrap",
                        boxShadow: hov ? "0 4px 16px rgba(194,169,121,.3)" : "none",
                    }}
                >
                    {dictionary.nav.booking} →
                </Link>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Services Page                                            */
/* ─────────────────────────────────────────────────────── */
export default function ServicesPage({ services, categories }: { services: ServiceData[]; categories: CategoryData[] }) {
    useReveal();
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";
    const bookingHref = getLocalizedPath(locale, "booking");
    const contactHref = getLocalizedPath(locale, "contact");

    const uiCategories = categories.map((c) => {
        const catServices = services.filter((s) => s.categoryId === c.id);
        const localizedLabel = getLocalizedText(c.label, locale);
        const icon = "✦";

        const fallbackImage = getServiceImageFallback(`${c.slug} ${c.label}`);
        const serviceImage = catServices.find((service) => service.image.trim())?.image;

        return {
            id: c.id,
            label: localizedLabel,
            icon,
            img: serviceImage || fallbackImage,
            fallbackImage,
            desc: getLocalizedText(c.description, locale) || (isEn ? "Experience our premium treatments crafted with intention." : "Trải nghiệm các liệu trình chăm sóc cao cấp được thực hiện tận tâm."),
            items: catServices.map((s, i) => ({
                name: getLocalizedText(s.name, locale),
                price: getLocalizedPrice(s.price, locale),
                duration: s.duration + (isEn ? " min" : " phút"),
                popular: i === 0,
            })),
        };
    });

    const fallbackCategories = [
        { id: "manicure", slug: "manicure", label: isEn ? "Manicure" : "Chăm sóc móng tay", description: isEn ? "Classic and gel manicures, tailored to a polished finish." : "Dịch vụ chăm sóc và sơn móng nghệ thuật cao cấp." },
        { id: "pedicure", slug: "pedicure", label: isEn ? "Pedicure" : "Chăm sóc móng chân", description: isEn ? "Restorative foot care for lasting comfort and confidence." : "Chăm sóc và phục hồi gót chân, mang lại cảm giác thư thái." },
        { id: "nail-art", slug: "nail-art", label: isEn ? "Nail Art" : "Thiết kế móng nghệ thuật", description: isEn ? "Creative, custom designs made to express your style." : "Thiết kế móng theo phong cách riêng, sáng tạo và tinh tế." },
        { id: "extensions", slug: "extensions", label: isEn ? "Extensions" : "Đắp móng & Nối móng", description: isEn ? "Natural-looking length and strength, crafted with precision." : "Nối móng đắp gel tự nhiên, bền đẹp và nhẹ nhàng." },
        { id: "care", slug: "nail-care", label: isEn ? "Nail Care" : "Phục hồi móng chuyên sâu", description: isEn ? "Targeted treatments to repair, nourish, and protect your nails." : "Liệu trình phục hồi móng yếu hư tổn với dưỡng chất an toàn." },
    ];

    const displayCategories = uiCategories.length > 0 ? uiCategories : fallbackCategories.map((category) => ({
        id: category.id,
        label: category.label,
        icon: "✦",
        img: getServiceImageFallback(`${category.slug} ${category.label}`),
        fallbackImage: getServiceImageFallback(`${category.slug} ${category.label}`),
        desc: category.description,
        items: [],
    }));

    const [activeId, setActiveId] = useState(displayCategories[0].id);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);

    const activeCat = displayCategories.find((c) => c.id === activeId) || displayCategories[0];
    const catImgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 12;
            const my = (e.clientY / window.innerHeight - 0.5) * 8;
            if (titleRef.current) titleRef.current.style.transform = `translate(${-mx * 0.4}px,${-my * 0.4}px)`;
            if (subRef.current) subRef.current.style.transform = `translate(${-mx * 0.2}px,${-my * 0.2}px)`;
        };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, []);

    // Fade image on category change
    const handleCatChange = (id: string) => {
        if (catImgRef.current) catImgRef.current.style.opacity = "0";
        setTimeout(() => {
            setActiveId(id);
            if (catImgRef.current) catImgRef.current.style.opacity = "1";
        }, 250);
    };

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 1023px) {
          .services-content { padding-block: 64px 80px !important; }
          .services-content__inner, .services-process__inner { padding-inline: var(--public-gutter) !important; }
          .services-content__layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          .services-category-image { height: min(110vw, 520px) !important; }
          .services-process__grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 12px !important; }
        }

        @media (max-width: 600px) {
          .services-content { padding-block: 52px 64px !important; }
          .services-category-tabs { flex-wrap: nowrap !important; overflow-x: auto; margin-inline: calc(-1 * var(--public-gutter)) !important; padding-inline: var(--public-gutter) !important; scrollbar-width: thin; }
          .services-category-tabs button { flex: 0 0 auto; padding: 14px 18px !important; font-size: 11px !important; min-height: 48px; }
          .services-content__layout { gap: 38px !important; }
          .services-category-image { height: min(116vw, 420px) !important; }
          .service-row { align-items: flex-start !important; flex-direction: column; padding: 18px 0 !important; }
          .service-row > div:last-child { width: 100%; justify-content: space-between; gap: 12px !important; }
          .service-row > div:last-child span { min-width: 0 !important; font-size: 18px !important; }
          .service-row button { min-height: 44px; padding: 10px 16px !important; }
          .services-consultation { align-items: flex-start !important; flex-direction: column; padding: 22px !important; }
          .services-consultation a, .services-consultation button { width: 100%; }
          .services-process { padding-block: 60px !important; }
          .services-process__grid { grid-template-columns: 1fr !important; gap: 4px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.is-visible { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

            {/* ════════════════════════════════════════ */}
            {/* HERO                                     */}
            {/* ════════════════════════════════════════ */}
            <section style={{ minHeight: "46vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F1EA", paddingTop: 110, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -120, right: -120, width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(194,169,121,.12)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(194,169,121,.09)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        {isEn ? "Our Signature Offerings" : "Dịch vụ của chúng tôi"}
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,6vw,76px)", fontWeight: 700, color: "#2E2E2E", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em", fontStyle: "italic", transition: "transform .12s ease-out" }}
                    >
                        {dictionary.nav.services}
                    </h1>
                    <p
                        ref={subRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", maxWidth: 500, margin: "0 auto", transition: "transform .12s ease-out" }}
                    >
                        {isEn
                            ? "Every service is crafted with intention — premium care, transparent pricing, and zero compromise on quality."
                            : "Mỗi dịch vụ được thực hiện chỉn chu — chăm sóc cao cấp, giá minh bạch và không thỏa hiệp về chất lượng."}
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/* CATEGORY TABS + CONTENT                  */}
            {/* ════════════════════════════════════════ */}
            <section className="services-content" style={{ background: "#FDFBF7", padding: "80px 0 100px" }}>
                <div className="services-content__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

                    {/* Category Tabs */}
                    <div className="services-category-tabs reveal" style={{ display: "flex", gap: 0, marginBottom: 60, borderBottom: "1.5px solid #EAE5DC", flexWrap: "wrap" }}>
                        {displayCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCatChange(cat.id)}
                                style={{
                                    padding: "16px 32px",
                                    fontFamily: "Montserrat,sans-serif",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: activeId === cat.id ? "#C2A979" : "#999",
                                    borderBottom: activeId === cat.id ? "2.5px solid #C2A979" : "2.5px solid transparent",
                                    marginBottom: "-1.5px",
                                    transition: "all .3s",
                                }}
                            >
                                <span style={{ marginRight: 8 }}>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Two-column layout: image left, list right */}
                    <div className="services-content__layout" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "start" }}>

                        {/* Left: category image + desc */}
                        <div className="reveal">
                            <div className="services-category-image" style={{ position: "relative", height: 480, overflow: "hidden", marginBottom: 24, borderRadius: 18, boxShadow: "0 16px 40px -10px rgba(0,0,0,.1)" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={catImgRef}
                                    src={activeCat.img}
                                    alt={activeCat.label}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity .25s ease, transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                    onError={(e) => {
                                        const image = e.currentTarget;
                                        if (image.src !== new URL(activeCat.fallbackImage, window.location.origin).href) {
                                            image.src = activeCat.fallbackImage;
                                        }
                                    }}
                                />
                                {/* Gold bar accent */}
                                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#C2A979,#a08040)" }} />
                            </div>

                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                                {activeCat.label}
                            </div>
                            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 24px", lineHeight: 1.5 }}>
                                {activeCat.desc}
                            </p>

                            {/* Stats pills */}
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <div style={{ background: "#F4F1EA", padding: "7px 18px", borderRadius: 20, fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#6B6B6B", border: "1px solid rgba(194, 169, 121, 0.2)" }}>
                                    {activeCat.items.length} {isEn ? "services" : "dịch vụ"}
                                </div>
                                <div style={{ background: "#F4F1EA", padding: "7px 18px", borderRadius: 20, fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#6B6B6B", border: "1px solid rgba(194, 169, 121, 0.2)" }}>
                                    {activeCat.items.filter((i) => i.popular).length} {isEn ? "featured" : "nổi bật"}
                                </div>
                            </div>
                        </div>

                        {/* Right: service list */}
                        <div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 6 }}>
                                {isEn ? "Service Menu" : "Danh sách dịch vụ"}
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 8px" }}>{activeCat.label}</h2>
                            <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#C2A979,#a08040)", marginBottom: 32 }} />

                            {activeCat && activeCat.items.map((item, i) => (
                                <ServiceRow key={item.name} item={item} index={i} />
                            ))}
                            {activeCat && activeCat.items.length === 0 && (
                                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#888" }}>
                                    {isEn ? "No services available in this category yet." : "Danh mục này chưa có dịch vụ."}
                                </p>
                            )}

                            {/* Bottom CTA */}
                            <div className="services-consultation" style={{ marginTop: 36, padding: "28px", background: "#F4F1EA", borderRadius: 16, border: "1px solid rgba(194, 169, 121, 0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                                <div>
                                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", marginBottom: 4 }}>
                                        {isEn ? "Not sure what to choose?" : "Bạn chưa biết chọn gói nào?"}
                                    </div>
                                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#888" }}>
                                        {isEn ? "Our team would love to help you decide." : "Đội ngũ chuyên viên Mộc Salon luôn sẵn sàng tư vấn chu đáo."}
                                    </div>
                                </div>
                                <Link
                                    href={contactHref}
                                    style={{
                                        display: "inline-block",
                                        background: "#2E2E2E",
                                        color: "#fff",
                                        padding: "14px 28px",
                                        borderRadius: 8,
                                        fontFamily: "Montserrat,sans-serif",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                        whiteSpace: "nowrap",
                                        transition: "all .3s ease",
                                    }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "#2E2E2E"; }}
                                >
                                    {isEn ? "Ask Us →" : "Tư vấn ngay →"}
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/* PROCESS STRIP                            */}
            {/* ════════════════════════════════════════ */}
            <section className="services-process" style={{ background: "#2E2E2E", padding: "72px 0" }}>
                <div className="services-process__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                    <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                            {isEn ? "Simple 3 Steps" : "3 bước đơn giản"}
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", margin: 0, fontStyle: "italic" }}>
                            {isEn ? "How it Works" : "Quy trình trải nghiệm"}
                        </h2>
                    </div>

                    <div className="services-process__grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {[
                            {
                                step: "01",
                                title: isEn ? "Choose a Service" : "Chọn dịch vụ",
                                desc: isEn ? "Browse our curated menu and find the treatment that speaks to you." : "Khám phá danh mục dịch vụ cao cấp và lựa chọn liệu trình phù hợp nhất.",
                            },
                            {
                                step: "02",
                                title: isEn ? "Book Online" : "Đặt lịch trực tuyến",
                                desc: isEn ? "Pick your preferred date, time, and branch. Confirmation in minutes." : "Chọn ngày, giờ và chi nhánh thuận tiện. Xác nhận nhanh chóng chỉ trong vài phút.",
                            },
                            {
                                step: "03",
                                title: isEn ? "Arrive & Unwind" : "Thư giãn & Tận hưởng",
                                desc: isEn ? "Walk in, let our specialists do the rest. Leave feeling extraordinary." : "Đến salon và để các chuyên viên chăm sóc bạn tận tâm. Cảm nhận vẻ đẹp tự tin.",
                            },
                        ].map((s, i) => (
                            <div key={i} className="reveal" data-delay={String(i * 100)} style={{ textAlign: "center", padding: "32px 24px" }}>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 700, color: "rgba(194,169,121,.2)", lineHeight: 1, marginBottom: 16 }}>{s.step}</div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 12px", fontStyle: "italic" }}>{s.title}</h3>
                                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#777", margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
                        <Link
                            href={bookingHref}
                            style={{
                                display: "inline-block",
                                background: "linear-gradient(135deg,#C2A979,#a08040)",
                                color: "#fff",
                                padding: "18px 48px",
                                fontFamily: "Montserrat,sans-serif",
                                fontSize: 13,
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                borderRadius: 40,
                                cursor: "pointer",
                                transition: "all .3s ease",
                                boxShadow: "0 6px 24px rgba(194,169,121,.35)"
                            }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(194,169,121,.45)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(194,169,121,.35)"; }}
                        >
                            {isEn ? "Book Your Appointment →" : "Đặt lịch hẹn ngay →"}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
