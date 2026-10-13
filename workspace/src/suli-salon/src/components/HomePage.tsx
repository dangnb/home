"use client";
import { useEffect, useRef, useState } from "react";
import type { ServiceData, GalleryItemData, SiteSettings } from "@/lib/db";
import { getServiceImageFallback } from "@/lib/service-images";

const FEATURES = [
    "Đội ngũ chuyên nghiệp, giàu kinh nghiệm",
    "Tỉ mỉ trong từng chi tiết",
    "Thiết kế móng hiện đại, bắt kịp xu hướng",
    "Sản phẩm chất lượng, được chọn lọc kỹ",
    "Chăm sóc cá nhân hóa cho từng khách hàng",
    "Không gian sạch sẽ, thoải mái",
];

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
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

/* ─────────────────────────────────────────────────────── */
/* Slide-out Booking Widget                                 */
/* ─────────────────────────────────────────────────────── */
function SlideOutBooking({ services, settings }: { services: ServiceData[], settings: SiteSettings }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        serviceName: "",
        notes: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit() {
        if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.serviceName) {
            setErrorMsg("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        setStatus("loading");
        setErrorMsg("");
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.name,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    serviceName: formData.serviceName,
                    note: formData.notes,
                }),
            });
            if (!res.ok) throw new Error("Failed to book");
            setStatus("success");
            setFormData({ name: "", phone: "", date: "", time: "", serviceName: "", notes: "" });
            setTimeout(() => { setOpen(false); setStatus("idle"); }, 3000);
        } catch {
            setStatus("error");
            setErrorMsg("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    return (
        <>
            {/* Tab trigger */}
            <button
                onClick={() => setOpen(true)}
                className="fixed top-1/2 -translate-y-1/2 right-0 z-40 writing-mode-vertical"
                style={{
                    writingMode: "vertical-rl",
                    background: "linear-gradient(180deg,#C2A979,#a08040)",
                    color: "#fff",
                    padding: "16px 10px",
                    letterSpacing: "0.1em",
                    fontSize: 12,
                    fontFamily: "Montserrat,sans-serif",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    borderRadius: "8px 0 0 8px",
                    boxShadow: "-4px 0 20px rgba(0,0,0,.12)",
                    cursor: "pointer",
                    transition: "opacity .3s",
                    opacity: open ? 0 : 1,
                    pointerEvents: open ? "none" : "auto",
                }}
            >
                Đặt lịch ngay
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Panel */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "min(400px, 100vw)",
                    zIndex: 50,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    transition: "transform .45s cubic-bezier(.16,1,.3,1)",
                    background: "#FDFBF7",
                    boxShadow: "-8px 0 40px rgba(0,0,0,.15)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ padding: "32px 28px 24px", borderBottom: "1px solid #E8E0D0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C2A979", marginBottom: 4 }}>{settings.siteName || "Mộc Salon"}</div>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2, fontStyle: "italic" }}>Đặt lịch hẹn</h2>
                        </div>
                        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#888", lineHeight: 1 }}>✕</button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                    {status === "success" ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#166534" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, margin: "0 0 8px" }}>Đã gửi yêu cầu!</h3>
                            <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14 }}>Chúng tôi sẽ sớm liên hệ để xác nhận lịch hẹn của bạn.</p>
                        </div>
                    ) : (
                        <>
                            {errorMsg && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 16, fontFamily: "Montserrat,sans-serif" }}>{errorMsg}</div>}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Full Name *</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box" }} placeholder="Your name..." />
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Phone Number *</label>
                                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="text" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box" }} placeholder="+420 xxx xxx xxx" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                                <div>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Date *</label>
                                    <input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} type="date" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Time *</label>
                                    <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#fff", color: "#2E2E2E", outline: "none" }}>
                                        <option value="">Select...</option>
                                        {(settings.departureSlots || []).map((slot, i) => (
                                            <option key={i} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Preferred Service *</label>
                                <select value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#fff", color: "#2E2E2E", outline: "none" }}>
                                    <option value="">Select a service...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Message (optional)</label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", resize: "none", boxSizing: "border-box" }} placeholder="Any additional notes..." />
                            </div>
                        </>
                    )}
                </div>

                {status !== "success" && (
                    <div style={{ padding: "20px 28px", borderTop: "1px solid #E8E0D0" }}>
                        <button
                            onClick={handleSubmit}
                            disabled={status === "loading"}
                            style={{ width: "100%", background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "16px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 6, cursor: status === "loading" ? "not-allowed" : "pointer", transition: "opacity .2s", opacity: status === "loading" ? 0.7 : 1 }}
                            onMouseOver={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "0.88" }}
                            onMouseOut={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "1" }}
                        >
                            {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}



/* ─────────────────────────────────────────────────────── */
/* Hero Section                                             */
/* ─────────────────────────────────────────────────────── */
function Hero({ settings }: { settings: SiteSettings }) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 18;
            const my = (e.clientY / window.innerHeight - 0.5) * 12;
            if (titleRef.current) titleRef.current.style.transform = `translate(${-mx * 0.6}px,${-my * 0.6}px)`;
            if (descRef.current) descRef.current.style.transform = `translate(${-mx * 0.3}px,${-my * 0.3}px)`;
        };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, []);

    const bannerTitles = (settings.bannerTitle || "Precision\nNail Care").split("\\n");
    const bgImage = settings.bannerImage || "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg";

    return (
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "visible", background: "#FDFBF7", paddingTop: 120, paddingBottom: 60 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%" }}>

                {/* Left */}
                <div className="reveal is-visible" style={{ zIndex: 2 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        {settings.bannerBadge || "TRẢI NGHIỆM CAO CẤP"}
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,5.5vw,72px)", fontWeight: 700, lineHeight: 1.1, color: "#2E2E2E", margin: "0 0 24px", transition: "transform .12s ease-out", letterSpacing: "-0.02em" }}
                    >
                        {bannerTitles.map((t, i) => (
                            <span key={i}>{t}{i < bannerTitles.length - 1 ? <br /> : null}</span>
                        ))}
                    </h1>
                    <p
                        ref={descRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 17, lineHeight: 1.7, color: "#6B6B6B", maxWidth: 440, marginBottom: 40, transition: "transform .12s ease-out" }}
                    >
                        {settings.bannerSubtitle || "High-quality products, skilled technicians, and attention to detail. Experience the pinnacle of nail artistry in the heart of Prague."}
                    </p>
                    <a href={settings.bannerCta1Link || "/services"}>
                        <button
                            style={{ background: "#1A1A1A", color: "#fff", padding: "18px 44px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all .35s cubic-bezier(.16,1,.3,1)", boxShadow: "0 6px 24px rgba(0,0,0,.18)" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(194,169,121,.4)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,.18)"; }}
                        >
                            {settings.bannerCta1Text || "Our Services →"}
                        </button>
                    </a>
                </div>

                {/* Right – two images side by side */}
                <div className="reveal is-visible" data-delay="200" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
                    {/* Image 1 – taller, left */}
                    <div style={{ position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.18)", aspectRatio: "3/4", borderRadius: "80px 12px 80px 12px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={bgImage}
                            alt="Nail artistry showcase"
                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .7s ease, transform .7s ease" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                        {/* Badge overlay */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)", padding: "40px 20px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderRadius: "0 0 80px 0" }}>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>NGHỆ THUẬT MÓNG</div>
                        </div>
                    </div>

                    {/* Image 2 – shorter, right, offset down */}
                    <div style={{ marginTop: 60, position: "relative" }}>
                        <div style={{ position: "relative", overflow: "hidden", boxShadow: "0 20px 56px rgba(0,0,0,.15)", aspectRatio: "3/4", borderRadius: "12px 80px 12px 80px" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={settings.aboutImage1 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"}
                                alt="Precision nail care detail"
                                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .7s ease, transform .7s ease" }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                            />
                            {/* Badge overlay */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)", padding: "40px 20px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderRadius: "0 0 0 80px" }}>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>DETAIL</div>
                            </div>
                        </div>
                        {/* Experience badge */}
                        <div style={{
                            marginTop: 20,
                            background: "linear-gradient(135deg,#C2A979,#a08040)",
                            padding: "20px 24px",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            boxShadow: "0 8px 32px rgba(194,169,121,.4)",
                            transition: "transform .3s",
                            cursor: "default",
                            borderRadius: "12px 80px 12px 80px",
                        }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
                        >
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{settings.bannerStats?.[0]?.value || "10+"}</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.4 }}>{(settings.bannerStats?.[0]?.label || "Years of\\nExperience").split("\\n").map((t, i) => <span key={i}>{t}<br/></span>)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────── */
/* About Section                                            */
/* ─────────────────────────────────────────────────────── */
function About({ settings }: { settings: SiteSettings }) {
    return (
        <section style={{ background: "#F4F1EA", padding: "160px 0", overflow: "hidden" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "center" }}>

                {/* Images side */}
                <div className="reveal" style={{ position: "relative", paddingBottom: 48, paddingRight: 48 }}>
                    <div style={{ position: "relative", width: "80%", aspectRatio: "3/4", boxShadow: "0 20px 60px rgba(0,0,0,.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={settings.aboutImage2 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg"}
                            alt="Salon"
                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .6s ease" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)")}
                        />
                        {/* Badge */}
                        <div style={{ position: "absolute", top: -24, left: -24, background: "linear-gradient(135deg,#C2A979,#a08040)", padding: "24px 20px", color: "#fff", boxShadow: "0 8px 32px rgba(194,169,121,.4)", transition: "transform .3s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                        >
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{settings.bannerStats?.[0]?.value || "10+"}</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{(settings.bannerStats?.[0]?.label || "YEARS OF\\nEXPERIENCE").toUpperCase().split("\\n").map((t, i) => <span key={i}>{t}<br/></span>)}</div>
                        </div>
                        {/* Small circle img */}
                        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "6px solid #fff", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.12)", transition: "transform .5s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={settings.aboutImage1 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"}
                                alt="Detail"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Text side */}
                <div className="reveal" data-delay="150">
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                        Về {settings.siteName || "Mộc Salon"}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 24px" }}>
                    Vẻ đẹp mang dấu ấn riêng của bạn
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", marginBottom: 36 }}>
                        Thiết kế móng tinh tế dành riêng cho phong cách của bạn. Chúng tôi kết hợp kỹ thuật chỉn chu cùng thẩm mỹ hiện đại để tạo nên vẻ đẹp thật sự thuộc về bạn.
                    </p>
                    <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px", marginBottom: 40, padding: 0, listStyle: "none" }}>
                        {FEATURES.map((f, i) => (
                            <li key={i}
                                style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#2E2E2E", lineHeight: 1.5, transition: "transform .25s" }}
                                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(6px)")}
                                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(0)")}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                                    <circle cx="12" cy="12" r="12" fill="#C2A979" opacity=".15" />
                                    <path d="M7 12l3.5 3.5L17 9" stroke="#C2A979" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                    <a href="/about">
                        <button
                            style={{ background: "transparent", color: "#C2A979", padding: "15px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "2px solid #C2A979", cursor: "pointer", transition: "all .3s" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                        >
                            Khám phá câu chuyện của chúng tôi
                        </button>
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Services                                                 */
/* ─────────────────────────────────────────────────────── */
function Services({ services, settings }: { services: ServiceData[], settings: SiteSettings }) {
    const displayServices = services.slice(0, 4); // Only display top 4 on homepage
    return (
        <section style={{ background: "#FDFBF7", padding: "160px 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ marginBottom: 56 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                        {settings.siteName || "Mộc Salon"}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2 }}>
                        Chăm sóc móng chuyên nghiệp
                    </h2>
                    <div style={{ width: 80, height: 3, background: "linear-gradient(90deg,#C2A979,#a08040)", marginTop: 20 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                    {displayServices.map((s, i) => (
                        <div
                            key={s.id}
                            className="reveal"
                            data-delay={String((i + 1) * 100)}
                            style={{ position: "relative", height: 500, overflow: "hidden", cursor: "pointer" }}
                        // Hover handled via CSS group
                        >
                            <ServiceCard title={s.name} img={s.image} slug={s.slug} />
                        </div>
                    ))}
                    {displayServices.length === 0 && <p>Chưa có dịch vụ nào.</p>}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ title, img, slug }: { title: string; img: string; slug: string }) {
    const imgRef = useRef<HTMLImageElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const fallbackImage = getServiceImageFallback(`${slug} ${title}`);

    return (
        <div
            style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
            onMouseOver={() => {
                if (imgRef.current) { imgRef.current.style.filter = "grayscale(0%)"; imgRef.current.style.transform = "scale(1.1)"; }
                if (linkRef.current) linkRef.current.style.opacity = "1";
            }}
            onMouseOut={() => {
                if (imgRef.current) { imgRef.current.style.filter = "grayscale(100%)"; imgRef.current.style.transform = "scale(1)"; }
                if (linkRef.current) linkRef.current.style.opacity = "0";
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={img || fallbackImage}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .65s ease, transform .65s ease" }}
                onError={(e) => {
                    const image = e.currentTarget;
                    if (image.src !== new URL(fallbackImage, window.location.origin).href) {
                        image.src = fallbackImage;
                    }
                }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.1) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "32px 28px", width: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{title}</h3>
                <a
                    ref={linkRef}
                    href={`/services/${slug}`}
                    style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C2A979", opacity: 0, transition: "opacity .4s", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                >
                    VIEW DETAILS →
                </a>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Gallery – Bento Grid                                     */
/* ─────────────────────────────────────────────────────── */
function Gallery({ gallery }: { gallery: GalleryItemData[] }) {
    const defaultGallery: GalleryItemData[] = [
        { id: "default-banner", title: "Nail artistry", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg", category: "Nails", order: 0, isActive: true },
        { id: "default-pedicure", title: "Pedicure care", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg", category: "Pedicure", order: 1, isActive: true },
        { id: "default-nail-art", title: "Custom nail art", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg", category: "Nail Art", order: 2, isActive: true },
        { id: "default-team", title: "Salon experience", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910446/moc-salon/hrzz84u08aqrlvhimgzk.jpg", category: "Salon", order: 3, isActive: true },
        { id: "default-nails", title: "Signature manicure", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg", category: "Manicure", order: 4, isActive: true },
        { id: "default-detail", title: "Luxury detail", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg", category: "Nail Art", order: 5, isActive: true },
    ];
    // Use built-in imagery until real gallery records are added in the admin.
    const items = (gallery.length > 0 ? gallery : defaultGallery).slice(0, 10);
    // Dynamic spans based on position to keep the bento grid interesting
    const spans = ["row-span-2", "", "col-span-2 row-span-2", "", "", "row-span-2", "", "", "col-span-2", ""];

    return (
        <section style={{ background: "#F9F9F9", padding: "160px 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,54px)", fontWeight: 700, color: "#C2A979", fontStyle: "italic", margin: "0 0 8px" }}>
                        Nail Art Gallery
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999" }}>
                        Luxury Nail Gallery in Prague
                    </p>
                </div>

                <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: 280, gap: 12 }}>
                    {items.map((g, i) => (
                        <GalleryItem key={g.id} url={g.image} alt={g.title || "Gallery"} span={spans[i] || ""} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GalleryItem({ url, alt, span }: { url: string; alt: string; span: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const gridStyles: React.CSSProperties = {};
    if (span.includes("row-span-2")) gridStyles.gridRow = "span 2";
    if (span.includes("col-span-2")) gridStyles.gridColumn = "span 2";

    return (
        <div
            ref={ref}
            style={{ overflow: "hidden", cursor: "pointer", ...gridStyles }}
            onMouseOver={() => { if (imgRef.current) { imgRef.current.style.filter = "grayscale(0%)"; imgRef.current.style.transform = "scale(1.05)"; } }}
            onMouseOut={() => { if (imgRef.current) { imgRef.current.style.filter = "grayscale(100%)"; imgRef.current.style.transform = "scale(1)"; } }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={url}
                alt={alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .65s ease, transform .65s ease" }}
            />
        </div>
    );
}



/* ─────────────────────────────────────────────────────── */
/* Main Page Component                                      */
/* ─────────────────────────────────────────────────────── */
export default function HomePage({ services, gallery, settings }: { services: ServiceData[], gallery: GalleryItemData[], settings: SiteSettings }) {
    useReveal();

    return (
        <>
            <style>{`

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #FDFBF7; overflow-x: hidden; }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile CTA */
        @media (min-width: 769px) { .mobile-cta { display: none !important; } }
      `}</style>

            <main>
                <Hero settings={settings} />
                <About settings={settings} />
                <Services services={services} settings={settings} />
                <Gallery gallery={gallery} />
            </main>

            <SlideOutBooking services={services} settings={settings} />

            {/* Mobile floating CTA */}
            <a href="/booking" className="mobile-cta" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40 }}>
                <button style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#C2A979,#a08040)", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", boxShadow: "0 8px 24px rgba(194,169,121,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>📅</button>
            </a>
        </>
    );
}
