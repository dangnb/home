"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ServiceData, CategoryData } from "@/lib/db";

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
/* Services Data                                            */
/* ─────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────── */
/* Service Row Component                                    */
/* ─────────────────────────────────────────────────────── */
type ServiceItem = { name: string; price: string; duration: string; popular: boolean };

function ServiceRow({ item, index }: { item: ServiceItem; index: number }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            className="reveal"
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
                            Popular
                        </span>
                    )}
                </div>
                <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA" }}>⏱ {item.duration}</span>
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#C2A979", minWidth: 90, textAlign: "right" }}>{item.price}</span>
                <Link href={`/booking?service=${encodeURIComponent(item.name)}`}>
                    <button
                        style={{
                            background: hov ? "linear-gradient(135deg,#C2A979,#a08040)" : "transparent",
                            color: hov ? "#fff" : "#C2A979",
                            border: "1.5px solid #C2A979",
                            padding: "10px 22px",
                            fontFamily: "Montserrat,sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all .3s",
                            whiteSpace: "nowrap",
                            boxShadow: hov ? "0 4px 16px rgba(194,169,121,.3)" : "none",
                        }}
                    >
                        Book →
                    </button>
                </Link>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Services Page                                            */
/* ─────────────────────────────────────────────────────── */
export default function ServicesPage({ services, categories }: { services: ServiceData[], categories: CategoryData[] }) {
    useReveal();
    
    const uiCategories = categories.map(c => {
        const catServices = services.filter(s => s.categoryId === c.id);
        let icon = "✦";
        if (c.label.toLowerCase().includes("nail")) icon = "💅";
        if (c.label.toLowerCase().includes("facial")) icon = "✨";
        if (c.label.toLowerCase().includes("eye")) icon = "👁️";
        if (c.label.toLowerCase().includes("brow")) icon = "〰️";
        
        return {
            id: c.id,
            label: c.label,
            icon,
            img: (catServices.length > 0 && catServices[0].image) ? catServices[0].image : "https://lh3.googleusercontent.com/aida/AP1WRLsncxcUaLl-kRMraO4Z3lDzU_fTWPnoZq2Nu1fF9l-q2D54UsfpLvZepPtcS0B2zdHpDP019vTTziYl3Lsio_K0RghBV2Kd_31VlBu9YThyB2KfTE2ZzWVM0ChalCmLEx48YQMzPoQilLwQtKH3bk9r8zqYRRm1YjdXdQ4B8Z5Duf5JifHrDxt-Yqx-AJmBZ27EcKAtb5-sZbvqtdbRr6MeDpmlG4q0XU5CqOa9eJhvtE1RQdGItfyviGtS",
            desc: c.description || "Experience our premium treatments crafted with intention.",
            items: catServices.map((s, i) => ({
                name: s.name,
                price: s.price,
                duration: s.duration + " min",
                popular: i === 0, // Mark first item as popular for visual flair
            }))
        };
    });

    const [activeId, setActiveId] = useState(uiCategories.length > 0 ? uiCategories[0].id : "");
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);

    const activeCat = uiCategories.find((c) => c.id === activeId) || uiCategories[0];
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
      `}</style>

            {/* ════════════════════════════════════════ */}
            {/* HERO                                     */}
            {/* ════════════════════════════════════════ */}
            <section style={{ minHeight: "46vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F1EA", paddingTop: 110, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -120, right: -120, width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(194,169,121,.12)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(194,169,121,.09)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        What We Offer
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,6vw,76px)", fontWeight: 700, color: "#2E2E2E", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em", fontStyle: "italic", transition: "transform .12s ease-out" }}
                    >
                        Our Services
                    </h1>
                    <p
                        ref={subRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", maxWidth: 500, margin: "0 auto", transition: "transform .12s ease-out" }}
                    >
                        Every treatment is crafted with intention — luxury care, transparent pricing, and no compromises.
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/* CATEGORY TABS + CONTENT                  */}
            {/* ════════════════════════════════════════ */}
            <section style={{ background: "#FDFBF7", padding: "80px 0 100px" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>

                    {/* Category Tabs */}
                    <div className="reveal" style={{ display: "flex", gap: 0, marginBottom: 60, borderBottom: "1.5px solid #EAE5DC", flexWrap: "wrap" }}>
                        {uiCategories.map((cat) => (
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "start" }}>

                        {/* Left: category image + desc */}
                        <div className="reveal">
                            <div style={{ position: "relative", height: 480, overflow: "hidden", marginBottom: 24 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={catImgRef}
                                    src={activeCat.img}
                                    alt={activeCat.label}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)", transition: "opacity .25s ease, filter .6s ease, transform .6s ease" }}
                                    onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                                    onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(30%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
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
                                <div style={{ background: "#F4F1EA", padding: "8px 16px", fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#6B6B6B" }}>
                                    {activeCat.items.length} services
                                </div>
                                <div style={{ background: "#F4F1EA", padding: "8px 16px", fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#6B6B6B" }}>
                                    {activeCat.items.filter((i) => i.popular).length} popular
                                </div>
                            </div>
                        </div>

                        {/* Right: service list */}
                        <div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 6 }}>Service Menu</div>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 8px" }}>{activeCat.label}</h2>
                            <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#C2A979,#a08040)", marginBottom: 32 }} />

                            {activeCat && activeCat.items.map((item, i) => (
                                <ServiceRow key={item.name} item={item} index={i} />
                            ))}
                            {activeCat && activeCat.items.length === 0 && <p style={{fontFamily: "Montserrat", fontSize: 13, color: "#888"}}>No services in this category.</p>}

                            {/* Bottom CTA */}
                            <div style={{ marginTop: 36, padding: "28px", background: "#F4F1EA", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                                <div>
                                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", marginBottom: 4 }}>Not sure what to choose?</div>
                                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#888" }}>Our team would love to help you decide.</div>
                                </div>
                                <Link href="/contact">
                                    <button style={{ background: "#2E2E2E", color: "#fff", padding: "14px 28px", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all .3s" }}
                                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; }}
                                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "#2E2E2E"; }}
                                    >
                                        Ask Us →
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════ */}
            {/* PROCESS STRIP                            */}
            {/* ════════════════════════════════════════ */}
            <section style={{ background: "#2E2E2E", padding: "72px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                    <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>Simple 3 Steps</div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, color: "#fff", margin: 0, fontStyle: "italic" }}>How it Works</h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {[
                            { step: "01", title: "Choose a Service", desc: "Browse our curated menu and find the treatment that speaks to you." },
                            { step: "02", title: "Book Online", desc: "Pick your preferred date, time, and branch. Confirmation in minutes." },
                            { step: "03", title: "Arrive & Unwind", desc: "Walk in, let our specialists do the rest. Leave feeling extraordinary." },
                        ].map((s, i) => (
                            <div key={i} className="reveal" data-delay={String(i * 100)} style={{ textAlign: "center", padding: "32px 24px" }}>
                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 700, color: "rgba(194,169,121,.2)", lineHeight: 1, marginBottom: 16 }}>{s.step}</div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 12px", fontStyle: "italic" }}>{s.title}</h3>
                                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#777", margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
                        <Link href="/booking">
                            <button
                                style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "18px 48px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all .3s", boxShadow: "0 6px 24px rgba(194,169,121,.35)" }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(194,169,121,.45)"; }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(194,169,121,.35)"; }}
                            >
                                Book Your Appointment →
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
