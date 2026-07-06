"use client";
import { useEffect, useRef, useState } from "react";

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
/* Gallery Data                                             */
/* ─────────────────────────────────────────────────────── */
const CATEGORIES = ["All", "Nails", "Pedicure", "Eyelashes", "Eyebrows"];

const IMAGES = [
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvwaaw5PhO3q7G6GDm-putw-oyJ4EEbn-t5NS6uv8fh4RykIks2MCnU6YVn0LP4znv4-1Ff_mj37ahIxRupUrV04EuQUtSZn_U4YbPT5qj1t1ikz5Ym5ejg73mUtrzDpS5bUgofGaD0SOzi5B5rz2cHRhovsjuYLZq7I22Z-NF8nRexRXGv3eMfRKNjLeyFKijT84zHeHJ7og-qWZ3UUGl2GXgRVDYIlD6mN9JcpxPbjnclYXc1e017E8J4", cat: "Nails", title: "French Gel Extensions", span: "row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu-Kuik5OETZq4lu0EghInZt2VbvsE7SO6grA9jbUt1vVFlZeSq4Z5D4_VYEcri2MeQwieyKuuOwKNGh1RrADEHzO6oTSXneGIjC9WTdt9MTZjbVw9Dfeut0jM297W_8oQMiau9D29VtGcn5HYhS1KE0PscY0Pk_-SKLzjKunbjwdt3aaSdc5o3KScyjYLyG8ZUoHEKJi5gx0tQOcdnTdq_os56DBIfjfyW0IDsV85UHbTPQo0e4mF0CqE", cat: "Nails", title: "Classic Manicure", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j", cat: "Pedicure", title: "Luxury Pedicure", span: "col-span-2 row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtUavqc-jC-LLOjs3UygBxeP-uiX_OP6eEktrhOIMrnI5fnRjKV-NKc1sYXs2EtODATu_FyGsWvlq0MY0G9K3yVr4fJRETdBSF2LyVpgiK_8NdSptrcOs1cYowxmm4VDdV0yDSnyyeX6moFvbADLkJUyiRXv6XACPsS5ozj5PMzymB7pgQ8GVKsY68bLDX5casKWzD9BWwQSreIOG2AGNTibfLGciawZip-vmgywLjUYvc6poyU-aXJFlwx", cat: "Nails", title: "Nude Gel Nails", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLu9PIeHtdybqYje9-XuLPD2zCvagr4IMCs5LVuc_y8Ez35thKlG4M1UMPpUvtSWSDhC1vvsEZBaGISU__Vgs-OKWSWnnVP_turwO6Fbmxc_JUCrXyPNRdWh9aCsfGiTxNSLvbIj0_FcR9UbgtJbkOfniSJa7KasjvsMH_wmbTqQ_-9rXiH3DVnCJUcZcitlGCx47YcDFLzCf7_YgY1OLcqMk0OJPUFXY1qPcEvv0xiRieLCU-8HRvTiPTmH", cat: "Eyelashes", title: "Volume Lashes", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtmsK1ri2awsUDlsxNOePqAkTLwLwLUOJAlo3smMVsHzkNn_5j4jIfsrJoFTdvd53adUrcSLBcw1CtDlPJipxZ18E0-czkDx2Mfrz-r2KIXc_T_EpJ9ObPucPKXuQHr_09d7qTlT-qfOmUnIE8fGTjuDbNBp46pGH8k6TLZjeqAnhxs7azbLUcox11UAXfPICWLDLZRTuGw4_-XyFTVmm1xdlE33c-LY5VYtB7Pb6Q7irgFpeGkg7ymNEXZ", cat: "Eyebrows", title: "Brow Lamination", span: "row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvvYMW4tC0WzVAhOd3ipWXpoh7jRs9wIx0S7K1Kdh7EKc8odCkT_vB5hQjabtivklH3nVceHH9wgUcWH3iDLFt7mmiBDAhlILRlH5LhzhmBVh_JXZE9LHvzpc_KbgOdYOzsV_AOCIfRRulpr5dcfiR4sJXnzOQz0NEyf2eG08NE3SOSgVzhZ3Il7MA3b_VYPaaBMyiTx14mdmC83Wea1IERfo5fjHZX7SMCQTMUSM3xPhn4WsK0Xs-Nczx-", cat: "Eyelashes", title: "Classic Lashes", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLsKkqquwhXD3_Huf74jW-lN7rjhJER_RMq-Gt_BgWSGI_xbuj6fM8wIyI3StJYILWB93JSK7Rr7uVSj21u8In0lMhW5s3MPMlg7JMYhd975p9K-dIrl2fEdGKgziPYOFxQbr_pfrCvMi-l6HpYXcrxrFfkrOcUoGEoZnqk43F38zuyQOuaJ4enUE9lUIBmFqdqNZS9Z8EEhGz9LG2pE8ILMWHYYAPTIlXxPUS4nOv-obBtL_cSMmvHWbD8", cat: "Nails", title: "Nail Art Design", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLtsBMKK-M55051aPGScceZ_Tkdf4nOCFP_l0zmXL9QGDmv-yByxA2XGaCEBXmrTkSLe2Ya7hX2Jvdv_nTMm6IReiM2QNbAlZOMiIMhtajusRja4hgkIuNV0sM9gac36FvFa03ms4qElfoH8RFMSWx1iSWtKV8fWFLQrPq6M0wMh-0gwpb_gwIi_lqEEwWsnTeNBDYV8CTiWVlUnu7lfYUCYTom2PezUnrIafPILsZJO_YpPzV-8ppVJTgY", cat: "Pedicure", title: "Spa Pedicure", span: "col-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLsXltZC6xTmj2q194Gevvzemzr1LPbEYo3XxaKnUuu8qIR3MzLn0xzDkfxPkShpPO7p5O010PTyNOMqnCgRfMxiQp83DC-3AWevtLEnuzwdSc0gnth6vH6w9iK7gPbL6lZMLafLiBDn7apxa4y9qvMregcrjGFFT7HzfdGHngUvzNzg0hIXVUgayRCZeFbOJk74ByOuhx5hW92K6z-OvoblYC01hkalpdkEXLstvzOmHddKJ9Tr6AeCsIyY", cat: "Eyebrows", title: "Micro Brow Shaping", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvA13tpO-MB-gIyzZ16CZpoWDDGRxtKCB_vF8CocOZAwA23iscVRX_ARLcroGFuJkq3LdD54fln74NTYIYQQdUrE9RHvVkCwUN70DfJDA8WIgcwkfS3v2AnTEAswCgPzsdn7Qf1kpACwunL2IGizrk3o4zH5o5ZlBG0Ih6DGy8dWJA2EulR902hDyUutORt9vc9zX2BHDHr6_uACENL1JJBN6mWsF5aTT6C-JqXwwOC4rkVMho0MuOgJziy", cat: "Eyebrows", title: "Ombre Brows", span: "row-span-2" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLsncxcUaLl-kRMraO4Z3lDzU_fTWPnoZq2Nu1fF9l-q2D54UsfpLvZepPtcS0B2zdHpDP019vTTziYl3Lsio_K0RghBV2Kd_31VlBu9YThyB2KfTE2ZzWVM0ChalCmLEx48YQMzPoQilLwQtKH3bk9r8zqYRRm1YjdXdQ4B8Z5Duf5JifHrDxt-Yqx-AJmBZ27EcKAtb5-sZbvqtdbRr6MeDpmlG4q0XU5CqOa9eJhvtE1RQdGItfyviGtS", cat: "Nails", title: "Pink Gel Set", span: "" },
    { url: "https://lh3.googleusercontent.com/aida/AP1WRLvmBUkVHNFLX8ch_FNKHBzKDug9sqEhnNxXqV93sZFRO19ROp_KHIZJOu0aOeObsISyGxs8ds6u8tA0RdSFMfbTIuJx_dE3QmqPM7A938Ym1PnaAFzyFvoKmSn_BfngbhWM2PC1yB5e1GX2GFyzEQrRRPqYhu_d9uh_nVWI1VmGGuNjQB6-uGXWI6T2GRcPIp5751kYnxSCv-z92VVdYNtj7YmftrHK3skW7cZ-wwbVgQzBSADuCzI3f6Xc", cat: "Pedicure", title: "French Pedicure", span: "" },
];

