"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────── */
/* Data                                                     */
/* ─────────────────────────────────────────────────────── */
const SERVICES = [
    {
        title: "Nails",
        img: "https://lh3.googleusercontent.com/aida/AP1WRLsncxcUaLl-kRMraO4Z3lDzU_fTWPnoZq2Nu1fF9l-q2D54UsfpLvZepPtcS0B2zdHpDP019vTTziYl3Lsio_K0RghBV2Kd_31VlBu9YThyB2KfTE2ZzWVM0ChalCmLEx48YQMzPoQilLwQtKH3bk9r8zqYRRm1YjdXdQ4B8Z5Duf5JifHrDxt-Yqx-AJmBZ27EcKAtb5-sZbvqtdbRr6MeDpmlG4q0XU5CqOa9eJhvtE1RQdGItfyviGtS",
    },
    {
        title: "Facial Care",
        img: "https://lh3.googleusercontent.com/aida/AP1WRLvmBUkVHNFLX8ch_FNKHBzKDug9sqEhnNxXqV93sZFRO19ROp_KHIZJOu0aOeObsISyGxs8ds6u8tA0RdSFMfbTIuJx_dE3QmqPM7A938Ym1PnaAFzyFvoKmSn_BfngbhWM2PC1yB5e1GX2GFyzEQrRRPqYhu_d9uh_nVWI1VmGGuNjQB6-uGXWI6T2GRcPIp5751kYnxSCv-z92VVdYNtj7YmftrHK3skW7cZ-wwbVgQzBSADuCzI3f6Xc",
    },
    {
        title: "Eyelashes",
        img: "https://lh3.googleusercontent.com/aida/AP1WRLvvYMW4tC0WzVAhOd3ipWXpoh7jRs9wIx0S7K1Kdh7EKc8odCkT_vB5hQjabtivklH3nVceHH9wgUcWH3iDLFt7mmiBDAhlILRlH5LhzhmBVh_JXZE9LHvzpc_KbgOdYOzsV_AOCIfRRulpr5dcfiR4sJXnzOQz0NEyf2eG08NE3SOSgVzhZ3Il7MA3b_VYPaaBMyiTx14mdmC83Wea1IERfo5fjHZX7SMCQTMUSM3xPhn4WsK0Xs-Nczx-",
    },
    {
        title: "Eyebrows",
        img: "https://lh3.googleusercontent.com/aida/AP1WRLvA13tpO-MB-gIyzZ16CZpoWDDGRxtKCB_vF8CocOZAwA23iscVRX_ARLcroGFuJkq3LdD54fln74NTYIYQQdUrE9RHvVkCwUN70DfJDA8WIgcwkfS3v2AnTEAswCgPzsdn7Qf1kpACwunL2IGizrk3o4zH5o5ZlBG0Ih6DGy8dWJA2EulR902hDyUutORt9vc9zX2BHDHr6_uACENL1JJBN6mWsF5aTT6C-JqXwwOC4rkVMho0MuOgJziy",
    },
];

