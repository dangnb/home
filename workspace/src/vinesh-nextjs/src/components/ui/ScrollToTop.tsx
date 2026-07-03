"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Xử lý sự kiện scroll để hiện/ẩn nút
    useEffect(() => {
        let timeoutId: any = null;
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
                bottom: "40px",
                right: "40px",
                width: "45px",
                height: "45px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 9999,
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <i className="ph ph-caret-up" style={{ fontSize: "24px", fontWeight: "bold" }}></i>
        </button>
    );
}
