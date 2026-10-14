"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedText } from "@/lib/i18n/routes";
import BrandLogo from "@/components/BrandLogo";

const FONT_SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const FONT_SANS = "var(--font-montserrat), Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const LEVEL_CONFIG = {
  promo: {
    defaultBadge: "✦ ĐẶC QUYỀN ƯU ĐÃI | EXCLUSIVE PRIVILEGE",
    accentColor: "#C2A979",
    topGradient: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
    tagBg: "rgba(194, 169, 121, 0.12)",
    tagText: "#8A6E3D",
    tagBorder: "rgba(194, 169, 121, 0.4)",
    btnBg: "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
    btnShadow: "0 4px 14px rgba(160, 128, 64, 0.28)",
    btnHoverShadow: "0 6px 20px rgba(160, 128, 64, 0.42)",
    symbol: "✦",
  },
  info: {
    defaultBadge: "✦ THÔNG TIN SALON | SALON INFORMATION",
    accentColor: "#C2A979",
    topGradient: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
    tagBg: "rgba(194, 169, 121, 0.12)",
    tagText: "#8A6E3D",
    tagBorder: "rgba(194, 169, 121, 0.4)",
    btnBg: "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
    btnShadow: "0 4px 14px rgba(160, 128, 64, 0.28)",
    btnHoverShadow: "0 6px 20px rgba(160, 128, 64, 0.42)",
    symbol: "✧",
  },
  warning: {
    defaultBadge: "✦ LƯU Ý DÀNH CHO KHÁCH HÀNG | SALON GUIDELINES",
    accentColor: "#C2A979",
    topGradient: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
    tagBg: "rgba(194, 169, 121, 0.14)",
    tagText: "#8A6E3D",
    tagBorder: "rgba(194, 169, 121, 0.4)",
    btnBg: "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
    btnShadow: "0 4px 14px rgba(160, 128, 64, 0.28)",
    btnHoverShadow: "0 6px 20px rgba(160, 128, 64, 0.42)",
    symbol: "◈",
  },
  urgent: {
    defaultBadge: "✦ THÔNG BÁO ĐẶC BIỆT | SPECIAL ANNOUNCEMENT",
    accentColor: "#C2A979",
    topGradient: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
    tagBg: "rgba(194, 169, 121, 0.16)",
    tagText: "#8A6E3D",
    tagBorder: "rgba(194, 169, 121, 0.45)",
    btnBg: "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
    btnShadow: "0 4px 14px rgba(160, 128, 64, 0.28)",
    btnHoverShadow: "0 6px 20px rgba(160, 128, 64, 0.42)",
    symbol: "❖",
  },
};