const GALLERY = [
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvwaaw5PhO3q7G6GDm-putw-oyJ4EEbn-t5NS6uv8fh4RykIks2MCnU6YVn0LP4znv4-1Ff_mj37ahIxRupUrV04EuQUtSZn_U4YbPT5qj1t1ikz5Ym5ejg73mUtrzDpS5bUgofGaD0SOzi5B5rz2cHRhovsjuYLZq7I22Z-NF8nRexRXGv3eMfRKNjLeyFKijT84zHeHJ7og-qWZ3UUGl2GXgRVDYIlD6mN9JcpxPbjnclYXc1e017E8J4", span: "row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu-Kuik5OETZq4lu0EghInZt2VbvsE7SO6grA9jbUt1vVFlZeSq4Z5D4_VYEcri2MeQwieyKuuOwKNGh1RrADEHzO6oTSXneGIjC9WTdt9MTZjbVw9Dfeut0jM297W_8oQMiau9D29VtGcn5HYhS1KE0PscY0Pk_-SKLzjKunbjwdt3aaSdc5o3KScyjYLyG8ZUoHEKJi5gx0tQOcdnTdq_os56DBIfjfyW0IDsV85UHbTPQo0e4mF0CqE", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j", span: "col-span-2 row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtUavqc-jC-LLOjs3UygBxeP-uiX_OP6eEktrhOIMrnI5fnRjKV-NKc1sYXs2EtODATu_FyGsWvlq0MY0G9K3yVr4fJRETdBSF2LyVpgiK_8NdSptrcOs1cYowxmm4VDdV0yDSnyyeX6moFvbADLkJUyiRXv6XACPsS5ozj5PMzymB7pgQ8GVKsY68bLDX5casKWzD9BWwQSreIOG2AGNTibfLGciawZip-vmgywLjUYvc6poyU-aXJFlwx", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu9PIeHtdybqYje9-XuLPD2zCvagr4IMCs5LVuc_y8Ez35thKlG4M1UMPpUvtSWSDhC1vvsEZBaGISU__Vgs-OKWSWnnVP_turwO6Fbmxc_JUCrXyPNRdWh9aCsfGiTxNSLvbIj0_FcR9UbgtJbkOfniSJa7KasjvsMH_wmbTqQ_-9rXiH3DVnCJUcZcitlGCx47YcDFLzCf7_YgY1OLcqMk0OJPUFXY1qPcEvv0xiRieLCU-8HRvTiPTmH", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtmsK1ri2awsUDlsxNOePqAkTLwLwLUOJAlo3smMVsHzkNn_5j4jIfsrJoFTdvd53adUrcSLBcw1CtDlPJipxZ18E0-czkDx2Mfrz-r2KIXc_T_EpJ9ObPucPKXuQHr_09d7qTlT-qfOmUnIE8fGTjuDbNBp46pGH8k6TLZjeqAnhxs7azbLUcox11UAXfPICWLDLZRTuGw4_-XyFTVmm1xdlE33c-LY5VYtB7Pb6Q7irgFpeGkg7ymNEXZ", span: "row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvS9s73jrEia1Mx5bMDd9Ngr5MqBn3vZWoXj2Fet6y1YBrpN-GZpso9L0uG88DoR7_hWdd9xyTG5IGsdGPblAhsm7cRa5jTRcXFB2rNd7wTfBNwNVlfmtN0P6IpKtcUHkUnFb25oWkeD3idRM8WG8e23FP5pkB56z1bcuDYBTtYuOCzSP0vP0t4cjal3BDMgJIA1Y4JuivYyPnqzd1WDr4qJvLh48RxWHImA5tcnT6YK1_sdFK4dFdtaGL1", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLsKkqquwhXD3_Huf74jW-lN7rjhJER_RMq-Gt_BgWSGI_xbuj6fM8wIyI3StJYILWB93JSK7Rr7uVSj21u8In0lMhW5s3MPMlg7JMYhd975p9K-dIrl2fEdGKgziPYOFxQbr_pfrCvMi-l6HpYXcrxrFfkrOcUoGEoZnqk43F38zuyQOuaJ4enUE9lUIBmFqdqNZS9Z8EEhGz9LG2pE8ILMWHYYAPTIlXxPUS4nOv-obBtL_cSMmvHWbD8", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtsBMKK-M55051aPGScceZ_Tkdf4nOCFP_l0zmXL9QGDmv-yByxA2XGaCEBXmrTkSLe2Ya7hX2Jvdv_nTMm6IReiM2QNbAlZOMiIMhtajusRja4hgkIuNV0sM9gac36FvFa03ms4qElfoH8RFMSWx1iSWtKV8fWFLQrPq6M0wMh-0gwpb_gwIi_lqEEwWsnTeNBDYV8CTiWVlUnu7lfYUCYTom2PezUnrIafPILsZJO_YpPzV-8ppVJTgY", span: "col-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLsXltZC6xTmj2q194Gevvzemzr1LPbEYo3XxaKnUuu8qIR3MzLn0xzDkfxPkShpPO7p5O010PTyNOMqnCgRfMxiQp83DC-3AWevtLEnuzwdSc0gnth6vH6w9iK7gPbL6lZMLafLiBDn7apxa4y9qvMregcrjGFFT7HzfdGHngUvzNzg0hIXVUgayRCZeFbOJk74ByOuhx5hW92K6z-OvoblYC01hkalpdkEXLstvzOmHddKJ9Tr6AeCsIyY", span: "" },
];

