"use client";
import { useEffect, useRef } from "react";
import type { SiteSettings, TeamMemberData } from "@/lib/db";

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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    ),
    (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
];

/* ─────────────────────────────────────────────────────── */
/* About Page Component                                     */
/* ─────────────────────────────────────────────────────── */
export default function AboutPage({ settings, team }: { settings: SiteSettings; team: TeamMemberData[] }) {
    useReveal();

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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');
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
          filter: grayscale(100%);
          transition: filter .65s ease, transform .7s ease;
        }
        .team-img-wrap:hover img {
          filter: grayscale(0%);
          transform: scale(1.05);
        }
      `}</style>

            {/* ═══════════════════════════════════════════════ */}
            {/* 1. HERO — Full-width with real salon photo       */}
            {/* ═══════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                style={{
                    position: "relative",
                    height: "82vh",
                    minHeight: 560,
                    backgroundImage: `url('${settings.bannerImage || "/uploads/banner.png"}')`,
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
                    {(settings.siteName || "SULI").split(" ")[0].toUpperCase()}
                </div>

                {/* Text block — bottom left glass card */}
                <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 64px 64px" }}>
                    <div style={{ maxWidth: 560 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            Our Mission
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
                            <em>{settings.aboutHeadline || "A Decade of Refined Artistry"}</em>
                        </h1>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,.78)", maxWidth: 440, marginBottom: 32 }}>
                            {settings.aboutSubheadline || `For over 10 years, ${settings.siteName || "Suli Salon"} has been the sanctuary for those seeking precision, beauty, and the ultimate in beauty artistry.`}
                        </p>
                        <a href="/booking">
                            <button
                                style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "14px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all .3s", boxShadow: "0 4px 20px rgba(194,169,121,.4)", borderRadius: 2 }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(194,169,121,.5)" }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(194,169,121,.4)" }}
                            >
                                Book Appointment
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* 2. MISSION — Text left + Image grid right       */}
            {/* ═══════════════════════════════════════════════ */}
            <section style={{ background: "#FDFBF7", padding: "100px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

                    {/* Left: text */}
                    <div className="reveal reveal-left">
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            The Mission
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 24px" }}>
                            Redefining Luxury and Relaxation
                        </h2>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.8, color: "#6B6B6B", marginBottom: 20 }}>
                            Founded on the principles of "Work Perfectionism," {settings.siteName || "Suli Salon"} was born from a desire to create more than just a beauty destination. We envisioned a sanctuary, a space where every stroke of art and every drop of service is a statement to our commitment to excellence.
                        </p>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.8, color: "#6B6B6B", marginBottom: 0 }}>
                            Our dream is to provide a sanctuary environment where our team can receive the trims of the week and, in exchange, come forward, not just in appearance, but in spirit. We believe that true luxury falls through the absence of clutter and the presence of intention.
                        </p>
                    </div>

                    {/* Right: image collage + badge */}
                    <div className="reveal reveal-right" style={{ position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ height: 280, overflow: "hidden" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={settings.aboutImage1 || "/uploads/pedicure.png"}
                                    alt="Salon tools"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .6s ease, transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                />
                            </div>
                            <div style={{ height: 280, overflow: "hidden" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={settings.aboutImage2 || "/uploads/nails_art.png"}
                                    alt="Eyelash care"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .6s ease, transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                                />
                            </div>
                        </div>
                        {/* Floating counter badge */}
                        <div style={{ position: "absolute", bottom: -28, right: -20, background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "24px 28px", boxShadow: "0 12px 40px rgba(194,169,121,.4)", zIndex: 5 }}>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>10k+</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6, opacity: 0.85 }}>Happy<br />Clients</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* 3. PRIVATE SANCTUARY — Image left + text right  */}
            {/* ═══════════════════════════════════════════════ */}
            <section style={{ background: "#F4F1EA", padding: "100px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

                    {/* Left: main salon interior image */}
                    <div className="reveal reveal-left" style={{ position: "relative", height: 520, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={settings.bannerImage || "/uploads/banner.png"}
                            alt="Salon interior"
                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(20%)", transition: "filter .7s, transform .7s" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(20%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                    </div>

                    {/* Right: values list */}
                    <div className="reveal reveal-right">
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            What We Offer
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 40px" }}>
                            Your Private Sanctuary
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
                                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: "#2E2E2E", margin: "0 0 8px", fontStyle: "italic" }}>{v.title}</h3>
                                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#6B6B6B", margin: 0 }}>{v.description}</p>
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
            <section style={{ background: "#FDFBF7", padding: "100px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

                    {/* Header */}
                    <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                            Meet The Artists
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 700, color: "#2E2E2E", margin: 0, fontStyle: "italic" }}>
                            Precision in Every Detail
                        </h2>
                    </div>

                    {/* Team grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {team.map((member, i) => (
                            <div
                                key={member.id}
                                className="reveal"
                                data-delay={String(i * 120)}
                            >
                                {/* Photo */}
                                <div className="team-img-wrap" style={{ height: 380, overflow: "hidden", marginBottom: 24, background: "#EAE5DC" }}>
                                    {member.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#C2A979' }}>{member.name.charAt(0)}</div>
                                    )}
                                </div>
                                {/* Info */}
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 6 }}>
                                    {member.role}
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#2E2E2E", margin: "0 0 12px", fontStyle: "italic" }}>
                                    {member.name}
                                </h3>
                                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: "italic", color: "#888", margin: 0, lineHeight: 1.6 }}>
                                    "{member.bio}"
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}
