"use client";
import { useState } from "react";
import Link from "next/link";
import type { ServiceData, SiteSettings, CategoryData } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath, getLocalizedText, getLocalizedPrice } from "@/lib/i18n/routes";

/* ─────────────────────────────────────────────────────── */
/* Types                                                    */
/* ─────────────────────────────────────────────────────── */
type FormData = {
    branch: string;
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
};

/* ─────────────────────────────────────────────────────── */
/* Step Progress Indicator                                  */
/* ─────────────────────────────────────────────────────── */
function StepBar({ current, stepLabels }: { current: number; stepLabels: string[] }) {
    return (
        <div className="booking-stepbar" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
            {stepLabels.map((label, i) => {
                const num = i + 1;
                const active = num === current;
                const done = num < current;
                return (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: done ? "linear-gradient(135deg,#C2A979,#a08040)" : active ? "#2E2E2E" : "#EAE5DC",
                                color: done || active ? "#fff" : "#AAA",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 700,
                                transition: "all .35s",
                                boxShadow: active ? "0 4px 16px rgba(0,0,0,.15)" : "none",
                            }}>
                                {done ? "✓" : num}
                            </div>
                            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? "#2E2E2E" : done ? "#C2A979" : "#CCC", whiteSpace: "nowrap" }}>
                                {label}
                            </span>
                        </div>
                        {i < stepLabels.length - 1 && (
                            <div style={{ flex: 1, height: 1, marginBottom: 22, background: done ? "linear-gradient(90deg,#C2A979,#a08040)" : "#EAE5DC", transition: "background .35s", margin: "0 8px 22px" }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Main Booking Page                                        */
/* ─────────────────────────────────────────────────────── */
export default function BookingPage({ services, settings, categories }: { services: ServiceData[], settings: SiteSettings, categories: CategoryData[] }) {
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";

    const defaultHours = isEn ? "Mon-Sun: 9:00 - 20:00" : "Thứ 2 - CN: 9:00 - 20:00";
    const BRANCHES = [
        {
            id: "main",
            name: settings.siteName || "Mộc Salon",
            address: getLocalizedText(settings.address, locale),
            hours: getLocalizedText(settings.workingHours, locale) || defaultHours,
        },
    ];

    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [activeCatId, setActiveCatId] = useState(categories.length > 0 ? categories[0].id : "");

    const [form, setForm] = useState<FormData>({
        branch: "", serviceId: "", serviceName: "", date: "", time: "", name: "", phone: "", email: "", notes: "",
    });

    const stepLabels = isEn
        ? ["Branch", "Service", "Date & Time", "Details"]
        : ["Chi nhánh", "Dịch vụ", "Ngày & Giờ", "Thông tin"];

    const homeHref = getLocalizedPath(locale, "home");

    const inputStyle = (focused?: boolean): React.CSSProperties => ({
        width: "100%", padding: "14px 16px",
        border: `1.5px solid ${focused ? "#C2A979" : "#E0D8CC"}`,
        borderRadius: 4, fontSize: 14,
        fontFamily: "Montserrat,sans-serif", color: "#2E2E2E",
        outline: "none", background: "#fff", boxSizing: "border-box",
        transition: "border-color .25s",
    });

    const filteredServices = services.filter((s) => s.categoryId === activeCatId);
    const departureSlots = settings.departureSlots || ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    async function submitBooking() {
        if (!form.name || !form.phone || !form.email || !form.date || !form.time || !form.serviceName) {
            setErrorMsg(dictionary.common.requiredFields);
            return;
        }
        setIsSubmitting(true);
        setErrorMsg("");
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: form.name,
                    phone: form.phone,
                    email: form.email,
                    date: form.date,
                    time: form.time,
                    serviceName: form.serviceName,
                    note: form.notes,
                }),
            });
            if (!res.ok) throw new Error("Failed to book");
            setDone(true);
        } catch {
            setErrorMsg(dictionary.common.error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (done) {
        return (
            <>
                <style>{styles_css}</style>
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F1EA", paddingTop: 80 }}>
                    <div style={{ textAlign: "center", maxWidth: 520, padding: "64px 40px", background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,.08)" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#C2A979,#a08040)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 36, boxShadow: "0 8px 32px rgba(194,169,121,.4)" }}>
                            ✓
                        </div>
                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                            {isEn ? "Booking Confirmed" : "Đặt lịch thành công"}
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 16px" }}>
                            {isEn ? `See You Soon, ${form.name.split(" ")[0]}!` : `Hẹn gặp bạn sớm, ${form.name.split(" ")[0]}!`}
                        </h2>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.7, color: "#6B6B6B", marginBottom: 8 }}>
                            {isEn
                                ? <>Your appointment is set for <strong>{form.date}</strong> at <strong>{form.time}</strong>.</>
                                : <>Lịch hẹn của bạn được xếp vào ngày <strong>{form.date}</strong> lúc <strong>{form.time}</strong>.</>}
                        </p>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#AAA", marginBottom: 36 }}>
                            {isEn
                                ? <>A confirmation has been sent to <strong>{form.email}</strong>.</>
                                : <>Thông tin xác nhận đã được gửi tới <strong>{form.email}</strong>.</>}
                        </p>
                        <Link href={homeHref}>
                            <button style={{ background: "#2E2E2E", color: "#fff", padding: "14px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                                {isEn ? "Back to Home" : "Quay lại trang chủ"}
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{styles_css}</style>

            {/* Page layout: form left, sidebar right */}
            <div className="booking-page" style={{ minHeight: "100vh", background: "#FDFBF7", paddingTop: 88 }}>
                {/* Top bar */}
                <div className="booking-breadcrumb" style={{ background: "#F4F1EA", borderBottom: "1px solid #EAE5DC", padding: "20px 64px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
                        <Link href={homeHref} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA", textDecoration: "none" }}>
                            {dictionary.common.home}
                        </Link>
                        <span style={{ color: "#CCC" }}>›</span>
                        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#C2A979", fontWeight: 600 }}>
                            {dictionary.nav.booking}
                        </span>
                    </div>
                </div>

                <div className="booking-layout" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 64px 100px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "start" }}>

                    {/* LEFT: Form */}
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                                {isEn ? "Online Booking" : "Đặt lịch trực tuyến"}
                            </div>
                            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 32px" }}>
                                {isEn ? "Book Your Appointment" : "Đặt lịch hẹn của bạn"}
                            </h1>
                        </div>

                        <StepBar current={step} stepLabels={stepLabels} />

                        {errorMsg && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 16, fontFamily: "Montserrat,sans-serif" }}>{errorMsg}</div>}

                        {/* ── Step 1: Branch ───────────────────────── */}
                        {step === 1 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    {isEn ? "Step 1 — Choose Your Branch" : "Bước 1 — Chọn chi nhánh"}
                                </div>
                                <div className="booking-branch-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                                    {BRANCHES.map((b) => {
                                        const sel = form.branch === b.id;
                                        return (
                                            <div
                                                key={b.id}
                                                onClick={() => setForm({ ...form, branch: b.id })}
                                                style={{
                                                    padding: "28px 24px", cursor: "pointer",
                                                    border: `2px solid ${sel ? "#C2A979" : "#E0D8CC"}`,
                                                    background: sel ? "#FFFAF4" : "#fff",
                                                    transition: "all .25s", position: "relative",
                                                    boxShadow: sel ? "0 8px 32px rgba(194,169,121,.15)" : "0 2px 12px rgba(0,0,0,.04)",
                                                }}
                                                onMouseOver={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.borderColor = "#D4C0A0"; }}
                                                onMouseOut={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.borderColor = "#E0D8CC"; }}
                                            >
                                                {sel && <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#C2A979,#a08040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>✓</div>}
                                                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#2E2E2E", marginBottom: 6 }}>{b.name}</div>
                                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#888", lineHeight: 1.6 }}>{b.address}</div>
                                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#C2A979", marginTop: 8, fontWeight: 600 }}>{b.hours}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <NextBtn label={isEn ? "Continue →" : "Tiếp tục →"} disabled={!form.branch} onClick={() => setStep(2)} />
                            </div>
                        )}

                        {/* ── Step 2: Service ──────────────────────── */}
                        {step === 2 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    {isEn ? "Step 2 — Choose a Service" : "Bước 2 — Chọn dịch vụ"}
                                </div>
                                {/* Cat pills */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                                    {categories.map((c) => (
                                        <button key={c.id} onClick={() => setActiveCatId(c.id)}
                                            style={{ padding: "8px 18px", border: `1.5px solid ${activeCatId === c.id ? "#C2A979" : "#E0D8CC"}`, background: activeCatId === c.id ? "#C2A979" : "transparent", color: activeCatId === c.id ? "#fff" : "#888", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 40, transition: "all .25s" }}>
                                            {getLocalizedText(c.label, locale)}
                                        </button>
                                    ))}
                                </div>
                                {/* Service list */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                                    {filteredServices.map((s) => {
                                        const sel = form.serviceId === s.id;
                                        const localizedName = getLocalizedText(s.name, locale);
                                        const localizedPrice = getLocalizedPrice(s.price, locale);
                                        return (
                                            <div key={s.id} onClick={() => setForm({ ...form, serviceId: s.id, serviceName: localizedName })}
                                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer", border: `1.5px solid ${sel ? "#C2A979" : "#E0D8CC"}`, background: sel ? "#FFFAF4" : "#fff", transition: "all .25s", gap: 16 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? "#C2A979" : "#DDD"}`, background: sel ? "#C2A979" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s" }}>
                                                        {sel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, fontWeight: 600, color: "#2E2E2E" }}>{localizedName}</span>
                                                        </div>
                                                        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA" }}>⏱ {s.duration} {isEn ? "min" : "phút"}</span>
                                                    </div>
                                                </div>
                                                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#C2A979", flexShrink: 0 }}>{localizedPrice}</span>
                                            </div>
                                        );
                                    })}
                                    {filteredServices.length === 0 && <p style={{fontFamily: "Montserrat", fontSize: 13}}>{isEn ? "No services found in this category." : "Không có dịch vụ nào trong danh mục này."}</p>}
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <BackBtn label={isEn ? "← Back" : "← Quay lại"} onClick={() => setStep(1)} />
                                    <NextBtn label={isEn ? "Continue →" : "Tiếp tục →"} disabled={!form.serviceId} onClick={() => setStep(3)} />
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Date & Time ──────────────────── */}
                        {step === 3 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    {isEn ? "Step 3 — Pick a Date & Time" : "Bước 3 — Chọn ngày & giờ"}
                                </div>
                                <div style={{ marginBottom: 28 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                                        {isEn ? "Preferred Date" : "Ngày hẹn mong muốn"}
                                    </label>
                                    <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        style={{ ...inputStyle(), maxWidth: 280 }} />
                                </div>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
                                        {isEn ? "Available Time Slots" : "Khung giờ còn trống"}
                                    </label>
                                    <div className="booking-times" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                                        {departureSlots.map((t) => {
                                            const sel = form.time === t;
                                            return (
                                                <button key={t} onClick={() => setForm({ ...form, time: t })}
                                                    style={{ padding: "12px 0", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${sel ? "#C2A979" : "#E0D8CC"}`, background: sel ? "linear-gradient(135deg,#C2A979,#a08040)" : "#fff", color: sel ? "#fff" : "#2E2E2E", transition: "all .25s", boxShadow: sel ? "0 4px 16px rgba(194,169,121,.3)" : "none" }}>
                                                    {t}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <BackBtn label={isEn ? "← Back" : "← Quay lại"} onClick={() => setStep(2)} />
                                    <NextBtn label={isEn ? "Continue →" : "Tiếp tục →"} disabled={!form.date || !form.time} onClick={() => setStep(4)} />
                                </div>
                            </div>
                        )}

                        {/* ── Step 4: Details ──────────────────────── */}
                        {step === 4 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    {isEn ? "Step 4 — Your Details" : "Bước 4 — Thông tin của bạn"}
                                </div>
                                <div className="booking-details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>
                                            {isEn ? "Full Name *" : "Họ và tên *"}
                                        </label>
                                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={isEn ? "Your full name" : "Họ và tên của bạn"} style={inputStyle()} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>
                                            {isEn ? "Phone *" : "Số điện thoại *"}
                                        </label>
                                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={isEn ? "+84 xxx xxx xxx" : "09xx xxx xxx"} style={inputStyle()} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>
                                        {isEn ? "Email Address *" : "Địa chỉ Email *"}
                                    </label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={inputStyle()} />
                                </div>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>
                                        {isEn ? "Notes (optional)" : "Ghi chú thêm (tùy chọn)"}
                                    </label>
                                    <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={isEn ? "Any special requests or questions?" : "Yêu cầu đặc biệt hoặc mẫu móng mong muốn..."} style={{ ...inputStyle(), resize: "vertical" }} />
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <BackBtn label={isEn ? "← Back" : "← Quay lại"} onClick={() => setStep(3)} />
                                    <button onClick={submitBooking} disabled={!form.name || !form.phone || !form.email || isSubmitting}
                                        style={{ flex: 1, background: (!form.name || !form.phone || !form.email || isSubmitting) ? "#DDD" : "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "18px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: (!form.name || !form.phone || !form.email || isSubmitting) ? "not-allowed" : "pointer", transition: "all .3s", boxShadow: (!form.name || !form.phone || !form.email || isSubmitting) ? "none" : "0 6px 24px rgba(194,169,121,.35)", opacity: isSubmitting ? 0.7 : 1 }}>
                                        {isSubmitting ? dictionary.common.sending : (isEn ? "Confirm Booking ✓" : "Xác nhận đặt lịch ✓")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="booking-summary" style={{ background: "#1A1A1A", padding: "40px 36px", position: "sticky", top: 100, minHeight: 400, display: "flex", flexDirection: "column" }}>
                        {/* Logo */}
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontStyle: "italic", fontWeight: 700, color: "#C2A979", marginBottom: 32 }}>
                            {settings.siteName || "Mộc Salon"}
                        </div>

                        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 24 }}>
                            {isEn ? "Your Booking Summary" : "Tóm tắt đặt lịch"}
                        </div>

                        {!(form.branch || form.serviceId || form.date) ? (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#444", textAlign: "center", lineHeight: 1.6 }}>
                                    {isEn ? "Your selections will appear here as you complete each step." : "Các lựa chọn của bạn sẽ hiển thị tại đây khi thực hiện từng bước."}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
                                {form.branch && (
                                    <SummaryRow icon="📍" label={isEn ? "Branch" : "Chi nhánh"} value={BRANCHES[0]?.name || ""} sub={BRANCHES[0]?.address || ""} />
                                )}
                                {form.serviceId && (
                                    <SummaryRow icon="✦" label={isEn ? "Service" : "Dịch vụ"} value={form.serviceName} sub={`${services.find(s => s.id === form.serviceId)?.duration} ${isEn ? "min" : "phút"} · ${getLocalizedPrice(services.find(s => s.id === form.serviceId)?.price, locale)}`} />
                                )}
                                {form.date && (
                                    <SummaryRow icon="📅" label={isEn ? "Date" : "Ngày"} value={new Date(form.date).toLocaleDateString(isEn ? "en-US" : "vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
                                )}
                                {form.time && (
                                    <SummaryRow icon="🕐" label={isEn ? "Time" : "Giờ"} value={form.time} />
                                )}
                                {form.name && (
                                    <SummaryRow icon="👤" label={isEn ? "Name" : "Họ tên"} value={form.name} />
                                )}
                            </div>
                        )}

                        {form.serviceId && (
                            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #2a2a2a" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555" }}>
                                        {isEn ? "Total" : "Tổng chi phí"}
                                    </span>
                                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#C2A979" }}>{getLocalizedPrice(services.find(s => s.id === form.serviceId)?.price, locale)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function SummaryRow({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
    return (
        <div style={{ padding: "16px 0", borderBottom: "1px solid #222" }}>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 4 }}>
                {icon} {label}
            </div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, fontWeight: 600, color: "#ccc" }}>{value}</div>
            {sub && <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#555", marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Shared Buttons                                           */
/* ─────────────────────────────────────────────────────── */
function NextBtn({ disabled, onClick, label = "Continue →" }: { disabled: boolean; onClick: () => void; label?: string }) {
    return (
        <button onClick={onClick} disabled={disabled}
            style={{ flex: 1, background: disabled ? "#EAE5DC" : "linear-gradient(135deg,#C2A979,#a08040)", color: disabled ? "#CCC" : "#fff", padding: "16px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all .3s", boxShadow: disabled ? "none" : "0 4px 20px rgba(194,169,121,.35)" }}>
            {label}
        </button>
    );
}

function BackBtn({ onClick, label = "← Back" }: { onClick: () => void; label?: string }) {
    return (
        <button onClick={onClick}
            style={{ background: "transparent", color: "#888", padding: "16px 20px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "1.5px solid #E0D8CC", cursor: "pointer", transition: "all .3s" }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C2A979"; (e.currentTarget as HTMLElement).style.color = "#C2A979"; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E0D8CC"; (e.currentTarget as HTMLElement).style.color = "#888"; }}>
            {label}
        </button>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Inline styles                                            */
/* ─────────────────────────────────────────────────────── */
const styles_css = `
  *, *::before, *::after { box-sizing: border-box; }

  @media (max-width: 1023px) {
    .booking-breadcrumb { padding-inline: var(--public-gutter) !important; }
    .booking-layout { grid-template-columns: 1fr !important; padding-inline: var(--public-gutter) !important; }
    .booking-summary { position: static !important; min-height: 0 !important; order: -1; }
  }

  @media (max-width: 600px) {
    .booking-page { padding-top: 76px !important; }
    .booking-breadcrumb { padding-block: 16px !important; }
    .booking-layout { padding-top: 38px !important; padding-bottom: 76px !important; gap: 28px !important; }
    .booking-stepbar { margin-bottom: 36px !important; }
    .booking-stepbar > div { min-width: 0; }
    .booking-stepbar span { max-width: 58px; overflow: hidden; font-size: 8px !important; letter-spacing: .04em !important; text-overflow: ellipsis; }
    .booking-stepbar > div > div:nth-child(2) { margin-inline: 4px !important; }
    .booking-branch-grid, .booking-details-grid { grid-template-columns: 1fr !important; }
    .booking-times { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 8px !important; }
    .booking-times button { min-height: 44px; font-size: 12px !important; }
    .booking-summary { padding: 26px 22px !important; }
    .booking-page input, .booking-page textarea, .booking-page select { font-size: 16px !important; }
  }

  @media (max-width: 359px) {
    .booking-times { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .booking-stepbar span { display: none; }
  }
`;