const FEATURES = [
    "Professional and experienced team",
    "Precision and attention to every detail",
    "Modern nail designs & latest trends",
    "High-quality, trusted products",
    "Personalized care for every client",
    "Clean, comfortable atmosphere",
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
function SlideOutBooking() {
    const [open, setOpen] = useState(false);
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
                Book Now
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
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C2A979", marginBottom: 4 }}>Suli Salon</div>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2, fontStyle: "italic" }}>Book Appointment</h2>
                        </div>
                        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#888", lineHeight: 1 }}>✕</button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                    {(["Full Name", "Phone Number", "Preferred Date", "Preferred Service"] as const).map((label, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>{label}</label>
                            {label === "Preferred Service" ? (
                                <select style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#fff", color: "#2E2E2E", outline: "none" }}>
                                    <option value="">Select a service...</option>
                                    <option>Nails</option>
                                    <option>Facial Care</option>
                                    <option>Eyelashes</option>
                                    <option>Eyebrows</option>
                                </select>
                            ) : (
                                <input
                                    type={label === "Preferred Date" ? "date" : "text"}
                                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", boxSizing: "border-box" }}
                                    placeholder={label === "Full Name" ? "Your name..." : label === "Phone Number" ? "+420 xxx xxx xxx" : ""}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>Message (optional)</label>
                        <textarea rows={3} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0D8CC", borderRadius: 6, fontSize: 14, fontFamily: "Montserrat,sans-serif", color: "#2E2E2E", outline: "none", resize: "none", boxSizing: "border-box" }} placeholder="Any additional notes..." />
                    </div>
                </div>

                <div style={{ padding: "20px 28px", borderTop: "1px solid #E8E0D0" }}>
                    <button
                        style={{ width: "100%", background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "16px", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", borderRadius: 6, cursor: "pointer", transition: "opacity .2s" }}
                        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
                        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Navbar                                                   */
/* ─────────────────────────────────────────────────────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 50,
                transition: "all .5s ease",
                background: scrolled ? "rgba(253,251,247,.95)" : "rgba(253,251,247,.65)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: scrolled ? "1px solid rgba(194,169,121,.25)" : "1px solid rgba(194,169,121,.12)",
                boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.06)" : "none",
                padding: scrolled ? "10px 0" : "18px 0",
            }}
        >
            <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <a href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontStyle: "italic", fontWeight: 700, color: "#C2A979", textDecoration: "none", letterSpacing: "-0.01em", transition: "transform .3s" }}>
                    Suli Salon
                </a>

                <ul style={{ display: "flex", gap: 40, listStyle: "none", margin: 0, padding: 0 }}>
                    {["Services", "About", "Gallery", "Locations"].map((item) => (
                        <li key={item}>
                            <a href={`/${item.toLowerCase()}`} style={{ fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2E2E2E", textDecoration: "none", transition: "color .3s", paddingBottom: 2, borderBottom: "1.5px solid transparent" }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = "#C2A979"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#C2A979"; }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = "#2E2E2E"; (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
                            >{item}</a>
                        </li>
                    ))}
                </ul>

                <a href="/booking">
                    <button style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "14px 28px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", borderRadius: "20px 4px 20px 4px", cursor: "pointer", transition: "all .3s", boxShadow: "0 4px 16px rgba(194,169,121,.35)" }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(194,169,121,.45)"; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(194,169,121,.35)"; }}
                    >
                        Book Appointment
                    </button>
                </a>
            </nav>
        </header>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Hero Section                                             */
/* ─────────────────────────────────────────────────────── */
function Hero() {
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

    return (
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "visible", background: "#FDFBF7", paddingTop: 120, paddingBottom: 60 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%" }}>

                {/* Left */}
                <div className="reveal is-visible" style={{ zIndex: 2 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        PREMIUM EXPERIENCE
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,5.5vw,72px)", fontWeight: 700, lineHeight: 1.1, color: "#2E2E2E", margin: "0 0 24px", transition: "transform .12s ease-out", letterSpacing: "-0.02em" }}
                    >
                        Precision<br />Nail Care
                    </h1>
                    <p
                        ref={descRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 17, lineHeight: 1.7, color: "#6B6B6B", maxWidth: 440, marginBottom: 40, transition: "transform .12s ease-out" }}
                    >
                        High-quality products, skilled technicians, and attention to detail. Experience the pinnacle of nail artistry in the heart of Prague.
                    </p>
                    <a href="/services">
                        <button
                            style={{ background: "#1A1A1A", color: "#fff", padding: "18px 44px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all .35s cubic-bezier(.16,1,.3,1)", boxShadow: "0 6px 24px rgba(0,0,0,.18)" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#C2A979"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(194,169,121,.4)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1A1A"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(0,0,0,.18)"; }}
                        >
                            Our Services →
                        </button>
                    </a>
                </div>

                {/* Right – two images side by side */}
                <div className="reveal is-visible" data-delay="200" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
                    {/* Image 1 – taller, left */}
                    <div style={{ position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.18)", aspectRatio: "3/4", borderRadius: "80px 12px 80px 12px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://lh3.googleusercontent.com/aida/AP1WRLsm6Y9PCPUQl-URvdmq5ipK4EWJgMerQplUGJpnUqfwUmdKZRgeTY-PusEHITIrVYSm44lOFG5kEuwNblC5Hb-qn672agc4hpRPvoI6iweYZfZc_Z4kuwqXIYJtvS5DDRoa8QxYsHjPxzYMVv7cQSrDW0wO-hKW53g2Cezuw8TWWKJgQHZQKS8gQX0n8SC9uIPHBWzqiZVp0GzXIsr729zAX3ptZz36EFl8FkN4JaP0JZ3vbp2RnyqEGhAm"
                            alt="Nail artistry showcase"
                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .7s ease, transform .7s ease" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />
                        {/* Badge overlay */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)", padding: "40px 20px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderRadius: "0 0 80px 0" }}>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>NAIL ART</div>
                        </div>
                    </div>

                    {/* Image 2 – shorter, right, offset down */}
                    <div style={{ marginTop: 60, position: "relative" }}>
                        <div style={{ position: "relative", overflow: "hidden", boxShadow: "0 20px 56px rgba(0,0,0,.15)", aspectRatio: "3/4", borderRadius: "12px 80px 12px 80px" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j"
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
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>10+</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.4 }}>Years of<br />Experience</div>
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
function About() {
    return (
        <section style={{ background: "#F4F1EA", padding: "160px 0", overflow: "hidden" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "center" }}>

                {/* Images side */}
                <div className="reveal" style={{ position: "relative", paddingBottom: 48, paddingRight: 48 }}>
                    <div style={{ position: "relative", width: "80%", aspectRatio: "3/4", boxShadow: "0 20px 60px rgba(0,0,0,.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://lh3.googleusercontent.com/aida/AP1WRLvgJMyMloSkchi8E8sDJhJRMqpp6KFiFDHJh0Mk11QQ43Xb9ulueKIiYxLgizuBLFO3hkUC4jT8AY89mIjhPTOkzuHJw4veRVwNWuvvCDDnjCD1bO3kPO0G_X5usyUjcXbzsW5IhIe3KOGRRhGFKrsQCj3AlVn4aYeoEG2xUUysXAc7iNJNJEBzATVgfo4_v1cyrDlB5onUihR7971P5uvlEjdXCwJo6Ww8vsF9cEXu2DuvxEutrt_hTlA"
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
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>10+</div>
                            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>YEARS OF<br />EXPERIENCE</div>
                        </div>
                        {/* Small circle img */}
                        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "6px solid #fff", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.12)", transition: "transform .5s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j"
                                alt="Detail"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Text side */}
                <div className="reveal" data-delay="150">
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 16 }}>
                        About Suli Salon
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 700, color: "#2E2E2E", lineHeight: 1.2, fontStyle: "italic", margin: "0 0 24px" }}>
                        Style That Speaks for You
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", marginBottom: 36 }}>
                        Precision nail design created for your unique look. We blend traditional techniques with contemporary aesthetics to deliver results that truly reflect you.
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
                            Explore Our Story
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
function Services() {
    return (
        <section style={{ background: "#FDFBF7", padding: "160px 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ marginBottom: 56 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                        Salon Suli
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#2E2E2E", margin: 0, lineHeight: 1.2 }}>
                        Professional Manicure &amp; Pedicure in Prague
                    </h2>
                    <div style={{ width: 80, height: 3, background: "linear-gradient(90deg,#C2A979,#a08040)", marginTop: 20 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                    {SERVICES.map((s, i) => (
                        <div
                            key={i}
                            className="reveal"
                            data-delay={String((i + 1) * 100)}
                            style={{ position: "relative", height: 500, overflow: "hidden", cursor: "pointer" }}
                        // Hover handled via CSS group
                        >
                            <ServiceCard {...s} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ title, img }: { title: string; img: string }) {
    const imgRef = useRef<HTMLImageElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

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
                src={img}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .65s ease, transform .65s ease" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.1) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "32px 28px", width: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{title}</h3>
                <a
                    ref={linkRef}
                    href="/services"
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
function Gallery() {
    return (
        <section style={{ background: "#F9F9F9", padding: "160px 0" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
                <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,54px)", fontWeight: 700, color: "#C2A979", fontStyle: "italic", margin: "0 0 8px" }}>
                        Suli Salon
                    </h2>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999" }}>
                        Luxury Nail Gallery in Prague
                    </p>
                </div>

                <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: 280, gap: 12 }}>
                    {GALLERY.map((g, i) => (
                        <GalleryItem key={i} url={g.url} span={g.span} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GalleryItem({ url, span }: { url: string; span: string }) {
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
                alt="Gallery"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .65s ease, transform .65s ease" }}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Footer                                                   */
/* ─────────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer style={{ background: "#1A1A1A", color: "#ccc", paddingTop: 80, paddingBottom: 0 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
                {/* Brand */}
                <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontStyle: "italic", fontWeight: 700, color: "#C2A979", marginBottom: 16 }}>Suli Salon</div>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, color: "#888", maxWidth: 240 }}>
                        Elevating beauty through precision and artistry. Your destination for premium nail care in Prague.
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                        {["f", "ig"].map((s) => (
                            <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "all .3s", textDecoration: "none", fontSize: 14 }}
                                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#C2A979"; (e.currentTarget as HTMLElement).style.color = "#C2A979"; }}
                                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#333"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
                            >{s}</a>
                        ))}
                    </div>
                </div>
                {/* Quick Links */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Quick Links</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {["Services", "Gallery", "About Us", "Contact Us"].map((l) => (
                            <li key={l}>
                                <a href="#" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", textDecoration: "none", transition: "color .25s" }}
                                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#C2A979")}
                                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                                >{l}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Branch */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Our Branches</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
                        <div style={{ fontWeight: 600, color: "#ccc", marginBottom: 6 }}>Suli Salon – Praha 12</div>
                        <div>📍 Cs. exilu 2154, 143 00 Praha 12</div>
                    </div>
                </div>
                {/* Hours */}
                <div>
                    <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>Opening Hours</h4>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 14, color: "#888", lineHeight: 2 }}>
                        <div>🕐 Mon – Fri: 10:00 – 18:00</div>
                        <div>🕐 Sat – Sun: 09:00 – 19:00</div>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: "1px solid #2a2a2a", padding: "20px 64px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 12, color: "#555", margin: 0 }}>© 2024 Suli Salon. All rights reserved.</p>
                <div style={{ display: "flex", gap: 24 }}>
                    {["Privacy Policy", "Terms of Service", "Careers"].map((l) => (
                        <a key={l} href="#" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#555", textDecoration: "none", transition: "color .25s" }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#C2A979")}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
                        >{l}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Main Page Component                                      */
/* ─────────────────────────────────────────────────────── */
export default function HomePage() {
    useReveal();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap');

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
                <Hero />
                <About />
                <Services />
                <Gallery />
            </main>

            {/* Mobile floating CTA */}
            <a href="/booking" className="mobile-cta" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40 }}>
                <button style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#C2A979,#a08040)", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", boxShadow: "0 8px 24px rgba(194,169,121,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>📅</button>
            </a>
        </>
    );
}
