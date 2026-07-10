"use client";
import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/db";

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
/* Info Cards Data                                         */
/* ─────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────── */
/* Contact Form Component                                   */
/* ─────────────────────────────────────────────────────── */
function ContactForm() {
    const [sent, setSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

    const inputStyle = (name: string): React.CSSProperties => ({
        width: "100%",
        padding: "14px 16px",
        border: `1.5px solid ${focused === name ? "#C2A979" : "#E0D8CC"}`,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: "Montserrat,sans-serif",
        color: "#2E2E2E",
        outline: "none",
        background: "#fff",
        boxSizing: "border-box",
        transition: "border-color .25s",
    });

    return (
        <div style={{ background: "#fff", padding: "48px 44px", boxShadow: "0 16px 64px rgba(0,0,0,.08)" }}>
            {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 12px" }}>Message Sent!</h3>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#6B6B6B", margin: "0 0 24px" }}>
                        Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                        style={{ background: "transparent", border: "1.5px solid #C2A979", color: "#C2A979", padding: "10px 24px", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                        Send Another
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                        Drop us a line
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 32px", lineHeight: 1.2 }}>
                        Send a Message
                    </h2>

                    {errorMsg && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 16, fontFamily: "Montserrat,sans-serif" }}>{errorMsg}</div>}

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
                            setErrorMsg("Something went wrong. Please try again.");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Full Name *</label>
                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                                    placeholder="Your full name" style={inputStyle("name")} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Email Address *</label>
                                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                                    placeholder="you@email.com" style={inputStyle("email")} />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Phone Number</label>
                                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                                    placeholder="+420 xxx xxx xxx" style={inputStyle("phone")} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Service Interest</label>
                                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                                    onFocus={() => setFocused("service")} onBlur={() => setFocused(null)}
                                    style={{ ...inputStyle("service"), appearance: "none" }}>
                                    <option value="">Select a service...</option>
                                    <option>Nails – Manicure</option>
                                    <option>Nails – Gel Extensions</option>
                                    <option>Pedicure</option>
                                    <option>Facial Care</option>
                                    <option>Eyelashes</option>
                                    <option>Eyebrows</option>
                                    <option>Other / General Inquiry</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Your Message *</label>
                            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                                placeholder="Tell us about what you're looking for, your preferred date & time, any questions..."
                                style={{ ...inputStyle("message"), resize: "vertical" }} />
                        </div>

                        <button type="submit" disabled={isSubmitting}
                            style={{ width: "100%", background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "18px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", transition: "all .3s", boxShadow: "0 4px 20px rgba(194,169,121,.35)", opacity: isSubmitting ? 0.7 : 1 }}
                            onMouseOver={(e) => { if (!isSubmitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(194,169,121,.45)"; } }}
                            onMouseOut={(e) => { if (!isSubmitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(194,169,121,.35)"; } }}
                        >
                            {isSubmitting ? "Sending..." : "Send Message →"}
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

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');
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
                        We'd Love to Hear from You
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,6vw,76px)", fontWeight: 700, color: "#2E2E2E", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em", fontStyle: "italic", transition: "transform .12s ease-out" }}
                    >
                        Contact Us
                    </h1>
                    <p
                        ref={subRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", maxWidth: 500, margin: "0 auto", transition: "transform .12s ease-out" }}
                    >
                        Have a question, want to book, or just want to say hello? We're always happy to connect.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════ */}
            {/* INFO CARDS                                     */}
            {/* ══════════════════════════════════════════════ */}
            <section style={{ background: "#FDFBF7", padding: "80px 0 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                        {[
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                ),
                                label: "Our Location",
                                lines: [settings.siteName, settings.address],
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.41-1.42a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.29v1.63z" />
                                    </svg>
                                ),
                                label: "Phone & Email",
                                lines: [settings.hotline, settings.hotline2, settings.email].filter(Boolean),
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                ),
                                label: "Opening Hours",
                                lines: settings.workingHours.split(",").map(s => s.trim()),
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21l4-4 4 4M12 17v4" />
                                    </svg>
                                ),
                                label: "Follow Us",
                                lines: ["@sulisalon.prague", "facebook.com/sulisalon"],
                            },
                        ].map((card, i) => (
                            <div key={i} className="reveal info-card" data-delay={String(i * 80)}
                                style={{ background: "#fff", padding: "32px 26px", boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(194,169,121,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(194,169,121,.2)" }}>
                                    {card.icon}
                                </div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 10 }}>
                                    {card.label}
                                </div>
                                {card.lines.map((line, j) => (
                                    <div key={j} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.8, color: j === 0 ? "#2E2E2E" : "#888", fontWeight: j === 0 ? 600 : 400 }}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════ */}
            {/* FORM + MAP                                     */}
            {/* ══════════════════════════════════════════════ */}
            <section style={{ background: "#FDFBF7", padding: "64px 0 100px" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "start" }}>

                    {/* Form */}
                    <div className="reveal">
                        <ContactForm />
                    </div>

                    {/* Map + extra info */}
                    <div className="reveal" data-delay="150" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Map embed */}
                        {settings.mapEmbedUrl && (
                            <div style={{ overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.1)", height: 340 }}>
                                <iframe
                                    title="Suli Salon location"
                                    src={settings.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, display: "block", filter: "grayscale(30%)" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        )}

                        {/* Book CTA card */}
                        <div style={{ background: "#2E2E2E", padding: "32px 28px", display: "flex", alignItems: "center", gap: 24 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                                    Skip the line
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, fontStyle: "italic" }}>
                                    Book Online Instantly
                                </h3>
                            </div>
                            <a href="/booking">
                                <button
                                    style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "14px 24px", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all .3s", boxShadow: "0 4px 16px rgba(194,169,121,.3)" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                                >
                                    Book Now →
                                </button>
                            </a>
                        </div>

                        {/* Social links */}
                        <div style={{ background: "#fff", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                                Follow Our Work
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                {[
                                    { name: "Instagram", link: settings.instagram, color: "#E1306C" },
                                    { name: "Facebook", link: settings.facebook, color: "#1877F2" },
                                    { name: "TikTok", link: settings.tiktok, color: "#010101" },
                                ].filter(s => s.link).map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.link}
                                        style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 12px", border: "1.5px solid #EAE5DC", borderRadius: 4, textDecoration: "none", transition: "all .3s", alignItems: "center", textAlign: "center" }}
                                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#EAE5DC"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                                    >
                                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, color: "#2E2E2E", marginBottom: 3 }}>{s.name}</div>
                                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, color: "#aaa" }}>Follow Us</div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ══════════════════════════════════════════════ */}
            {/* INTERIOR STRIP                                 */}
            {/* ══════════════════════════════════════════════ */}
            <section style={{ position: "relative", height: 320, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j"
                    alt="Salon interior"
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)", transition: "filter .6s" }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)")}
                    onMouseOut={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(30%)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="reveal" style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,2.5vw,30px)", fontStyle: "italic", color: "#fff", margin: "0 0 4px", lineHeight: 1.5 }}>
                            "We don't just do nails — we create experiences."
                        </p>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C2A979" }}>
                            — Suli Nguyen, Founder
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
