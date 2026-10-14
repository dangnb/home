"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import type { SiteSettings, TeamMemberData } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath, getLocalizedText } from "@/lib/i18n/routes";

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
            { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

const ICONS = [
    (
        <svg key="home" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    (
        <svg key="pencil" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    ),
    (
        <svg key="shield" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
];

/* ─────────────────────────────────────────────────────── */
/* About Page Component                                     */
/* ─────────────────────────────────────────────────────── */
export default function AboutPage({ settings, team }: { settings: SiteSettings; team: TeamMemberData[] }) {
    useReveal();
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";
    const bookingHref = getLocalizedPath(locale, "booking");

    const heroRef = useRef<HTMLDivElement>(null);

    // Subtle parallax for hero background
    useEffect(() => {
        const fn = () => {
            if (heroRef.current) {
                heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
            }
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        .reveal-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
        }
        .reveal-left.is-visible { opacity: 1; transform: translateX(0); }

        .reveal-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
        }
        .reveal-right.is-visible { opacity: 1; transform: translateX(0); }

        .team-img-wrap img {
          transition: transform .7s ease;
        }
        .team-img-wrap:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 1023px) {
          .about-hero { min-height: 500px !important; height: 70vh !important; }
          .about-hero__content, .about-split, .about-team__inner { padding-inline: var(--public-gutter) !important; }
          .about-split { grid-template-columns: 1fr !important; gap: 54px !important; }
          .about-sanctuary .about-split > div:first-child { height: min(104vw, 520px) !important; }
          .about-team__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }

        @media (max-width: 600px) {
          .about-hero { min-height: 470px !important; height: 72vh !important; }
          .about-hero__content { padding-bottom: 36px !important; }
          .about-hero__content h1 { font-size: clamp(34px, 10vw, 46px) !important; }
          .about-hero__content p { font-size: 14px !important; }
          .about-mission, .about-sanctuary, .about-team { padding-block: 64px !important; }
          .about-split { gap: 42px !important; }
          .about-mission .about-split > div:last-child > div:first-child { gap: 8px !important; }
          .about-mission .about-split > div:last-child > div:first-child > div { height: min(54vw, 230px) !important; }
          .about-mission .about-split > div:last-child > div:last-child { right: 0 !important; bottom: -18px !important; padding: 18px !important; }
          .about-mission .about-split > div:last-child > div:last-child > div:first-child { font-size: 32px !important; }
          .about-sanctuary .about-split > div:first-child { height: min(112vw, 420px) !important; }
          .about-team__grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .about-team__grid .team-img-wrap { height: min(112vw, 420px) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal-left, .reveal-right, .reveal.is-visible, .reveal-left.is-visible, .reveal-right.is-visible { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

            {/* ═══════════════════════════════════════════════ */}
            {/* 1. HERO — Full-width with real salon photo       */}
            {/* ═══════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="about-hero"
                style={{
                    position: "relative",
                    height: "82vh",
                    minHeight: 560,
                    backgroundImage: `url('${settings.bannerImage || "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg"}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: 0,
                }}
            >
                {/* Dark gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 100%)" }} />

                {/* Salon name watermark in center */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,8vw,120px)", fontWeight: 700, fontStyle: "italic", color: "rgba(255,255,255,.08)", letterSpacing: "0.04em", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>
                    {(settings.siteName || "MỘC").split(" ")[0].toUpperCase()}
                </div>

                {/* Text block — bottom left glass card */}
                <div className="about-hero__content" style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 64px 64px" }}>
                    <div style={{ maxWidth: 560 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            {isEn ? "Our Mission" : "Sứ mệnh của chúng tôi"}
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
                            <em>{settings.aboutHeadline || (isEn ? "A Decade of Refined Artistry" : "Nghệ thuật chăm sóc móng tinh tế")}</em>
                        </h1>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,.78)", maxWidth: 440, marginBottom: 32 }}>
                            {settings.aboutSubheadline || (isEn
                                ? `For over 10 years, ${settings.siteName || "Mộc Salon"} has been the sanctuary for those seeking precision, beauty, and the ultimate in beauty artistry.`
                                : `Với đội ngũ tận tâm và kỹ thuật tỉ mỉ, ${settings.siteName || "Mộc Salon"} là điểm đến lý tưởng cho những ai yêu thích vẻ đẹp tự nhiên, trang nhã.`)}
                        </p>
                        <Link
                            href={bookingHref}
                            style={{
                                display: "inline-block",
                                background: "linear-gradient(135deg,#C2A979,#a08040)",
                                color: "#fff",
                                padding: "16px 36px",
                                fontFamily: "Montserrat,sans-serif",
                                fontSize: 12,
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                cursor: "pointer",
                                transition: "all .3s ease",
                                boxShadow: "0 6px 20px rgba(194,169,121,.4)",
                                borderRadius: 40
                            }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(194,169,121,.5)" }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(194,169,121,.4)" }}
                        >
                            {dictionary.nav.booking}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* 2. MISSION — Text left + Image grid right       */}
            {/* ═══════════════════════════════════════════════ */}
            <section className="about-mission" style={{ background: "#FDFBF7", padding: "100px 0" }}>
                <div className="about-split" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

                    {/* Left: text */}
                    <div className="reveal reveal-left">
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            {isEn ? "The Mission" : "Sứ mệnh"}
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 24px" }}>
                            {isEn ? "Redefining Luxury and Relaxation" : "Tái định nghĩa sự thư giãn và vẻ đẹp tinh tế"}
                        </h2>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.8, color: "#6B6B6B", marginBottom: 20 }}>
                            {isEn
                                ? `Founded on the principles of "Work Perfectionism," ${settings.siteName || "Mộc Salon"} was born from a desire to create more than just a beauty destination. We envisioned a sanctuary, a space where every stroke of art and every drop of service is a statement to our commitment to excellence.`
                                : `Được xây dựng dựa trên sự tận tâm và tỉ mỉ, ${settings.siteName || "Mộc Salon"} không chỉ là một tiệm làm móng thông thường, mà là một không gian thư thái, nơi mỗi bộ móng là một tác phẩm mang đậm phong cách riêng của bạn.`}
                        </p>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.8, color: "#6B6B6B", marginBottom: 0 }}>
                            {isEn
                                ? "Our dream is to provide a sanctuary environment where our team can receive the trims of the week and, in exchange, come forward, not just in appearance, but in spirit. We believe that true luxury falls through the absence of clutter and the presence of intention."
                                : "Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự chỉn chu, an toàn và tinh tế. Đến với Mộc Salon để cảm nhận sự thư giãn nhẹ nhàng sau những giờ làm việc căng thẳng."}
                        </p>
                    </div>

                    {/* Right: image collage + badge */}
                    <div className="reveal reveal-right" style={{ position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ height: 280, overflow: "hidden" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={settings.aboutImage1 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"}
                                    alt="Salon tools"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                />
                            </div>
                            <div style={{ height: 280, overflow: "hidden" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={settings.aboutImage2 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg"}
                                    alt="Eyelash care"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                />
                            </div>
                        </div>
                        {/* Floating counter badge */}
                        <div style={{ position: "absolute", bottom: -28, right: -20, background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "24px 28px", boxShadow: "0 12px 40px rgba(194,169,121,.4)", zIndex: 5 }}>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>10k+</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6, opacity: 0.85 }}>
                                {isEn ? <>Happy<br />Clients</> : <>Khách hàng<br />hài lòng</>}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* 3. PRIVATE SANCTUARY — Image left + text right  */}
            {/* ═══════════════════════════════════════════════ */}
            <section className="about-sanctuary" style={{ background: "#F4F1EA", padding: "100px 0" }}>
                <div className="about-split" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

                    {/* Left: main salon interior image */}
                    <div className="reveal reveal-left" style={{ position: "relative", height: 520, overflow: "hidden", borderRadius: 20, boxShadow: "0 24px 60px -15px rgba(0,0,0,.15)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={settings.bannerImage || "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg"}
                            alt={isEn ? "Relaxing space at Mộc Salon" : "Không gian thư giãn tại Mộc Salon"}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .7s" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                    </div>

                    {/* Right: values list */}
                    <div className="reveal reveal-right">
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            {isEn ? "What We Offer" : "Giá trị cốt lõi"}
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 40px" }}>
                            {isEn ? "Your Private Sanctuary" : "Không gian riêng tư của bạn"}
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                            {(settings.aboutValues || []).map((v, i) => (
                                <div
                                    key={i}
                                    className="reveal"
                                    data-delay={String(i * 100)}
                                    style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "0 0 28px", borderBottom: i < (settings.aboutValues || []).length - 1 ? "1px solid #E8E0D0" : "none", transition: "transform .25s" }}
                                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(6px)")}
                                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(0)")}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(194,169,121,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(194,169,121,.2)" }}>
                                        {ICONS[i % ICONS.length]}
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: "#2E2E2E", margin: "0 0 8px", fontStyle: "italic" }}>{getLocalizedText(v.title, locale)}</h3>
                                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#6B6B6B", margin: 0 }}>{getLocalizedText(v.description, locale)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* 4. TEAM — "Precision in Every Detail"           */}
            {/* ═══════════════════════════════════════════════ */}
            <section className="about-team" style={{ background: "#FDFBF7", padding: "100px 0" }}>
                <div className="about-team__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

                    {/* Header */}
                    <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            {isEn ? "Meet The Artists" : "Đội ngũ chuyên viên"}
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 700, color: "#2E2E2E", margin: 0, fontStyle: "italic" }}>
                            {isEn ? "Precision in Every Detail" : "Tỉ mỉ trong từng chi tiết"}
                        </h2>
                    </div>

                    {/* Team grid */}
                    <div className="about-team__grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {team.map((member, i) => (
                            <div
                                key={member.id}
                                className="reveal"
                                data-delay={String(i * 120)}
                            >
                                {/* Photo */}
                                <div className="team-img-wrap" style={{ height: 380, overflow: "hidden", marginBottom: 24, background: "#EAE5DC", borderRadius: "32px 8px 32px 8px", boxShadow: "0 16px 40px -10px rgba(0,0,0,.1)", transition: "transform .3s ease" }}>
                                    {member.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#C2A979' }}>{member.name.charAt(0)}</div>
                                    )}
                                </div>
                                {/* Info */}
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 6 }}>
                                    {getLocalizedText(member.role, locale)}
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#2E2E2E", margin: "0 0 12px", fontStyle: "italic" }}>
                                    {member.name}
                                </h3>
                                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: "italic", color: "#888", margin: 0, lineHeight: 1.6 }}>
                                    {`"${getLocalizedText(member.bio, locale)}"`}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}
