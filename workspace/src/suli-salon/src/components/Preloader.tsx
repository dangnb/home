"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

/* ── Floating particles background ─────────────── */
function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener("resize", resize);

        // Create floating dots
        const dots: { x: number; y: number; r: number; vx: number; vy: number; alpha: number; pulse: number }[] = [];
        for (let i = 0; i < 40; i++) {
            dots.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        const draw = (t: number) => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            dots.forEach((d) => {
                d.x += d.vx;
                d.y += d.vy;
                d.pulse += 0.015;

                // Wrap around
                if (d.x < -10) d.x = window.innerWidth + 10;
                if (d.x > window.innerWidth + 10) d.x = -10;
                if (d.y < -10) d.y = window.innerHeight + 10;
                if (d.y > window.innerHeight + 10) d.y = -10;

                const a = d.alpha * (0.6 + 0.4 * Math.sin(d.pulse));
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(194, 169, 121, ${a})`;
                ctx.fill();
            });

            // Draw connection lines between nearby dots
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(194, 169, 121, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

/* ── Main Preloader ────────────────────────────── */
export default function Preloader({ children }: { children: React.ReactNode }) {
    const [showLoader, setShowLoader] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Accelerate towards end
                const increment = p < 60 ? Math.random() * 8 + 2 : Math.random() * 15 + 5;
                return Math.min(p + increment, 100);
            });
        }, 120);

        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 2800);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    // Split "Suli Salon" into letters for staggered animation
    const logoText = "Suli Salon";
    const letters = logoText.split("");

    return (
        <>
            <AnimatePresence>
                {showLoader && (
                    <motion.div
                        className={styles.preloaderScreen}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        {/* Particle background */}
                        <Particles />

                        {/* Radial glow */}
                        <div className={styles.radialGlow} />

                        {/* Center content */}
                        <div className={styles.centerContent}>
                            {/* Decorative line above */}
                            <motion.div
                                className={styles.decorLine}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                            />

                            {/* Tagline */}
                            <motion.div
                                className={styles.tagline}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                PREMIUM EXPERIENCE
                            </motion.div>

                            {/* Logo with staggered letters */}
                            <h1 className={styles.logo}>
                                {letters.map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        className={styles.logoLetter}
                                        initial={{ opacity: 0, y: 30, rotateX: -40 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.4 + i * 0.06,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        {letter === " " ? "\u00A0" : letter}
                                    </motion.span>
                                ))}
                                <div className={styles.shimmerOverlay} />
                            </h1>

                            {/* Subtitle */}
                            <motion.div
                                className={styles.subtitle}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                            >
                                Luxury Nail Gallery in Prague
                            </motion.div>

                            {/* Progress bar */}
                            <motion.div
                                className={styles.progressContainer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <div className={styles.progressTrack}>
                                    <motion.div
                                        className={styles.progressFill}
                                        style={{ width: `${progress}%` }}
                                    />
                                    <div
                                        className={styles.progressGlow}
                                        style={{ left: `${progress}%` }}
                                    />
                                </div>
                                <div className={styles.progressText}>
                                    {Math.round(progress)}%
                                </div>
                            </motion.div>

                            {/* Decorative line below */}
                            <motion.div
                                className={styles.decorLine}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                            />
                        </div>

                        {/* Corner decorations */}
                        <div className={`${styles.corner} ${styles.cornerTL}`} />
                        <div className={`${styles.corner} ${styles.cornerTR}`} />
                        <div className={`${styles.corner} ${styles.cornerBL}`} />
                        <div className={`${styles.corner} ${styles.cornerBR}`} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className={styles.contentWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: showLoader ? 0 : 1 }}
                transition={{
                    duration: 0.7,
                    delay: showLoader ? 0 : 0.4,
                    ease: "easeOut",
                }}
            >
                {children}
            </motion.div>
        </>
    );
}
