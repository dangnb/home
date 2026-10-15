"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Xử lý sự kiện scroll để hiện/ẩn nút
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const toggleVisibility = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                if (window.scrollY > 300) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
                timeoutId = null;
            }, 100); // Throttle scroll event to run at most once every 100ms
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Xử lý khi click vào nút
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            title="Lên đầu trang"
            style={{
                position: "fixed",
                bottom: "235px",
                right: "28px",
                width: "48px",
                height: "48px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 998,
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--brand-green, #16a34a)";
                e.currentTarget.style.transform = "translateY(-3px) scale(1.08)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#0f172a";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </button>
    );
}