/* ─────────────────────────────────────────────────────── */
/* Lightbox Component                                       */
/* ─────────────────────────────────────────────────────── */
function Lightbox({ img, onClose }: { img: (typeof IMAGES)[0]; onClose: () => void }) {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", fn);
        document.body.style.overflow = "hidden";
        return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(6px)" }}
        >
            <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 900, maxHeight: "85vh", width: "100%" }}>
                <button
                    onClick={onClose}
                    style={{ position: "absolute", top: -40, right: 0, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer", opacity: 0.7, zIndex: 1 }}
                >✕</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={img.url}
                    alt={img.title}
                    style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(0,0,0,.7),transparent)", padding: "40px 28px 20px" }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 4 }}>{img.cat}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontStyle: "italic", color: "#fff" }}>{img.title}</div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Gallery Item                                             */
/* ─────────────────────────────────────────────────────── */
function GalleryItem({ item, onClick, delay }: { item: (typeof IMAGES)[0]; onClick: () => void; delay: number }) {
    const imgRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const gridStyles: React.CSSProperties = {};
    if (item.span.includes("row-span-2")) gridStyles.gridRow = "span 2";
    if (item.span.includes("col-span-2")) gridStyles.gridColumn = "span 2";

    return (
        <div
            className="reveal"
            data-delay={String(delay)}
            style={{ overflow: "hidden", cursor: "pointer", position: "relative", ...gridStyles }}
            onClick={onClick}
            onMouseOver={() => {
                if (imgRef.current) { imgRef.current.style.filter = "grayscale(0%)"; imgRef.current.style.transform = "scale(1.07)"; }
                if (overlayRef.current) overlayRef.current.style.opacity = "1";
            }}
            onMouseOut={() => {
                if (imgRef.current) { imgRef.current.style.filter = "grayscale(100%)"; imgRef.current.style.transform = "scale(1)"; }
                if (overlayRef.current) overlayRef.current.style.opacity = "0";
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={item.url}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", transition: "filter .65s ease, transform .65s ease", display: "block" }}
            />
            {/* Hover overlay */}
            <div
                ref={overlayRef}
                style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 55%, transparent 100%)", opacity: 0, transition: "opacity .45s ease" }}
            >
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "28px 22px", boxSizing: "border-box" }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 4 }}>{item.cat}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: "italic", color: "#fff", marginBottom: 8 }}>{item.title}</div>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 14 }}>⊕</span> View
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────── */
/* Gallery Page                                             */
/* ─────────────────────────────────────────────────────── */
export default function GalleryPage() {
    useReveal();

    const [activeCategory, setActiveCategory] = useState("All");
    const [lightboxImg, setLightboxImg] = useState<(typeof IMAGES)[0] | null>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);

    // Parallax on hero text
    useEffect(() => {
        const fn = (e: MouseEvent) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 14;
            const my = (e.clientY / window.innerHeight - 0.5) * 10;
            if (titleRef.current) titleRef.current.style.transform = `translate(${-mx * 0.4}px,${-my * 0.4}px)`;
            if (subRef.current) subRef.current.style.transform = `translate(${-mx * 0.2}px,${-my * 0.2}px)`;
        };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, []);

    const filtered = activeCategory === "All" ? IMAGES : IMAGES.filter((i) => i.cat === activeCategory);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cat-pill {
          background: transparent;
          border: 1.5px solid #D0C5AF;
          color: #6B6B6B;
          padding: 10px 24px;
          font-family: Montserrat, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .3s;
          border-radius: 40px;
        }
        .cat-pill:hover,
        .cat-pill.active {
          background: #2E2E2E;
          border-color: #2E2E2E;
          color: #fff;
        }
        .cat-pill.active {
          background: linear-gradient(135deg,#C2A979,#a08040);
          border-color: #C2A979;
          color: #fff;
          box-shadow: 0 4px 16px rgba(194,169,121,.3);
        }
      `}</style>

            {/* ── Hero Banner ─────────────────────────────────── */}
            <section style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F1EA", paddingTop: 110, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(194,169,121,.13)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(194,169,121,.1)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        Our Work
                    </div>
                    <h1
                        ref={titleRef}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,6vw,80px)", fontWeight: 700, color: "#2E2E2E", margin: "0 0 24px", lineHeight: 1.1, letterSpacing: "-0.02em", fontStyle: "italic", transition: "transform .12s ease-out" }}
                    >
                        Suli Salon Gallery
                    </h1>
                    <p
                        ref={subRef}
                        style={{ fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, color: "#6B6B6B", maxWidth: 520, margin: "0 auto", transition: "transform .12s ease-out" }}
                    >
                        A curated showcase of our finest work — every detail crafted with intention, every look a small piece of art.
                    </p>
                </div>
            </section>

            {/* ── Filter Pills ────────────────────────────────── */}
            <section style={{ background: "#FDFBF7", padding: "48px 64px 0", position: "sticky", top: 72, zIndex: 30, boxShadow: "0 2px 20px rgba(0,0,0,.04)" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 10, justifyContent: "center", paddingBottom: 36, flexWrap: "wrap" }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`cat-pill${activeCategory === cat ? " active" : ""}`}
                        >
                            {cat}
                            {cat !== "All" && (
                                <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 10 }}>
                                    ({IMAGES.filter((i) => i.cat === cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Bento Grid ──────────────────────────────────── */}
            <section style={{ background: "#FDFBF7", padding: "48px 64px 100px" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gridAutoRows: 300,
                            gap: 12,
                        }}
                    >
                        {filtered.map((img, i) => (
                            <GalleryItem
                                key={`${img.title}-${i}`}
                                item={img}
                                onClick={() => setLightboxImg(img)}
                                delay={Math.min(i * 60, 400)}
                            />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "#999", fontFamily: "Montserrat,sans-serif", fontSize: 15 }}>
                            No images in this category yet.
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Banner ──────────────────────────────────── */}
            <section style={{ background: "#2E2E2E", padding: "80px 64px", textAlign: "center" }}>
                <div className="reveal">
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C2A979", marginBottom: 20 }}>
                        Love what you see?
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, color: "#fff", margin: "0 0 28px", fontStyle: "italic" }}>
                        Book Your Next Look
                    </h2>
                    <a href="/booking">
                        <button
                            style={{ background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "16px 44px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "all .35s", boxShadow: "0 6px 24px rgba(194,169,121,.35)" }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 36px rgba(194,169,121,.45)"; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(194,169,121,.35)"; }}
                        >
                            Book Appointment →
                        </button>
                    </a>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImg && <Lightbox img={lightboxImg} onClose={() => setLightboxImg(null)} />}
        </>
    );
}
