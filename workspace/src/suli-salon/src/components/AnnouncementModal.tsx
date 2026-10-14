"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedText } from "@/lib/i18n/routes";

const LEVEL_CONFIG = {
  info: {
    badge: "ℹ️ THÔNG TIN SALON | SALON INFORMATION",
    icon: "ℹ️",
    accentColor: "#2563EB",
    headerBg: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 65%, #3B82F6 100%)",
    glowColor: "rgba(37, 99, 235, 0.35)",
    border: "1.5px solid rgba(59, 130, 246, 0.4)",
    tagBg: "rgba(37, 99, 235, 0.12)",
    tagText: "#1D4ED8",
    tagBorder: "rgba(37, 99, 235, 0.3)",
    btnBg: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    btnShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
  },
  promo: {
    badge: "🎁 ƯU ĐÃI ĐẶC BIỆT | SPECIAL PROMOTION",
    icon: "🎉",
    accentColor: "#BE123C",
    headerBg: "linear-gradient(135deg, #4C0519 0%, #881337 50%, #C2A979 100%)",
    glowColor: "rgba(225, 29, 72, 0.35)",
    border: "1.5px solid rgba(225, 29, 72, 0.4)",
    tagBg: "rgba(225, 29, 72, 0.12)",
    tagText: "#BE123C",
    tagBorder: "rgba(225, 29, 72, 0.3)",
    btnBg: "linear-gradient(135deg, #BE123C 0%, #9F1239 100%)",
    btnShadow: "0 6px 20px rgba(190, 18, 60, 0.4)",
  },
  warning: {
    badge: "⚠️ LƯU Ý QUAN TRỌNG | IMPORTANT NOTICE",
    icon: "🔔",
    accentColor: "#D97706",
    headerBg: "linear-gradient(135deg, #451A03 0%, #78350F 55%, #D97706 100%)",
    glowColor: "rgba(245, 158, 11, 0.35)",
    border: "1.5px solid rgba(245, 158, 11, 0.45)",
    tagBg: "rgba(245, 158, 11, 0.12)",
    tagText: "#B45309",
    tagBorder: "rgba(245, 158, 11, 0.3)",
    btnBg: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
    btnShadow: "0 6px 20px rgba(217, 119, 6, 0.4)",
  },
  urgent: {
    badge: "🚨 THÔNG BÁO KHẨN CẤP | URGENT ALERT",
    icon: "🚨",
    accentColor: "#DC2626",
    headerBg: "linear-gradient(135deg, #450A0A 0%, #7F1D1D 55%, #DC2626 100%)",
    glowColor: "rgba(239, 68, 68, 0.4)",
    border: "1.5px solid rgba(239, 68, 68, 0.5)",
    tagBg: "rgba(239, 68, 68, 0.15)",
    tagText: "#DC2626",
    tagBorder: "rgba(239, 68, 68, 0.35)",
    btnBg: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
    btnShadow: "0 6px 20px rgba(220, 38, 38, 0.45)",
  },
};

