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
            style={{
                position: "fixed",
                bottom: "100px",
                right: "26px",
                width: "44px",
                height: "44px",
                backgroundColor: "var(--brand-green, #8cc63f)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                boxShadow: "0 8px 20px rgba(140, 198, 63, 0.4)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 999,
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--brand-green-hover, #7ab32f)";
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "var(--brand-green, #8cc63f)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <i className="ph-bold ph-caret-up" style={{ fontSize: "20px" }}></i>
        </button>
    );
}