export default function AnnouncementModal({ settings }: { settings: SiteSettings }) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [forcePreview, setForcePreview] = useState(false);

  // Normalize popupEnabled (handles boolean, string "true", 1, etc.)
  const isEnabled =
    settings.popupEnabled === true ||
    (settings.popupEnabled as unknown) === "true" ||
    (settings.popupEnabled as unknown) === 1 ||
    (settings.popupEnabled as unknown) === "1";

  const level = (settings.popupLevel || "promo") in LEVEL_CONFIG ? settings.popupLevel : "promo";
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];

  const title = getLocalizedText(settings.popupTitle, locale);
  const content = getLocalizedText(settings.popupContent, locale);
  const badge = getLocalizedText(settings.popupBadge || config.defaultBadge, locale);
  const ctaText = getLocalizedText(settings.popupCtaText, locale);
  const ctaLinkRaw = settings.popupCtaLink?.trim() || "";
  let ctaLink = ctaLinkRaw;
  if (ctaLinkRaw.startsWith("/")) {
    if (!ctaLinkRaw.startsWith("/vi") && !ctaLinkRaw.startsWith("/en")) {
      if (locale === "en" && ctaLinkRaw === "/dat-lich") {
        ctaLink = "/en/booking";
      } else {
        ctaLink = `/${locale}${ctaLinkRaw}`;
      }
    }
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("preview_popup") || params.has("popup")) {
        setForcePreview(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const shouldDisplay = isEnabled || forcePreview;
    if (!shouldDisplay || !settings.popupTitle) {
      setIsOpen(false);
      return;
    }

    const signature = `${settings.popupLevel}_${settings.popupTitle.trim()}_${(settings.popupContent || "").trim()}`;
    const dismissType = settings.popupDismissType || "daily";

    // Check if dismissed (skip if force preview)
    if (!forcePreview) {
      try {
        const stored = localStorage.getItem("moc_announcement_dismissed");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.signature === signature) {
            // If visitor checked "don't show again until new update", or admin set until_change
            if (parsed.dismissedUntilNew === true || dismissType === "until_change") {
              return;
            }
            if (dismissType === "daily") {
              const today = new Date().toISOString().split("T")[0];
              if (parsed.date === today) {
                return;
              }
            }
          }
        }

        if (dismissType === "session") {
          const dismissed = sessionStorage.getItem("moc_announcement_dismissed");
          if (dismissed === signature) return;
        }
      } catch {
        // In case of localStorage disabled in private windows
      }
    }

    // Give preloader (~2.8s) time to finish so popup animates into view smoothly
    const delay = forcePreview ? 400 : 2800;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isEnabled, forcePreview, settings.popupLevel, settings.popupTitle, settings.popupContent, settings.popupDismissType]);

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
      const today = new Date().toISOString().split("T")[0];
      if (dontShowAgain) {
        localStorage.setItem(
          "moc_announcement_dismissed",
          JSON.stringify({ signature, dismissedUntilNew: true, date: today })
        );
        return;
      }

      if (dismissType === "until_change") {
        localStorage.setItem(
          "moc_announcement_dismissed",
          JSON.stringify({ signature, dismissedUntilNew: true, date: today })
        );
      } else if (dismissType === "daily") {
        localStorage.setItem(
          "moc_announcement_dismissed",
          JSON.stringify({ signature, date: today })
        );
      } else if (dismissType === "session") {
        sessionStorage.setItem("moc_announcement_dismissed", signature);
      }
      // If dismissType === 'always' and !dontShowAgain, do not persist
    } catch {
      // Fallback
    }
  }

  if (!isOpen || (!isEnabled && !forcePreview) || !title) return null;

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
        zIndex: 100000,
        backgroundColor: "rgba(20, 16, 12, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        overflowY: "auto",
        animation: "modalBackdropFade 0.25s ease-out forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="announcement-modal-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(194, 169, 121, 0.38)",
          boxShadow: "0 20px 50px -10px rgba(26, 20, 14, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.9) inset",
          overflow: "hidden",
          margin: "auto",
          animation: "modalCardSlide 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: 3,
            background: config.topGradient,
            width: "100%",
          }}
        />

        {/* Subtle Luxury Brand Watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -32,
            right: -32,
            opacity: 0.05,
            pointerEvents: "none",
            transform: "rotate(-12deg)",
            zIndex: 0,
          }}
        >
          <BrandLogo compact size={170} />
        </div>

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
            backgroundColor: "rgba(194, 169, 121, 0.1)",
            color: "#6E5B3D",
            border: "1px solid rgba(194, 169, 121, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.22)";
            e.currentTarget.style.color = "#2E2419";
            e.currentTarget.style.borderColor = "rgba(194, 169, 121, 0.55)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.1)";
            e.currentTarget.style.color = "#6E5B3D";
            e.currentTarget.style.borderColor = "rgba(194, 169, 121, 0.3)";
          }}
        >
          ✕
        </button>

        {/* Modal Header Section */}
        <div style={{ position: "relative", zIndex: 1, padding: "24px 28px 0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 34, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 11px",
                borderRadius: 999,
                backgroundColor: config.tagBg,
                border: `1px solid ${config.tagBorder}`,
                fontFamily: FONT_SANS,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: config.tagText,
              }}
            >
              <span>{config.symbol}</span>
              <span>{badge}</span>
            </span>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginLeft: "auto",
              }}
            >
              <BrandLogo compact size={22} />
              <span
                style={{
                  fontSize: 11.5,
                  fontFamily: FONT_SANS,
                  color: "#8A6E3D",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {settings.siteName || "Mộc Salon"}
              </span>
            </div>
          </div>

          <h2
            id="announcement-modal-title"
            style={{
              margin: "14px 0 0",
              fontFamily: FONT_SERIF,
              fontSize: "clamp(20px, 3vw, 24px)",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: 1.35,
              color: "#1C1814",
            }}
          >
            {title}
          </h2>

          {/* Delicate Hairline Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0 0" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.4), transparent)" }} />
            <span style={{ color: "#C2A979", fontSize: 10, opacity: 0.9 }}>✦</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.4), transparent)" }} />
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ position: "relative", zIndex: 1, padding: "16px 28px 24px 28px", boxSizing: "border-box" }}>
          {content && (
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 14,
                lineHeight: 1.7,
                color: "#2E251E",
                fontWeight: 400,
                whiteSpace: "pre-line",
                marginBottom: 20,
                maxHeight: "45vh",
                overflowY: "auto",
                paddingRight: 6,
              }}
            >
              {content}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {ctaText && ctaLink && (
                <Link
                  href={ctaLink}
                  onClick={handleClose}
                  style={{
                    flex: "1 1 auto",
                    minWidth: 140,
                    height: 42,
                    padding: "0 20px",
                    background: "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
                    color: "#FFFFFF",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontFamily: FONT_SANS,
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "0 3px 12px rgba(160, 128, 64, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 5px 16px rgba(160, 128, 64, 0.45)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 3px 12px rgba(160, 128, 64, 0.3)";
                  }}
                >
                  <span>{ctaText}</span>
                  <span>→</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleClose}
                style={{
                  height: 42,
                  padding: "0 22px",
                  background: ctaText && ctaLink ? "rgba(194, 169, 121, 0.08)" : "linear-gradient(135deg, #C2A979 0%, #A08040 100%)",
                  color: ctaText && ctaLink ? "#7A6230" : "#FFFFFF",
                  border: ctaText && ctaLink ? "1.5px solid rgba(194, 169, 121, 0.45)" : "none",
                  borderRadius: 8,
                  fontFamily: FONT_SANS,
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: ctaText && ctaLink ? "none" : "0 3px 12px rgba(160, 128, 64, 0.3)",
                  flex: ctaText && ctaLink ? "0 0 auto" : "1",
                }}
                onMouseOver={(e) => {
                  if (ctaText && ctaLink) {
                    e.currentTarget.style.borderColor = "#A08040";
                    e.currentTarget.style.color = "#5A4418";
                    e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.16)";
                  } else {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 5px 16px rgba(160, 128, 64, 0.45)";
                  }
                }}
                onMouseOut={(e) => {
                  if (ctaText && ctaLink) {
                    e.currentTarget.style.borderColor = "rgba(194, 169, 121, 0.45)";
                    e.currentTarget.style.color = "#7A6230";
                    e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.08)";
                  } else {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 3px 12px rgba(160, 128, 64, 0.3)";
                  }
                }}
              >
                {isEn ? "Got it / Close" : "Đã hiểu / Đóng"}
              </button>
            </div>

            {/* "Don't show again until there is a new announcement" checkbox option */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
                cursor: "pointer",
                fontFamily: FONT_SANS,
                fontSize: 12,
                color: "#5C4E42",
                fontWeight: 500,
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                style={{ accentColor: "#C2A979", cursor: "pointer", width: 14, height: 14 }}
              />
              <span>{isEn ? "Don't show this again until there's a new update" : "Không hiển thị lại cho đến khi có thông báo mới"}</span>
            </label>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardSlide {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
