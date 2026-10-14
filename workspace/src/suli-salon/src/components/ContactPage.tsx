"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
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

/* ─────────────────────────────────────────────────────── */
/* Contact Form Component                                   */
/* ─────────────────────────────────────────────────────── */
function ContactForm() {
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";

    const [sent, setSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

    const inputStyle = (name: string): React.CSSProperties => ({
        width: "100%",
        padding: "14px 18px",
        border: `1.5px solid ${focused === name ? "#C2A979" : "#E8E2D8"}`,
        borderRadius: 12,
        fontSize: 14,
        fontFamily: "Montserrat,sans-serif",
        color: "#2E2E2E",
        outline: "none",
        background: focused === name ? "#FFFFFF" : "#FDFCF9",
        boxSizing: "border-box",
        transition: "all .25s ease",
        boxShadow: focused === name ? "0 0 0 3.5px rgba(194, 169, 121, 0.16)" : "none",
    });

    return (
        <div className="contact-form-card" style={{ background: "#FFFFFF", padding: "48px 44px", borderRadius: 20, border: "1px solid rgba(194, 169, 121, 0.22)", boxShadow: "0 24px 64px -16px rgba(40, 30, 20, 0.08)" }}>
            {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(194, 169, 121, 0.14)", border: "1.5px solid #C2A979", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#967840", fontSize: 26 }}>
                        ✓
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 12px" }}>
                        {isEn ? "Message Sent!" : "Đã gửi tin nhắn!"}
                    </h3>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#6B6B6B", margin: "0 0 24px", lineHeight: 1.6 }}>
                        {isEn ? "Thank you for reaching out. We will get back to you shortly." : "Cảm ơn bạn đã liên hệ. Đội ngũ Mộc Salon sẽ phản hồi bạn trong thời gian sớm nhất."}
                    </p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                        style={{ background: "transparent", border: "1.5px solid #C2A979", color: "#C2A979", padding: "12px 28px", borderRadius: 10, fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s" }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#C2A979"; e.currentTarget.style.color = "#FFFFFF"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C2A979"; }}
                    >
                        {isEn ? "Send Another Message" : "Gửi tin nhắn khác"}
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                        {isEn ? "Drop us a line" : "Liên hệ với chúng tôi"}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 32px", lineHeight: 1.2 }}>
                        {isEn ? "Send a Message" : "Gửi tin nhắn"}
                    </h2>

                    {errorMsg && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 20, fontFamily: "Montserrat,sans-serif" }}>{errorMsg}</div>}

                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!form.name || !form.message) return;
                        setIsSubmitting(true);
                        setErrorMsg("");
                        try {
                            const res = await fetch("/api/contact", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    name: form.name,
                                    email: form.email,
                                    phone: form.phone,
                                    subject: form.service,
                                    message: form.message,
                                }),
                            });
                            if (!res.ok) throw new Error("Failed to send");
                            setSent(true);
                        } catch {
                            setErrorMsg(dictionary.common.error);
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}>
                        <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#786E65", marginBottom: 8 }}>
                                    {isEn ? "Full Name *" : "Họ và tên *"}
                                </label>
                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                                    placeholder={isEn ? "Your full name" : "Họ và tên của bạn"} style={inputStyle("name")} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#786E65", marginBottom: 8 }}>
                                    {isEn ? "Email Address *" : "Địa chỉ Email *"}
                                </label>
                                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                                    placeholder="you@email.com" style={inputStyle("email")} />
                            </div>
                        </div>

                        <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#786E65", marginBottom: 8 }}>
                                    {isEn ? "Phone Number" : "Số điện thoại"}
                                </label>
                                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                                    placeholder={isEn ? "+84 xxx xxx xxx" : "09xx xxx xxx"} style={inputStyle("phone")} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#786E65", marginBottom: 8 }}>
                                    {isEn ? "Service Interest" : "Dịch vụ quan tâm"}
                                </label>
                                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                                    onFocus={() => setFocused("service")} onBlur={() => setFocused(null)}
                                    style={{ ...inputStyle("service"), appearance: "auto" }}>
                                    <option value="">{isEn ? "Select a service..." : "Chọn dịch vụ..."}</option>
                                    <option value="gel-manicure">{isEn ? "Gel Manicure / Premium Polish" : "Sơn gel cao cấp & chăm sóc móng tay"}</option>
                                    <option value="nail-art">{isEn ? "Custom Nail Art & Design" : "Vẽ móng nghệ thuật & đính đá thiết kế"}</option>
                                    <option value="extensions">{isEn ? "Gel / Acrylic Nail Extensions" : "Đắp móng gel / Acrylic form chuẩn"}</option>
                                    <option value="spa-pedicure">{isEn ? "Luxury Spa Pedicure" : "Chăm sóc & Spa gót chân chuyên sâu"}</option>
                                    <option value="ibx-recovery">{isEn ? "IBX Treatment & Nail Recovery" : "Phục hồi móng mỏng yếu IBX"}</option>
                                    <option value="general-consultation">{isEn ? "General Consultation / Other" : "Tư vấn kiểu móng & dịch vụ khác"}</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#786E65", marginBottom: 8 }}>
                                {isEn ? "Your Message *" : "Nội dung tin nhắn *"}
                            </label>
                            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                                placeholder={isEn ? "Tell us about what you're looking for, preferred date & time, any questions..." : "Chia sẻ với chúng tôi về nhu cầu làm móng, phong cách bạn yêu thích hoặc thắc mắc cần tư vấn..."}
                                style={{ ...inputStyle("message"), resize: "vertical" }} />
                        </div>

                        <button type="submit" disabled={isSubmitting}
                            style={{ width: "100%", background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "16px", borderRadius: 12, fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", transition: "all .3s ease", boxShadow: "0 6px 24px rgba(194,169,121,.35)", opacity: isSubmitting ? 0.7 : 1 }}
                            onMouseOver={(e) => { if (!isSubmitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(194,169,121,.45)"; } }}
                            onMouseOut={(e) => { if (!isSubmitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(194,169,121,.35)"; } }}
                        >
                            {isSubmitting ? dictionary.common.sending : (isEn ? "Send Message →" : "Gửi tin nhắn →")}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Main Contact Page                                        */
/* ─────────────────────────────────────────────────────── */
export default function ContactPage({ settings }: { settings: SiteSettings }) {
    useReveal();
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";
    const bookingHref = getLocalizedPath(locale, "booking");

    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);

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

    const defaultHours = isEn
        ? ["Monday – Saturday: 09:00 – 20:00", "Sunday: 09:00 – 18:00"]
        : ["Thứ Hai – Thứ Bảy: 09:00 – 20:00", "Chủ Nhật: 09:00 – 18:00"];

    const localizedHours = getLocalizedText(settings.workingHours, locale);
    const workingHoursLines = localizedHours
        ? localizedHours.split(/[,]/).map(s => s.trim()).filter(Boolean)
        : defaultHours;

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        .info-card {
          background: #fff;
          padding: 28px 24px;
          transition: transform .3s, box-shadow .3s;
          cursor: default;
        }
        .info-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(194,169,121,.12);
        }

        @media (max-width: 1023px) {
          .contact-container { padding-inline: var(--public-gutter) !important; }
          .contact-info__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .contact-main__grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 600px) {
          .contact-info { padding-top: 52px !important; }
          .contact-main { padding-block: 36px 72px !important; }
          .contact-info__grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .contact-form-card { padding: 30px 20px !important; }
          .contact-form-card h2 { font-size: 28px !important; }
          .contact-form-row { grid-template-columns: 1fr !important; gap: 14px !important; }
          .contact-form-card input, .contact-form-card select, .contact-form-card textarea { font-size: 16px !important; }
          .contact-booking-cta { align-items: flex-start !important; flex-direction: column; padding: 24px 20px !important; }
          .contact-booking-cta a, .contact-booking-cta button { width: 100%; }
          .contact-social-links { flex-wrap: wrap; }
          .contact-social-links a { min-width: calc(50% - 6px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.is-visible { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

            {/* ══════════════════════════════════════════════ */}
            {/* HERO                                           */}
            {/* ══════════════════════════════════════════════ */}
            <section style={{
                minHeight: "48vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F4F1EA",
                paddingTop: 110,
                paddingBottom: 80,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Decorative rings */}
                <div style={{ position: "absolute", top: -140, right: -140, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(194,169,121,.12)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(194,169,121,.08)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(194,169,121,.1)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        {isEn ? "We'd Love to Hear from You" : "Chúng tôi luôn sẵn sàng lắng nghe"}
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,6vw,76px)", fontWeight: 700, color: "#2E2E2E", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em", fontStyle: "italic", transition: "transform .12s ease-out" }}
                    >
                        {isEn ? "Contact Us" : "Liên hệ với chúng tôi"}
                    </h1>
                    <p
                        ref={subRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", maxWidth: 500, margin: "0 auto", transition: "transform .12s ease-out" }}
                    >
                        {isEn
                            ? "Have a question, want to book, or just want to say hello? We're always happy to connect."
                            : "Bạn có câu hỏi, muốn đặt lịch hoặc cần tư vấn? Mộc Salon luôn sẵn lòng hỗ trợ bạn."}
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════ */}
            {/* INFO CARDS                                     */}
            {/* ══════════════════════════════════════════════ */}
            <section className="contact-info" style={{ background: "#FDFBF7", padding: "80px 0 0" }}>
                <div className="contact-container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                    <div className="contact-info__grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                        {/* 1. Location */}
                        <div className="reveal info-card" data-delay="0"
                            style={{ background: "#fff", padding: "32px 26px", borderRadius: 18, border: "1px solid rgba(194,169,121,.22)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.05)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(194,169,121,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(194,169,121,.25)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                                {isEn ? "Our Location" : "Địa chỉ của chúng tôi"}
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, fontWeight: 700, color: "#2E2E2E", marginBottom: 6 }}>
                                {settings.siteName || "Mộc Salon"}
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13.5, lineHeight: 1.6, color: "#6E6E6E" }}>
                                {getLocalizedText(settings.address, locale)}
                            </div>
                        </div>

                        {/* 2. Phone & Email */}
                        <div className="reveal info-card" data-delay="80"
                            style={{ background: "#fff", padding: "32px 26px", borderRadius: 18, border: "1px solid rgba(194,169,121,.22)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.05)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(194,169,121,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(194,169,121,.25)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.41-1.42a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.29v1.63z" />
                                </svg>
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                                {isEn ? "Hotline & Email" : "Hotline & Email"}
                            </div>
                            {settings.hotline && (
                                <a href={`tel:${settings.hotline.replace(/\s+/g, "")}`}
                                    style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 15, fontWeight: 700, color: "#2E2E2E", textDecoration: "none", marginBottom: 6, transition: "color .2s" }}
                                    onMouseOver={(e) => { e.currentTarget.style.color = "#C2A979"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.color = "#2E2E2E"; }}
                                >
                                    📞 {settings.hotline}
                                </a>
                            )}
                            {settings.hotline2 && (
                                <a href={`tel:${settings.hotline2.replace(/\s+/g, "")}`}
                                    style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 13.5, color: "#6E6E6E", textDecoration: "none", marginBottom: 6, transition: "color .2s" }}
                                    onMouseOver={(e) => { e.currentTarget.style.color = "#C2A979"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.color = "#6E6E6E"; }}
                                >
                                    {settings.hotline2}
                                </a>
                            )}
                            {settings.email && (
                                <a href={`mailto:${settings.email}`}
                                    style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#8C7B6D", textDecoration: "none", marginTop: 4, transition: "color .2s" }}
                                    onMouseOver={(e) => { e.currentTarget.style.color = "#C2A979"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.color = "#8C7B6D"; }}
                                >
                                    ✉ {settings.email}
                                </a>
                            )}
                        </div>

                        {/* 3. Opening Hours */}
                        <div className="reveal info-card" data-delay="160"
                            style={{ background: "#fff", padding: "32px 26px", borderRadius: 18, border: "1px solid rgba(194,169,121,.22)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.05)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(194,169,121,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(194,169,121,.25)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                                {isEn ? "Opening Hours" : "Giờ mở cửa"}
                            </div>
                            {workingHoursLines.map((line, j) => (
                                <div key={j} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13.5, lineHeight: 1.65, color: j === 0 ? "#2E2E2E" : "#6E6E6E", fontWeight: j === 0 ? 600 : 400, marginBottom: 4 }}>
                                    {line}
                                </div>
                            ))}
                        </div>

                        {/* 4. Social Links */}
                        <div className="reveal info-card" data-delay="240"
                            style={{ background: "#fff", padding: "32px 26px", borderRadius: 18, border: "1px solid rgba(194,169,121,.22)", boxShadow: "0 10px 30px -10px rgba(0,0,0,.05)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(194,169,121,.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(194,169,121,.25)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21l4-4 4 4M12 17v4" />
                                </svg>
                            </div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                                {isEn ? "Connect With Us" : "Kết nối với chúng tôi"}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                                {settings.facebook && (
                                    <a href={settings.facebook} target="_blank" rel="noreferrer"
                                        style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#2E2E2E", textDecoration: "none", fontWeight: 600, transition: "color .2s" }}
                                        onMouseOver={(e) => { e.currentTarget.style.color = "#C2A979"; }}
                                        onMouseOut={(e) => { e.currentTarget.style.color = "#2E2E2E"; }}
                                    >
                                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,104,255,0.1)", color: "#0068ff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>f</span>
                                        <span>Facebook Mộc Salon</span>
                                    </a>
                                )}
                                {settings.instagram && (
                                    <a href={settings.instagram} target="_blank" rel="noreferrer"
                                        style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#2E2E2E", textDecoration: "none", fontWeight: 600, transition: "color .2s" }}
                                        onMouseOver={(e) => { e.currentTarget.style.color = "#C2A979"; }}
                                        onMouseOut={(e) => { e.currentTarget.style.color = "#2E2E2E"; }}
                                    >
                                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(225,48,108,0.1)", color: "#E1306C", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>📸</span>
                                        <span>Instagram Gallery</span>
                                    </a>
                                )}
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#9E9489", marginTop: 4 }}>
                                    {isEn ? "Follow us for daily nail inspirations." : "Theo dõi để cập nhật các mẫu móng mới nhất."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════ */}
            {/* FORM + MAP                                     */}
            {/* ══════════════════════════════════════════════ */}
            <section className="contact-main" style={{ background: "#FDFBF7", padding: "64px 0 100px" }}>
                <div className="contact-container contact-main__grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "start" }}>

                    {/* Form */}
                    <div className="reveal">
                        <ContactForm />
                    </div>

                    {/* Map + extra info */}
                    <div className="reveal" data-delay="150" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Map embed */}
                        {settings.mapEmbedUrl && (
                            <div style={{ overflow: "hidden", borderRadius: 20, border: "1px solid rgba(194, 169, 121, 0.25)", boxShadow: "0 16px 48px -12px rgba(40, 30, 20, 0.1)", height: 350 }}>
                                <iframe
                                    title="Mộc Salon location"
                                    src={settings.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, display: "block" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        )}

                        {/* Book CTA card */}
                        <div className="contact-booking-cta" style={{ background: "linear-gradient(135deg, #26201B 0%, #171412 100%)", borderRadius: 20, border: "1px solid rgba(194, 169, 121, 0.28)", padding: "34px 30px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 18px 48px -10px rgba(0,0,0,0.18)" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                                    {isEn ? "Fast Booking" : "Tiết kiệm thời gian"}
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, color: "#fff", margin: "0 0 6px", fontStyle: "italic" }}>
                                    {isEn ? "Book Online Instantly" : "Đặt lịch hẹn trực tuyến ngay"}
                                </h3>
                                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#A89F95", margin: 0, lineHeight: 1.5 }}>
                                    {isEn ? "Select your favorite artist, date & time with instant confirmation." : "Chủ động chọn kỹ thuật viên, khung giờ mong muốn & nhận xác nhận nhanh chóng."}
                                </p>
                            </div>
                            <Link
                                href={bookingHref}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: "linear-gradient(135deg,#C2A979,#a08040)",
                                    color: "#fff",
                                    padding: "14px 26px",
                                    borderRadius: 10,
                                    fontFamily: "Montserrat,sans-serif",
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    transition: "all .3s ease",
                                    boxShadow: "0 4px 18px rgba(194,169,121,.35)",
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(194,169,121,.5)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(194,169,121,.35)"; }}
                            >
                                <span>{dictionary.nav.booking}</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
