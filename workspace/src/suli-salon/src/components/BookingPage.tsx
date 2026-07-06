"use client";
import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────── */
/* Data                                                     */
/* ─────────────────────────────────────────────────────── */
const BRANCHES = [
    { id: "praha12", name: "Suli Salon – Praha 12", address: "Cs. exilu 2154, 143 00 Praha 12", hours: "Mon–Sat: 09:00–19:00" },
    { id: "center", name: "Suli Salon – Center", address: "Wenceslas Square 1, 110 00 Praha 1", hours: "Mon–Sun: 10:00–20:00" },
];

const SERVICES = [
    { id: "1", cat: "Nails", name: "Classic Manicure", price: "500 CZK", duration: "45 min" },
    { id: "2", cat: "Nails", name: "Gel Polish Manicure", price: "700 CZK", duration: "60 min", popular: true },
    { id: "3", cat: "Nails", name: "Nail Extensions – New Set", price: "1 200 CZK", duration: "90 min" },
    { id: "4", cat: "Nails", name: "Spa Pedicure", price: "800 CZK", duration: "60 min" },
    { id: "5", cat: "Facial", name: "Deep Cleansing Facial", price: "1 500 CZK", duration: "60 min" },
    { id: "6", cat: "Facial", name: "Anti-Aging Treatment", price: "1 800 CZK", duration: "90 min", popular: true },
    { id: "7", cat: "Eyelashes", name: "Classic Lash Extensions", price: "1 100 CZK", duration: "90 min" },
    { id: "8", cat: "Eyelashes", name: "Volume Lash Extensions", price: "1 400 CZK", duration: "120 min", popular: true },
    { id: "9", cat: "Eyelashes", name: "Lash Lifting", price: "900 CZK", duration: "60 min" },
    { id: "10", cat: "Eyebrows", name: "Brow Lamination", price: "850 CZK", duration: "60 min", popular: true },
    { id: "11", cat: "Eyebrows", name: "Eyebrow Shaping", price: "300 CZK", duration: "20 min" },
    { id: "12", cat: "Eyebrows", name: "Ombre Brows", price: "2 200 CZK", duration: "150 min" },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:30", "14:30", "15:30", "16:30", "17:30", "18:00"];

type FormData = {
    branch: string;
    serviceId: string;
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
const STEP_LABELS = ["Branch", "Service", "Date & Time", "Details"];

function StepBar({ current }: { current: number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
            {STEP_LABELS.map((label, i) => {
                const num = i + 1;
                const active = num === current;
                const done = num < current;
                return (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : "none" }}>
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
                        {i < STEP_LABELS.length - 1 && (
                            <div style={{ flex: 1, height: 1, marginBottom: 22, background: done ? "linear-gradient(90deg,#C2A979,#a08040)" : "#EAE5DC", transition: "background .35s", margin: "0 8px 22px" }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Booking Summary Sidebar                                  */
/* ─────────────────────────────────────────────────────── */
function BookingSummary({ data }: { data: FormData }) {
    const svc = SERVICES.find((s) => s.id === data.serviceId);
    const branch = BRANCHES.find((b) => b.id === data.branch);
    const hasContent = data.branch || data.serviceId || data.date;

    return (
        <div style={{ background: "#1A1A1A", padding: "40px 36px", position: "sticky", top: 100, minHeight: 400, display: "flex", flexDirection: "column" }}>
            {/* Logo */}
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontStyle: "italic", fontWeight: 700, color: "#C2A979", marginBottom: 32 }}>
                Suli Salon
            </div>

            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 24 }}>
                Your Booking Summary
            </div>

            {!hasContent ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#444", textAlign: "center", lineHeight: 1.6 }}>
                        Your selections will appear here as you complete each step.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
                    {branch && (
                        <SummaryRow icon="📍" label="Branch" value={branch.name} sub={branch.address} />
                    )}
                    {svc && (
                        <SummaryRow icon="✦" label="Service" value={svc.name} sub={`${svc.duration} · ${svc.price}`} />
                    )}
                    {data.date && (
                        <SummaryRow icon="📅" label="Date" value={new Date(data.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
                    )}
                    {data.time && (
                        <SummaryRow icon="🕐" label="Time" value={data.time} />
                    )}
                    {data.name && (
                        <SummaryRow icon="👤" label="Name" value={data.name} />
                    )}
                </div>
            )}

            {svc && (
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #2a2a2a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555" }}>Total</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#C2A979" }}>{svc.price}</span>
                    </div>
                </div>
            )}
        </div>
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
/* Main Booking Page                                        */
/* ─────────────────────────────────────────────────────── */
export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [done, setDone] = useState(false);
    const [activeCat, setActiveCat] = useState("Nails");
    const [form, setForm] = useState<FormData>({
        branch: "", serviceId: "", date: "", time: "", name: "", phone: "", email: "", notes: "",
    });

    const inputStyle = (focused?: boolean): React.CSSProperties => ({
        width: "100%", padding: "14px 16px",
        border: `1.5px solid ${focused ? "#C2A979" : "#E0D8CC"}`,
        borderRadius: 4, fontSize: 14,
        fontFamily: "Montserrat,sans-serif", color: "#2E2E2E",
        outline: "none", background: "#fff", boxSizing: "border-box",
        transition: "border-color .25s",
    });

    const cats = [...new Set(SERVICES.map((s) => s.cat))];
    const filteredServices = SERVICES.filter((s) => s.cat === activeCat);

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
                            Booking Confirmed
                        </div>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 16px" }}>
                            See You Soon, {form.name.split(" ")[0]}!
                        </h2>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, lineHeight: 1.7, color: "#6B6B6B", marginBottom: 8 }}>
                            Your appointment is set for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
                        </p>
                        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, color: "#AAA", marginBottom: 36 }}>
                            A confirmation has been sent to <strong>{form.email}</strong>.
                        </p>
                        <Link href="/">
                            <button style={{ background: "#2E2E2E", color: "#fff", padding: "14px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                                Back to Home
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
            <div style={{ minHeight: "100vh", background: "#FDFBF7", paddingTop: 88 }}>
                {/* Top bar */}
                <div style={{ background: "#F4F1EA", borderBottom: "1px solid #EAE5DC", padding: "20px 64px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
                        <Link href="/" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA", textDecoration: "none" }}>Home</Link>
                        <span style={{ color: "#CCC" }}>›</span>
                        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#C2A979", fontWeight: 600 }}>Book Appointment</span>
                    </div>
                </div>

                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 64px 100px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "start" }}>

                    {/* LEFT: Form */}
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                                Online Booking
                            </div>
                            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, fontStyle: "italic", color: "#2E2E2E", margin: "0 0 32px" }}>
                                Book Your Appointment
                            </h1>
                        </div>

                        <StepBar current={step} />

                        {/* ── Step 1: Branch ───────────────────────── */}
                        {step === 1 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    Step 1 — Choose Your Branch
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
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
                                <NextBtn disabled={!form.branch} onClick={() => setStep(2)} />
                            </div>
                        )}

                        {/* ── Step 2: Service ──────────────────────── */}
                        {step === 2 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    Step 2 — Choose a Service
                                </div>
                                {/* Cat pills */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                                    {cats.map((c) => (
                                        <button key={c} onClick={() => setActiveCat(c)}
                                            style={{ padding: "8px 18px", border: `1.5px solid ${activeCat === c ? "#C2A979" : "#E0D8CC"}`, background: activeCat === c ? "#C2A979" : "transparent", color: activeCat === c ? "#fff" : "#888", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 40, transition: "all .25s" }}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                {/* Service list */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                                    {filteredServices.map((s) => {
                                        const sel = form.serviceId === s.id;
                                        return (
                                            <div key={s.id} onClick={() => setForm({ ...form, serviceId: s.id })}
                                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer", border: `1.5px solid ${sel ? "#C2A979" : "#E0D8CC"}`, background: sel ? "#FFFAF4" : "#fff", transition: "all .25s", gap: 16 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? "#C2A979" : "#DDD"}`, background: sel ? "#C2A979" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s" }}>
                                                        {sel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, fontWeight: 600, color: "#2E2E2E" }}>{s.name}</span>
                                                            {"popular" in s && s.popular && <span style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", fontSize: 9, fontFamily: "Montserrat,sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px" }}>Popular</span>}
                                                        </div>
                                                        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#AAA" }}>⏱ {s.duration}</span>
                                                    </div>
                                                </div>
                                                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#C2A979", flexShrink: 0 }}>{s.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <BackBtn onClick={() => setStep(1)} />
                                    <NextBtn disabled={!form.serviceId} onClick={() => setStep(3)} />
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Date & Time ──────────────────── */}
                        {step === 3 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    Step 3 — Pick a Date &amp; Time
                                </div>
                                <div style={{ marginBottom: 28 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                                        Preferred Date
                                    </label>
                                    <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        style={{ ...inputStyle(), maxWidth: 280 }} />
                                </div>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
                                        Available Time Slots
                                    </label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                                        {TIME_SLOTS.map((t) => {
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
                                    <BackBtn onClick={() => setStep(2)} />
                                    <NextBtn disabled={!form.date || !form.time} onClick={() => setStep(4)} />
                                </div>
                            </div>
                        )}

                        {/* ── Step 4: Details ──────────────────────── */}
                        {step === 4 && (
                            <div>
                                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>
                                    Step 4 — Your Details
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Full Name *</label>
                                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inputStyle()} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Phone *</label>
                                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+420 xxx xxx xxx" style={inputStyle()} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Email Address *</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={inputStyle()} />
                                </div>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Notes (optional)</label>
                                    <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requests or allergies?" style={{ ...inputStyle(), resize: "vertical" }} />
                                </div>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <BackBtn onClick={() => setStep(3)} />
                                    <button onClick={() => setDone(true)} disabled={!form.name || !form.phone || !form.email}
                                        style={{ flex: 1, background: (!form.name || !form.phone || !form.email) ? "#DDD" : "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "18px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: !form.name || !form.phone || !form.email ? "not-allowed" : "pointer", transition: "all .3s", boxShadow: (!form.name || !form.phone || !form.email) ? "none" : "0 6px 24px rgba(194,169,121,.35)" }}>
                                        Confirm Booking ✓
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar */}
                    <BookingSummary data={form} />
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Shared Buttons                                           */
/* ─────────────────────────────────────────────────────── */
function NextBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} disabled={disabled}
            style={{ flex: 1, background: disabled ? "#EAE5DC" : "linear-gradient(135deg,#C2A979,#a08040)", color: disabled ? "#CCC" : "#fff", padding: "16px 32px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "all .3s", boxShadow: disabled ? "none" : "0 4px 20px rgba(194,169,121,.35)" }}>
            Continue →
        </button>
    );
}

function BackBtn({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick}
            style={{ background: "transparent", color: "#888", padding: "16px 20px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "1.5px solid #E0D8CC", cursor: "pointer", transition: "all .3s" }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C2A979"; (e.currentTarget as HTMLElement).style.color = "#C2A979"; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E0D8CC"; (e.currentTarget as HTMLElement).style.color = "#888"; }}>
            ← Back
        </button>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Inline styles                                            */
/* ─────────────────────────────────────────────────────── */
const styles_css = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
`;
