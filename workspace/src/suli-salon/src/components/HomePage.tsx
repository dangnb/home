"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ServiceData, GalleryItemData, SiteSettings } from "@/lib/db";
import { getServiceImageFallback } from "@/lib/service-images";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath, getLocalizedText, getLocalizedPrice } from "@/lib/i18n/routes";

const FEATURES = {
    vi: [
        "Đội ngũ chuyên nghiệp, giàu kinh nghiệm",
        "Tỉ mỉ trong từng chi tiết",
        "Thiết kế móng hiện đại, bắt kịp xu hướng",
        "Sản phẩm chất lượng, được chọn lọc kỹ",
        "Chăm sóc cá nhân hóa cho từng khách hàng",
        "Không gian sạch sẽ, thoải mái",
    ],
    en: [
        "Professional, highly experienced artists",
        "Meticulous attention to every detail",
        "Modern nail designs staying ahead of trends",
        "Carefully selected, premium quality products",
        "Personalized care tailored to each client",
        "Clean, soothing, and relaxing ambiance",
    ],
};

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
function SlideOutBooking({ services, settings }: { services: ServiceData[]; settings: SiteSettings }) {
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";

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
            setErrorMsg(isEn ? "Please fill in all required fields." : "Vui lòng điền đầy đủ các thông tin bắt buộc.");
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
            setTimeout(() => { setOpen(false); setStatus("idle"); }, 3500);
        } catch {
            setStatus("error");
            setErrorMsg(isEn ? "An error occurred while sending your request. Please try again or contact us directly." : "Đã xảy ra sự cố khi gửi yêu cầu. Quý khách vui lòng thử lại hoặc gọi hotline trực tiếp.");
        }
    }

    return (
        <>
            {/* Tab trigger */}
            <button
                onClick={() => setOpen(true)}
                className="homepage-booking-tab fixed top-1/2 -translate-y-1/2 right-0 z-40 writing-mode-vertical"
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
                {dictionary.common.bookNow}
            </button>

            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 45,
                    backgroundColor: "rgba(16, 12, 9, 0.45)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <div
                className="homepage-booking-panel"
                role="dialog"
                aria-modal={open}
                aria-label={isEn ? "Quick Appointment Booking" : "Đặt lịch hẹn nhanh"}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "min(400px, 100vw)",
                    zIndex: 50,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
                    background: "#FDFBF7",
                    boxShadow: open ? "-12px 0 45px rgba(20, 15, 10, 0.22)" : "none",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ padding: "32px 28px 24px", borderBottom: "1px solid #E8E0D0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C2A979", marginBottom: 4 }}>{settings.siteName || "Mộc Salon"}</div>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2, fontStyle: "italic" }}>
                                {isEn ? "Book Appointment" : "Đặt lịch hẹn"}
                            </h2>
                        </div>
                        <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#888", lineHeight: 1 }}>✕</button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                    {status === "success" ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#166534" }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    background: "rgba(194, 169, 121, 0.15)",
                                    border: "1.5px solid #C2A979",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 16px",
                                    color: "#967840",
                                }}
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, margin: "0 0 8px" }}>
                                {isEn ? "Appointment Request Received!" : "Đã gửi yêu cầu đặt lịch!"}
                            </h3>
                            <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14 }}>
                                {isEn ? "Thank you! Mộc Salon will contact you shortly to confirm your appointment." : "Cảm ơn quý khách! Đội ngũ Mộc Salon sẽ liên hệ sớm nhất để xác nhận lịch hẹn."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {errorMsg && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 16, fontFamily: "Montserrat,sans-serif" }}>{errorMsg}</div>}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                    {isEn ? "Full Name *" : "Họ và tên *"}
                                </label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box", background: "#FAF8F5" }} placeholder={isEn ? "Your name..." : "Họ và tên của bạn..."} />
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                    {isEn ? "Phone Number *" : "Số điện thoại *"}
                                </label>
                                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="text" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box", background: "#FAF8F5" }} placeholder={isEn ? "+84 xxx xxx xxx" : "09xx xxx xxx"} />
                            </div>
                            <div className="homepage-booking-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                                <div>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                        {isEn ? "Date *" : "Ngày hẹn *"}
                                    </label>
                                    <input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} type="date" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box", background: "#FAF8F5" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                        {isEn ? "Time *" : "Giờ hẹn *"}
                                    </label>
                                    <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#FAF8F5", color: "#2E2E2E", outline: "none" }}>
                                        <option value="">{isEn ? "Select time..." : "Chọn giờ..."}</option>
                                        {(settings.departureSlots || []).map((slot, i) => (
                                            <option key={i} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                    {isEn ? "Preferred Service *" : "Dịch vụ quan tâm *"}
                                </label>
                                <select value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#FAF8F5", color: "#2E2E2E", outline: "none" }}>
                                    <option value="">{isEn ? "Select a service..." : "Chọn dịch vụ..."}</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.name}>
                                            {getLocalizedText(s.name, locale)}{s.price ? ` (${getLocalizedPrice(s.price, locale)})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
                                    {isEn ? "Notes (optional)" : "Ghi chú (tùy chọn)"}
                                </label>
                                <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 10, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", resize: "none", boxSizing: "border-box", background: "#FAF8F5" }} placeholder={isEn ? "Any additional notes..." : "Yêu cầu thêm hoặc ghi chú..."} />
                            </div>
                        </>
                    )}
                </div>

                {status !== "success" && (
                    <div style={{ padding: "20px 28px", borderTop: "1px solid #E8E0D0" }}>
                        <button
                            onClick={handleSubmit}
                            disabled={status === "loading"}
                            style={{ width: "100%", background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "16px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 10, cursor: status === "loading" ? "not-allowed" : "pointer", transition: "opacity .2s", opacity: status === "loading" ? 0.7 : 1, boxShadow: "0 4px 16px rgba(194, 169, 121, 0.3)" }}
                            onMouseOver={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "0.88"; }}
                            onMouseOut={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "1"; }}
                        >
                            {status === "loading" ? dictionary.common.sending : (isEn ? "Send Request" : "Gửi yêu cầu")}
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
    const { locale } = useLocale();
    const isEn = locale === "en";
    const servicesHref = getLocalizedPath(locale, "services");

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

    const rawBannerBadge = getLocalizedText(settings.bannerBadge, locale) || (isEn ? "PREMIUM EXPERIENCE" : "TRẢI NGHIỆM CAO CẤP");
    const rawBannerTitle = getLocalizedText(settings.bannerTitle, locale) || (isEn ? "Precision\nNail Care" : "Chăm Sóc Móng\nChuyên Nghiệp");
    const bannerTitles = rawBannerTitle.split(/\\n|\n/);
    const bannerSubtitle = getLocalizedText(settings.bannerSubtitle, locale) || (isEn
        ? "Premium products, skilled artists, and meticulous attention to detail. Experience refined nail artistry at Mộc Salon."
        : "Sản phẩm cao cấp, kỹ thuật viên chuyên nghiệp và sự tỉ mỉ trong từng chi tiết. Trải nghiệm nghệ thuật làm móng tinh tế tại Mộc Salon.");
    const bgImage = settings.bannerImage || "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg";

    return (
        <section className="homepage-hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "visible", background: "#FDFBF7", paddingTop: 120, paddingBottom: 60 }}>
            <div className="homepage-hero__inner" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1.18fr", gap: 52, alignItems: "center", width: "100%" }}>

                {/* Left */}
                <div className="reveal is-visible" style={{ zIndex: 2 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        {rawBannerBadge}
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
                        {bannerSubtitle}
                    </p>
                    <Link
                        href={servicesHref}
                        style={{ display: "inline-block", background: "#1A1A1A", color: "#fff", padding: "18px 44px", borderRadius: 10, fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", transition: "all .35s cubic-bezier(.16,1,.3,1)", boxShadow: "0 6px 24px rgba(0,0,0,.18)" }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(194,169,121,.4)"; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,.18)"; }}
                    >
                        {isEn ? "Our Services →" : "Xem dịch vụ →"}
                    </Link>

                    {/* Stats Counter Row in Left Column */}
                    <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 42, paddingTop: 28, borderTop: "1px solid rgba(194, 169, 121, 0.25)", flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#2E2E2E", lineHeight: 1 }}>
                                {settings.bannerStats?.[0]?.value || "8+"}
                            </div>
                            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C7B6D", marginTop: 6 }}>
                                {getLocalizedText(settings.bannerStats?.[0]?.label, locale) || (isEn ? "Years Experience" : "Năm kinh nghiệm")}
                            </div>
                        </div>
                        <div style={{ width: 1, height: 32, background: "rgba(194, 169, 121, 0.3)" }} />
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#2E2E2E", lineHeight: 1 }}>
                                {settings.bannerStats?.[1]?.value || "100%"}
                            </div>
                            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C7B6D", marginTop: 6 }}>
                                {getLocalizedText(settings.bannerStats?.[1]?.label, locale) || (isEn ? "Organic Products" : "Sản phẩm chọn lọc")}
                            </div>
                        </div>
                        <div style={{ width: 1, height: 32, background: "rgba(194, 169, 121, 0.3)" }} />
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#2E2E2E", lineHeight: 1 }}>
                                {settings.bannerStats?.[2]?.value || "5.0 ★"}
                            </div>
                            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C7B6D", marginTop: 6 }}>
                                {getLocalizedText(settings.bannerStats?.[2]?.label, locale) || (isEn ? "Top Rated" : "Khách hài lòng")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right – two clean museum-quality images */}
                <div className="homepage-hero__images reveal is-visible" data-delay="200" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "start", position: "relative" }}>
                    {/* Image 1 – taller, left */}
                    <div style={{ position: "relative", zIndex: 1, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.16)", aspectRatio: "3/4", borderRadius: "80px 16px 80px 16px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={bgImage}
                            alt="Thiết kế nail art nghệ thuật tại Mộc Salon"
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .7s ease" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                        {/* Subtle bottom gradient & gentle editorial caption */}
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "36px 22px 18px",
                            background: "linear-gradient(to top, rgba(14, 11, 9, 0.42) 0%, transparent 100%)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            pointerEvents: "none",
                            zIndex: 2
                        }}>
                            <span style={{ display: "inline-block", width: 14, height: 1, background: "rgba(194, 169, 121, 0.85)" }} />
                            <span style={{
                                fontFamily: "Montserrat,sans-serif",
                                fontSize: 10,
                                fontWeight: 500,
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: "rgba(255, 255, 255, 0.88)",
                                textShadow: "0 1px 3px rgba(0,0,0,0.4)"
                            }}>
                                {isEn ? "Nail Artistry" : "Nghệ thuật móng"}
                            </span>
                        </div>
                    </div>

                    {/* Image 2 – shorter, right, overlapping edge of Image 1 */}
                    <div className="homepage-hero__secondary-image" style={{ marginTop: 64, marginLeft: -36, position: "relative", zIndex: 2 }}>
                        <div style={{
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 28px 64px rgba(0,0,0,.18)",
                            aspectRatio: "3/4",
                            borderRadius: "16px 80px 16px 80px",
                            border: "3.5px solid #FAF7F2",
                            transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 34px 72px rgba(0,0,0,.24)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 28px 64px rgba(0,0,0,.18)"; }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={settings.aboutImage1 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"}
                                alt="Chi tiết chăm sóc móng tỉ mỉ tại Mộc Salon"
                                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .7s ease" }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                            />
                            {/* Subtle bottom gradient & gentle editorial caption */}
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: "36px 22px 18px",
                                background: "linear-gradient(to top, rgba(14, 11, 9, 0.42) 0%, transparent 100%)",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                pointerEvents: "none",
                                zIndex: 2
                            }}>
                                <span style={{ display: "inline-block", width: 14, height: 1, background: "rgba(194, 169, 121, 0.85)" }} />
                                <span style={{
                                    fontFamily: "Montserrat,sans-serif",
                                    fontSize: 10,
                                    fontWeight: 500,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                    color: "rgba(255, 255, 255, 0.88)",
                                    textShadow: "0 1px 3px rgba(0,0,0,0.4)"
                                }}>
                                    {isEn ? "Relaxing Spa Care" : "Trị liệu & Spa thư giãn"}
                                </span>
                            </div>
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
    const { locale } = useLocale();
    const isEn = locale === "en";
    const aboutHref = getLocalizedPath(locale, "about");
    const features = FEATURES[locale];

    return (
        <section className="homepage-about" style={{ background: "#F4F1EA", padding: "160px 0", overflow: "hidden" }}>
            <div className="homepage-about__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "center" }}>

                {/* Images side */}
                <div className="reveal" style={{ position: "relative", paddingBottom: 48, paddingRight: 48 }}>
                    <div style={{ position: "relative", width: "80%", aspectRatio: "3/4", boxShadow: "0 20px 60px rgba(0,0,0,.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={settings.aboutImage2 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg"}
                            alt="Không gian thư giãn tại Mộc Salon"
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                        />
                        {/* Badge */}
                        <div style={{ position: "absolute", top: -24, left: -24, background: "linear-gradient(135deg,#C2A979,#a08040)", padding: "24px 20px", color: "#fff", boxShadow: "0 8px 32px rgba(194,169,121,.4)", transition: "transform .3s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                        >
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{settings.bannerStats?.[0]?.value || "10+"}</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                                {(getLocalizedText(settings.bannerStats?.[0]?.label, locale) || (isEn ? "YEARS OF\nEXPERIENCE" : "NĂM KINH\nNGHIỆM")).toUpperCase().split(/\\n|\n/).map((t, i) => <span key={i}>{t}<br /></span>)}
                            </div>
                        </div>
                        {/* Small circle img */}
                        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "6px solid #fff", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.12)", transition: "transform .5s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={settings.aboutImage1 || "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"}
                                alt="Chi tiết không gian và dịch vụ tại Mộc Salon"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Text side */}
                <div className="reveal" data-delay="150">
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                        {isEn ? `About ${settings.siteName || "Mộc Salon"}` : `Về ${settings.siteName || "Mộc Salon"}`}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 24px" }}>
                        {getLocalizedText(settings.aboutHeadline, locale) || (isEn ? "Beauty with Your Unique Signature" : "Vẻ đẹp mang dấu ấn riêng của bạn")}
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", marginBottom: 36 }}>
                        {getLocalizedText(settings.aboutSubheadline, locale) || (isEn
                            ? "Sophisticated nail design crafted exclusively for your personal style. We blend meticulous technique with modern aesthetics to reveal beauty that truly belongs to you."
                            : "Thiết kế móng tinh tế dành riêng cho phong cách của bạn. Chúng tôi kết hợp kỹ thuật chỉn chu cùng thẩm mỹ hiện đại để tạo nên vẻ đẹp thật sự thuộc về bạn.")}
                    </p>
                    <ul className="homepage-feature-list" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px", marginBottom: 40, padding: 0, listStyle: "none" }}>
                        {features.map((f, i) => (
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
                    <Link
                        href={aboutHref}
                        style={{ display: "inline-block", background: "transparent", color: "#C2A979", padding: "15px 32px", borderRadius: 10, fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", border: "2px solid #C2A979", transition: "all .3s" }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                        {isEn ? "Discover Our Story →" : "Khám phá câu chuyện của chúng tôi →"}
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Services                                                 */
/* ─────────────────────────────────────────────────────── */
function Services({
    services,
    settings,
    onSelectService,
}: {
    services: ServiceData[];
    settings: SiteSettings;
    onSelectService: (service: ServiceData) => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const displayServices = services.slice(0, 4);

    return (
        <section className="homepage-services" style={{ background: "#FDFBF7", padding: "160px 0" }}>
            <div className="homepage-services__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ marginBottom: 56 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                        {settings.siteName || "Mộc Salon"}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2 }}>
                        {isEn ? "Professional Nail Care" : "Chăm sóc móng chuyên nghiệp"}
                    </h2>
                    <div style={{ width: 80, height: 3, background: "linear-gradient(90deg,#C2A979,#a08040)", marginTop: 20 }} />
                </div>

                <div className="homepage-services__grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                    {displayServices.map((s, i) => (
                        <div
                            key={s.id}
                            className="reveal"
                            data-delay={String((i + 1) * 100)}
                            style={{ position: "relative", height: 500, overflow: "hidden", cursor: "pointer" }}
                        >
                            <ServiceCard
                                service={s}
                                onSelect={() => onSelectService(s)}
                            />
                        </div>
                    ))}
                    {displayServices.length === 0 && (
                        <p style={{ fontFamily: "Montserrat,sans-serif", color: "#888", fontSize: 14 }}>
                            {isEn ? "No services available yet." : "Chưa có dịch vụ nào."}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({
    service,
    onSelect,
}: {
    service: ServiceData;
    onSelect: () => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const title = getLocalizedText(service.name, locale);
    const price = getLocalizedPrice(service.price, locale);
    const promoPrice = service.promoPrice ? getLocalizedPrice(service.promoPrice, locale) : null;
    const imgRef = useRef<HTMLImageElement>(null);
    const linkRef = useRef<HTMLButtonElement>(null);
    const fallbackImage = getServiceImageFallback(`${service.slug} ${title}`);

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={isEn ? `View details for ${title}` : `Xem chi tiết dịch vụ ${title}`}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
            style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", outline: "none", cursor: "pointer" }}
            onMouseOver={() => {
                if (imgRef.current) { imgRef.current.style.transform = "scale(1.08)"; }
                if (linkRef.current) linkRef.current.style.opacity = "1";
            }}
            onMouseOut={() => {
                if (imgRef.current) { imgRef.current.style.transform = "scale(1)"; }
                if (linkRef.current) linkRef.current.style.opacity = "0.9";
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={service.image || fallbackImage}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .65s ease" }}
                onError={(e) => {
                    const image = e.currentTarget;
                    if (image.src !== new URL(fallbackImage, window.location.origin).href) {
                        image.src = fallbackImage;
                    }
                }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.25) 50%, transparent 100%)" }} />

            {promoPrice && (
                <div style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>
                    <span style={{ background: "#be123c", color: "#fff", padding: "4px 10px", borderRadius: 30, fontSize: 10, fontWeight: 700, fontFamily: "Montserrat,sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {isEn ? "Special" : "Ưu đãi"}
                    </span>
                </div>
            )}

            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "28px 24px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#C2A979", fontWeight: 600 }}>
                        ⏱ {service.duration || 60} {isEn ? "mins" : "phút"}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                    <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#fff", fontWeight: 600 }}>
                        {promoPrice || price}
                    </span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 600, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>{title}</h3>
                <button
                    ref={linkRef}
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontFamily: "Montserrat,sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#C2A979",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: 0.9,
                        transition: "all .3s ease",
                    }}
                >
                    {isEn ? "VIEW DETAILS →" : "XEM CHI TIẾT →"}
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Service Detail Modal (Quick View Popup)                  */
/* ─────────────────────────────────────────────────────── */
function ServiceDetailModal({
    service,
    settings,
    onClose,
}: {
    service: ServiceData;
    settings: SiteSettings;
    onClose: () => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const modalRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 220);
    }, [isClosing, onClose]);

    const title = getLocalizedText(service.name, locale);
    const description = getLocalizedText(service.description, locale);
    const price = getLocalizedPrice(service.price, locale);
    const promoPrice = service.promoPrice ? getLocalizedPrice(service.promoPrice, locale) : null;
    const fallbackImage = getServiceImageFallback(`${service.slug} ${title}`);
    const bookingUrl = `${getLocalizedPath(locale, "booking")}?service=${encodeURIComponent(title)}`;
    const servicesUrl = getLocalizedPath(locale, "services");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose]);

    return (
        <div
            className="service-detail-modal-overlay"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                backgroundColor: "rgba(23, 19, 16, 0.72)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 16px",
                overflowY: "auto",
                animation: isClosing
                    ? "luxuryModalFadeOut 0.22s ease-out forwards"
                    : "luxuryModalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="service-detail-modal-content"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 880,
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
                    borderRadius: 20,
                    border: "1px solid rgba(194, 169, 121, 0.32)",
                    boxShadow: "0 28px 70px -15px rgba(28, 22, 17, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8) inset",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr 1.18fr",
                    maxHeight: "min(90vh, 760px)",
                    margin: "auto",
                    willChange: "transform, opacity",
                    animation: isClosing
                        ? "luxuryModalCardSlideOut 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                        : "luxuryModalCardSlideIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
            >
                {/* Top Subtle Accent Line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: "linear-gradient(90deg, transparent, #C2A979 25%, #E7D7AF 50%, #C2A979 75%, transparent)",
                        zIndex: 15,
                    }}
                />

                {/* Minimalist Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label={isEn ? "Close modal" : "Đóng cửa sổ"}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 20,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        backgroundColor: "rgba(194, 169, 121, 0.08)",
                        color: "#857567",
                        border: "1px solid rgba(194, 169, 121, 0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.2)";
                        e.currentTarget.style.color = "#231B15";
                        e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.08)";
                        e.currentTarget.style.color = "#857567";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    ✕
                </button>

                {/* Left Column: Editorial Photo Showcase */}
                <div
                    className="service-detail-modal-image-col"
                    style={{
                        position: "relative",
                        minHeight: 320,
                        backgroundColor: "#1D1916",
                        overflow: "hidden",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={service.image || fallbackImage}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                        onError={(e) => {
                            const image = e.currentTarget;
                            if (image.src !== new URL(fallbackImage, window.location.origin).href) {
                                image.src = fallbackImage;
                            }
                        }}
                    />
                    {/* Soft atmospheric gradient */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to bottom, rgba(23, 19, 16, 0.25) 0%, transparent 45%, rgba(23, 19, 16, 0.8) 100%)",
                        }}
                    />

                    {/* Brand & Promo Badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: 18,
                            left: 18,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            zIndex: 2,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 12px",
                                borderRadius: 20,
                                backgroundColor: "rgba(255, 255, 255, 0.92)",
                                color: "#2E241E",
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(194, 169, 121, 0.35)",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                            }}
                        >
                            <span style={{ color: "#C2A979" }}>✦</span>
                            {settings.siteName || "Mộc Salon"}
                        </span>
                        {promoPrice && (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "4px 11px",
                                    borderRadius: 20,
                                    background: "rgba(139, 38, 53, 0.92)",
                                    color: "#FFFFFF",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                    boxShadow: "0 2px 10px rgba(139, 38, 53, 0.35)",
                                }}
                            >
                                <span>✦</span>
                                <span>{isEn ? "EXCLUSIVE PRIVILEGE" : "ĐẶC QUYỀN ƯU ĐÃI"}</span>
                            </span>
                        )}
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 18,
                            left: 18,
                            right: 18,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            zIndex: 2,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(23, 19, 16, 0.72)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                                padding: "6px 12px",
                                borderRadius: 20,
                                border: "1px solid rgba(194, 169, 121, 0.32)",
                                color: "#F3ECE1",
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 11.5,
                                fontWeight: 500,
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{service.duration || 60} {isEn ? "mins" : "phút"}</span>
                        </span>
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(23, 19, 16, 0.72)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                                padding: "6px 12px",
                                borderRadius: 20,
                                border: "1px solid rgba(194, 169, 121, 0.32)",
                                color: "#F3ECE1",
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 11.5,
                                fontWeight: 500,
                            }}
                        >
                            <span style={{ color: "#C2A979" }}>✦</span>
                            <span>{isEn ? "Autoclave Sterilized" : "Vô trùng y khoa"}</span>
                        </span>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Actions */}
                <div
                    className="service-detail-modal-info-col"
                    style={{
                        padding: "32px 36px 30px 32px",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        boxSizing: "border-box",
                    }}
                >
                    <div style={{ marginBottom: 14 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#967840",
                                marginBottom: 6,
                            }}
                        >
                            <span>✦</span>
                            <span>{isEn ? "EXCLUSIVE TREATMENT" : "DỊCH VỤ ĐẶC TRƯNG"}</span>
                        </div>
                        <h2
                            id="service-modal-title"
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: "clamp(22px, 2.4vw, 26px)",
                                fontStyle: "italic",
                                fontWeight: 700,
                                color: "#231B15",
                                margin: "2px 0 0",
                                lineHeight: 1.3,
                            }}
                        >
                            {title}
                        </h2>
                    </div>

                    {/* Hairline Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px" }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(194, 169, 121, 0.35), transparent)" }} />
                        <span style={{ color: "#C2A979", fontSize: 9, opacity: 0.8 }}>✦</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.35))" }} />
                    </div>

                    {/* Luxury Price Card */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 12,
                            padding: "13px 18px",
                            backgroundColor: "rgba(194, 169, 121, 0.08)",
                            borderRadius: 10,
                            border: "1px solid rgba(194, 169, 121, 0.25)",
                            marginBottom: 20,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                            {promoPrice ? (
                                <>
                                    <span
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: 25,
                                            fontWeight: 700,
                                            color: "#967840",
                                        }}
                                    >
                                        {promoPrice}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontSize: 13.5,
                                            color: "#A39282",
                                            textDecoration: "line-through",
                                        }}
                                    >
                                        {price}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: 25,
                                            fontWeight: 700,
                                            color: "#967840",
                                        }}
                                    >
                                        {price}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontSize: 12,
                                            color: "#857567",
                                        }}
                                    >
                                        {isEn ? "/ full treatment" : "/ liệu trình trọn gói"}
                                    </span>
                                </>
                            )}
                        </div>

                        {promoPrice && (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "3px 10px",
                                    borderRadius: 14,
                                    backgroundColor: "rgba(139, 38, 53, 0.1)",
                                    border: "1px solid rgba(139, 38, 53, 0.25)",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    color: "#7A1C2A",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                }}
                            >
                                ✦ {isEn ? "Special Offer" : "Giá ưu đãi"}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#857567",
                                marginBottom: 7,
                            }}
                        >
                            {isEn ? "TREATMENT DETAILS" : "CHI TIẾT LIỆU TRÌNH"}
                        </div>
                        <p
                            style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 13,
                                lineHeight: 1.75,
                                color: "#54493F",
                                margin: 0,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {description || (isEn ? "Specialized nail care treatment provided by Mộc Salon's master artists with premium organic products and medical-grade sanitation." : "Liệu trình chăm sóc móng chuyên sâu tại Mộc Salon với kỹ thuật viên lành nghề, dòng sơn dưỡng organic cao cấp và quy trình tiệt trùng chuẩn y khoa.")}
                        </p>
                    </div>

                    {/* Salon Standards Checklist */}
                    <div style={{ marginBottom: 24 }}>
                        <div
                            style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 10.5,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#857567",
                                marginBottom: 10,
                            }}
                        >
                            {isEn ? "SALON STANDARDS & CARE" : "CAM KẾT TẠI MỘC SALON"}
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: 7,
                            }}
                        >
                            {[
                                isEn ? "100% Autoclave-sterilized tools sealed in individual medical pouches" : "Dụng cụ tiệt trùng Autoclave niêm phong túi riêng cho từng khách",
                                isEn ? "Premium non-toxic, vegan organic gel polish imported directly" : "Sơn gel cao cấp không chì, không hóa chất độc hại, dưỡng móng",
                                isEn ? "Complimentary herbal tea, light refreshments & relaxing spa vibe" : "Thưởng thức trà thảo mộc & không gian thư giãn phong cách Mộc",
                                isEn ? "7-day complimentary nail guarantee & aftercare consultation" : "Bảo hành móng 7 ngày & tư vấn chăm sóc móng tại nhà miễn phí",
                            ].map((feat, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 9,
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: 12,
                                        lineHeight: 1.55,
                                        color: "#4A3F35",
                                    }}
                                >
                                    <span style={{ color: "#C2A979", fontSize: 11, marginTop: 1, flexShrink: 0 }}>✦</span>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            marginTop: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <Link
                            href={bookingUrl}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                padding: "13px 22px",
                                background: "linear-gradient(135deg, #C2A979 0%, #A28448 100%)",
                                color: "#ffffff",
                                textDecoration: "none",
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: 12.5,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                borderRadius: 12,
                                boxShadow: "0 4px 18px rgba(194, 169, 121, 0.35)",
                                transition: "all 0.25s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-1.5px)";
                                e.currentTarget.style.boxShadow = "0 6px 24px rgba(194, 169, 121, 0.48)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "0 4px 18px rgba(194, 169, 121, 0.35)";
                            }}
                        >
                            <span>{isEn ? "Book This Treatment" : "Đặt lịch trải nghiệm ngay"}</span>
                            <span>→</span>
                        </Link>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                                flexWrap: "wrap",
                            }}
                        >
                            <Link
                                href={servicesUrl}
                                style={{
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#857567",
                                    textDecoration: "none",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.color = "#231B15")}
                                onMouseOut={(e) => (e.currentTarget.style.color = "#857567")}
                            >
                                {isEn ? "View all treatments →" : "Xem tất cả dịch vụ & bảng giá →"}
                            </Link>

                            {settings.hotline && (
                                <a
                                    href={`tel:${settings.hotline}`}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#967840",
                                        textDecoration: "none",
                                        transition: "color 0.2s ease",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.color = "#231B15")}
                                    onMouseOut={(e) => (e.currentTarget.style.color = "#967840")}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <span>{settings.hotline}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Gallery Lightbox                                         */
/* ─────────────────────────────────────────────────────── */
function HomeGalleryLightbox({ img, onClose }: { img: GalleryItemData; onClose: () => void }) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 220);
    }, [isClosing, onClose]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", fn);
        return () => {
            window.removeEventListener("keydown", fn);
            document.body.style.overflow = prevOverflow;
        };
    }, [handleClose]);

    const title = getLocalizedText(img.title, locale);
    const category = getLocalizedText(img.category, locale);

    return (
        <div
            onClick={handleClose}
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? "View enlarged photo" : "Xem ảnh phóng to"}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100000,
                backgroundColor: "rgba(12, 10, 8, 0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
                animation: isClosing
                    ? "luxuryModalFadeOut 0.22s ease-out forwards"
                    : "luxuryModalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
        >
            {/* Minimalist Floating Close Button */}
            <button
                type="button"
                onClick={handleClose}
                aria-label={isEn ? "Close" : "Đóng"}
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 100010,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#FFFFFF",
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.35)";
                    e.currentTarget.style.borderColor = "#C2A979";
                    e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                ✕
            </button>

            {/* Photo Card Container - tightly wraps the photo */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "min(94vw, 880px)",
                    maxHeight: "90vh",
                    willChange: "transform, opacity",
                    animation: isClosing
                        ? "luxuryLightboxScaleOut 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                        : "luxuryLightboxScaleIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        display: "inline-block",
                        maxWidth: "100%",
                        maxHeight: "82vh",
                        borderRadius: 18,
                        overflow: "hidden",
                        boxShadow: "0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(194, 169, 121, 0.25)",
                        background: "#161311",
                    }}
                >
                    {/* Top hairline ribbon */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
                            zIndex: 2,
                        }}
                    />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.image}
                        alt={title || "Mẫu nail art tại Mộc Salon"}
                        style={{
                            display: "block",
                            maxWidth: "100%",
                            maxHeight: "78vh",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            margin: "0 auto",
                        }}
                    />

                    {/* Perfectly Centered Overlay Caption pinned to photo frame */}
                    {(title || category) && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "linear-gradient(to top, rgba(16, 13, 11, 0.94) 0%, rgba(16, 13, 11, 0.65) 60%, transparent 100%)",
                                padding: "44px 24px 22px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                boxSizing: "border-box",
                            }}
                        >
                            {category && (
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "#C2A979",
                                        marginBottom: 6,
                                        background: "rgba(194, 169, 121, 0.16)",
                                        padding: "3px 12px",
                                        borderRadius: 20,
                                        border: "1px solid rgba(194, 169, 121, 0.32)",
                                    }}
                                >
                                    <span>✦</span>
                                    <span>{category}</span>
                                </span>
                            )}
                            {title && (
                                <div
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: "clamp(18px, 2.4vw, 24px)",
                                        fontStyle: "italic",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                        lineHeight: 1.35,
                                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                                        maxWidth: 620,
                                    }}
                                >
                                    {title}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Gallery – Bento Grid                                     */
/* ─────────────────────────────────────────────────────── */
function Gallery({
    gallery,
    onSelectItem,
}: {
    gallery: GalleryItemData[];
    onSelectItem: (item: GalleryItemData) => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";

    const defaultGallery: GalleryItemData[] = [
        { id: "default-banner", title: "Nail artistry", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg", category: "Nails", order: 0, isActive: true },
        { id: "default-pedicure", title: "Pedicure care", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg", category: "Pedicure", order: 1, isActive: true },
        { id: "default-nail-art", title: "Custom nail art", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg", category: "Nail Art", order: 2, isActive: true },
        { id: "default-team", title: "Salon experience", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910446/moc-salon/hrzz84u08aqrlvhimgzk.jpg", category: "Salon", order: 3, isActive: true },
        { id: "default-nails", title: "Signature manicure", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg", category: "Manicure", order: 4, isActive: true },
        { id: "default-detail", title: "Luxury detail", image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg", category: "Nail Art", order: 5, isActive: true },
    ];
    const items = (gallery.length > 0 ? gallery : defaultGallery).slice(0, 10);
    const spans = ["row-span-2", "", "col-span-2 row-span-2", "", "", "row-span-2", "", "", "col-span-2", ""];

    return (
        <section className="homepage-gallery" style={{ background: "#F9F9F9", padding: "160px 0" }}>
            <div className="homepage-gallery__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,54px)", fontWeight: 700, color: "#C2A979", fontStyle: "italic", margin: "0 0 8px" }}>
                        {isEn ? "Nail Art Gallery" : "Bộ sưu tập móng nghệ thuật"}
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999" }}>
                        {isEn ? "Curated Nail Art Collection – Mộc Salon" : "Bộ Sưu Tập Móng Nghệ Thuật – Mộc Salon"}
                    </p>
                </div>

                <div className="homepage-gallery__grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: 280, gap: 12 }}>
                    {items.map((g, i) => (
                        <GalleryItem
                            key={g.id}
                            item={g}
                            span={spans[i] || ""}
                            onClick={() => onSelectItem(g)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GalleryItem({
    item,
    span,
    onClick,
}: {
    item: GalleryItemData;
    span: string;
    onClick: () => void;
}) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const ref = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    const gridStyles: React.CSSProperties = {};
    if (span.includes("row-span-2")) gridStyles.gridRow = "span 2";
    if (span.includes("col-span-2")) gridStyles.gridColumn = "span 2";

    const title = getLocalizedText(item.title, locale);
    const category = getLocalizedText(item.category, locale);

    return (
        <div
            ref={ref}
            role="button"
            tabIndex={0}
            aria-label={isEn ? `View image ${title || category}` : `Xem ảnh ${title || category}`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            style={{ overflow: "hidden", cursor: "pointer", position: "relative", outline: "none", ...gridStyles }}
            onMouseOver={() => {
                if (imgRef.current) { imgRef.current.style.transform = "scale(1.06)"; }
                if (overlayRef.current) overlayRef.current.style.opacity = "1";
                if (btnRef.current) btnRef.current.style.transform = "translateY(0) scale(1)";
            }}
            onMouseOut={() => {
                if (imgRef.current) { imgRef.current.style.transform = "scale(1)"; }
                if (overlayRef.current) overlayRef.current.style.opacity = "0";
                if (btnRef.current) btnRef.current.style.transform = "translateY(8px) scale(0.95)";
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={item.image}
                alt={title || "Mộc Salon"}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .65s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
            <div
                ref={overlayRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(14, 11, 9, 0.82) 0%, rgba(14, 11, 9, 0.3) 45%, rgba(14, 11, 9, 0.12) 100%)",
                    opacity: 0,
                    transition: "opacity .35s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {/* Center refined glassmorphism zoom button */}
                <div
                    ref={btnRef}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 18px",
                        backgroundColor: "rgba(22, 17, 14, 0.78)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        color: "#FAF7F2",
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        borderRadius: 30,
                        border: "1px solid rgba(194, 169, 121, 0.42)",
                        boxShadow: "0 12px 28px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06) inset",
                        transform: "translateY(8px) scale(0.95)",
                        transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C2A979" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16" y2="16" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <span>{isEn ? "Zoom photo" : "Phóng to ảnh"}</span>
                </div>

                {/* Subtle bottom info if title/category exists */}
                {(title || category) && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "16px 20px",
                            textAlign: "center",
                            pointerEvents: "none",
                        }}
                    >
                        {category && (
                            <div
                                style={{
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    color: "#C2A979",
                                    marginBottom: 3,
                                }}
                            >
                                {category}
                            </div>
                        )}
                        {title && (
                            <div
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: 15,
                                    fontStyle: "italic",
                                    color: "#FFFFFF",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {title}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Main Page Component                                      */
/* ─────────────────────────────────────────────────────── */
export default function HomePage({ services, gallery, settings }: { services: ServiceData[]; gallery: GalleryItemData[]; settings: SiteSettings }) {
    useReveal();
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItemData | null>(null);

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #FDFBF7; }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes rotateSeal {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .homepage-booking-panel { width: min(400px, 100vw); }

        @media (max-width: 1023px) {
          .homepage-booking-tab { display: none !important; }
          .homepage-hero { min-height: auto !important; padding: 128px 0 72px !important; }
          .homepage-hero__inner, .homepage-about__inner, .homepage-services__inner { padding-inline: var(--public-gutter) !important; }
          .homepage-hero__inner { grid-template-columns: 1fr !important; gap: 48px !important; }
          .homepage-hero__images { max-width: 680px; margin-inline: auto; }
          .homepage-about { padding-block: var(--public-section-space) !important; }
          .homepage-about__inner { grid-template-columns: 1fr !important; gap: 64px !important; }
          .homepage-services { padding-block: var(--public-section-space) !important; }
          .homepage-gallery { padding-block: var(--public-section-space) !important; }
          .homepage-gallery__inner { padding-inline: var(--public-gutter) !important; }
          .homepage-gallery__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; grid-auto-rows: minmax(160px, 31vw) !important; }
          .homepage-services__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 14px !important; }
          .homepage-services__grid > div { height: clamp(300px, 64vw, 460px) !important; }
        }

        @media (max-width: 767px) {
          .service-detail-modal-content {
            grid-template-columns: 1fr !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
          .service-detail-modal-image-col {
            min-height: 240px !important;
            max-height: 280px !important;
          }
          .service-detail-modal-info-col {
            padding: 24px 20px 24px !important;
          }
        }

        @media (max-width: 600px) {
          .homepage-booking-panel { width: 100vw !important; }
          .homepage-booking-panel > div:first-child { padding: max(24px, env(safe-area-inset-top)) 20px 18px !important; }
          .homepage-booking-panel > div:nth-child(3) { padding: 20px !important; }
          .homepage-booking-panel > div:last-child { padding: 16px 20px max(16px, env(safe-area-inset-bottom)) !important; }
          .homepage-booking-form-grid { grid-template-columns: 1fr !important; }
          .homepage-hero__inner { gap: 36px !important; }
          .homepage-hero__images { gap: 0 !important; }
          .homepage-hero__secondary-image { margin-top: 28px !important; margin-left: -24px !important; }
          .homepage-hero h1 { font-size: clamp(38px, 12vw, 54px) !important; }
          .homepage-hero p { font-size: 15px !important; }
          .homepage-about__inner { gap: 48px !important; }
          .homepage-about__inner > div:first-child { padding-right: 26px !important; padding-bottom: 32px !important; }
          .homepage-about__inner > div:first-child > div { width: 88% !important; }
          .homepage-about__inner > div:first-child > div > div[style*="width: 160px"] { width: 104px !important; height: 104px !important; right: -24px !important; bottom: -24px !important; }
          .homepage-feature-list { grid-template-columns: 1fr !important; gap: 14px !important; }
          .homepage-gallery__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; grid-auto-rows: 44vw !important; gap: 8px !important; }
          .homepage-gallery__grid > div { grid-column: auto !important; grid-row: auto !important; }
          .homepage-services__grid { grid-template-columns: 1fr !important; }
          .homepage-services__grid > div { height: min(118vw, 440px) !important; }
        }

        @media (hover: none), (pointer: coarse) {
          .homepage-services__grid a { opacity: 1 !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.is-visible { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

            <main>
                <Hero settings={settings} />
                <About settings={settings} />
                <Services services={services} settings={settings} onSelectService={setSelectedService} />
                <Gallery gallery={gallery} onSelectItem={setSelectedGalleryItem} />
            </main>

            <SlideOutBooking services={services} settings={settings} />

            {selectedService && (
                <ServiceDetailModal
                    service={selectedService}
                    settings={settings}
                    onClose={() => setSelectedService(null)}
                />
            )}

            {selectedGalleryItem && (
                <HomeGalleryLightbox
                    img={selectedGalleryItem}
                    onClose={() => setSelectedGalleryItem(null)}
                />
            )}
        </>
    );
}