export default function AnnouncementModal({ settings }: { settings: SiteSettings }) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const level = (settings.popupLevel || "promo") in LEVEL_CONFIG ? settings.popupLevel : "promo";
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];

  const title = getLocalizedText(settings.popupTitle, locale);
  const content = getLocalizedText(settings.popupContent, locale);
  const badge = getLocalizedText(settings.popupBadge || config.badge, locale);
  const ctaText = getLocalizedText(settings.popupCtaText, locale);
  const ctaLink = settings.popupCtaLink?.trim() || "";

  useEffect(() => {
    if (!settings.popupEnabled || !settings.popupTitle) {
      setIsOpen(false);
      return;
    }

    const signature = `${settings.popupLevel}_${settings.popupTitle.trim()}_${(settings.popupContent || "").trim()}`;
    const dismissType = settings.popupDismissType || "daily";

    try {
      if (dismissType === "session") {
        const dismissed = sessionStorage.getItem("moc_announcement_dismissed");
        if (dismissed === signature) return;
      } else if (dismissType === "daily") {
        const stored = localStorage.getItem("moc_announcement_dismissed");
        if (stored) {
          const parsed = JSON.parse(stored);
          const today = new Date().toISOString().split("T")[0];
          if (parsed.signature === signature && parsed.date === today) {
            return;
          }
        }
      }
    } catch {
      // In case of localStorage disabled in private windows
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [settings.popupEnabled, settings.popupLevel, settings.popupTitle, settings.popupContent, settings.popupDismissType]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, dontShowAgain]);

  function handleClose() {
    setIsOpen(false);
    const signature = `${settings.popupLevel}_${settings.popupTitle?.trim()}_${(settings.popupContent || "").trim()}`;
    const dismissType = settings.popupDismissType || "daily";

    try {
      if (dismissType === "always" && !dontShowAgain) {
        return;
      }
      if (dontShowAgain || dismissType === "daily") {
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem(
          "moc_announcement_dismissed",
          JSON.stringify({ signature, date: today })
        );
      } else if (dismissType === "session") {
        sessionStorage.setItem("moc_announcement_dismissed", signature);
      }
    } catch {
      // Fallback
    }
  }

  if (!isOpen || !settings.popupEnabled || !title) return null;

  return (
    <div
      className="announcement-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        backgroundColor: "rgba(18, 16, 14, 0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        overflowY: "auto",
        animation: "modalFadeIn 0.3s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="announcement-modal-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 580,
          backgroundColor: "#FDFBF7",
          borderRadius: 16,
          border: config.border,
          boxShadow: `0 24px 64px rgba(0, 0, 0, 0.4), 0 0 24px ${config.glowColor}`,
          overflow: "hidden",
          margin: "auto",
          animation: "modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={isEn ? "Close announcement" : "Đóng thông báo"}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.35)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div
          style={{
            background: config.headerBg,
            padding: "28px 28px 24px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle light shimmer decoration */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                borderRadius: 30,
                backgroundColor: "rgba(255, 255, 255, 0.16)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                backdropFilter: "blur(4px)",
              }}
            >
              <span>{config.icon}</span>
              <span>{badge}</span>
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255, 255, 255, 0.8)",
                marginLeft: "auto",
                marginRight: 32,
                fontWeight: 500,
              }}
            >
              {settings.siteName || "Mộc Salon"}
            </span>
          </div>

          <h2
            id="announcement-modal-title"
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px, 3vw, 24px)",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "26px 28px 24px", boxSizing: "border-box" }}>
          {content && (
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13.5,
                lineHeight: 1.75,
                color: "#4A4036",
                whiteSpace: "pre-line",
                marginBottom: 24,
                maxHeight: "45vh",
                overflowY: "auto",
                paddingRight: 6,
              }}
            >
              {content}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ctaText && ctaLink && (
                <Link
                  href={ctaLink}
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    padding: "12px 20px",
                    background: config.btnBg,
                    color: "#ffffff",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: config.btnShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
                >
                  <span>{ctaText}</span>
                  <span>→</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "12px 24px",
                  backgroundColor: ctaText && ctaLink ? "transparent" : "#2E2E2E",
                  color: ctaText && ctaLink ? "#786B5E" : "#ffffff",
                  border: ctaText && ctaLink ? "1.5px solid rgba(120, 107, 94, 0.25)" : "none",
                  borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: ctaText && ctaLink ? 0 : 1,
                }}
                onMouseOver={(e) => {
                  if (ctaText && ctaLink) {
                    e.currentTarget.style.borderColor = "#2E2E2E";
                    e.currentTarget.style.color = "#2E2E2E";
                  }
                }}
                onMouseOut={(e) => {
                  if (ctaText && ctaLink) {
                    e.currentTarget.style.borderColor = "rgba(120, 107, 94, 0.25)";
                    e.currentTarget.style.color = "#786B5E";
                  }
                }}
              >
                {isEn ? "Got it / Close" : "Đã hiểu / Đóng"}
              </button>
            </div>

            {/* "Don't show again today" checkbox option */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
                cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11.5,
                color: "#8C7E72",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                style={{ accentColor: config.accentColor, cursor: "pointer", width: 14, height: 14 }}
              />
              <span>{isEn ? "Don't show this announcement again today" : "Không nhắc lại thông báo này trong hôm nay"}</span>
            </label>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
