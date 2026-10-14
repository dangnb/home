"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedText } from "@/lib/i18n/routes";

const LEVEL_CONFIG = {
  promo: {
    defaultBadge: "✦ ĐẶC QUYỀN ƯU ĐÃI | EXCLUSIVE PRIVILEGE",
    accentColor: "#C2A979",
    topGradient: "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
    tagBg: "rgba(194, 169, 121, 0.12)",
    tagText: "#967840",
    tagBorder: "rgba(194, 169, 121, 0.35)",
    btnBg: "linear-gradient(135deg, #C2A979 0%, #A28448 100%)",
    btnShadow: "0 4px 18px rgba(194, 169, 121, 0.35)",
    btnHoverShadow: "0 6px 24px rgba(194, 169, 121, 0.48)",
    symbol: "✦",
  },
  info: {
    defaultBadge: "✦ THÔNG TIN SALON | SALON INFORMATION",
    accentColor: "#8C7C6D",
    topGradient: "linear-gradient(90deg, transparent, #8C7C6D 30%, #C2A979 50%, #8C7C6D 70%, transparent)",
    tagBg: "rgba(140, 124, 109, 0.12)",
    tagText: "#6B5C4E",
    tagBorder: "rgba(140, 124, 109, 0.32)",
    btnBg: "linear-gradient(135deg, #8C7C6D 0%, #5E5247 100%)",
    btnShadow: "0 4px 18px rgba(140, 124, 109, 0.3)",
    btnHoverShadow: "0 6px 24px rgba(140, 124, 109, 0.42)",
    symbol: "✧",
  },
  warning: {
    defaultBadge: "✦ LƯU Ý DÀNH CHO KHÁCH HÀNG | SALON GUIDELINES",
    accentColor: "#B27A43",
    topGradient: "linear-gradient(90deg, transparent, #B27A43 30%, #D8A066 50%, #B27A43 70%, transparent)",
    tagBg: "rgba(178, 122, 67, 0.12)",
    tagText: "#8F5824",
    tagBorder: "rgba(178, 122, 67, 0.35)",
    btnBg: "linear-gradient(135deg, #B27A43 0%, #8A5420 100%)",
    btnShadow: "0 4px 18px rgba(178, 122, 67, 0.32)",
    btnHoverShadow: "0 6px 24px rgba(178, 122, 67, 0.45)",
    symbol: "◈",
  },
  urgent: {
    defaultBadge: "✦ THÔNG BÁO ĐẶC BIỆT | SPECIAL ANNOUNCEMENT",
    accentColor: "#8B2635",
    topGradient: "linear-gradient(90deg, transparent, #8B2635 30%, #C2A979 50%, #8B2635 70%, transparent)",
    tagBg: "rgba(139, 38, 53, 0.1)",
    tagText: "#7A1C2A",
    tagBorder: "rgba(139, 38, 53, 0.3)",
    btnBg: "linear-gradient(135deg, #8B2635 0%, #681522 100%)",
    btnShadow: "0 4px 18px rgba(139, 38, 53, 0.32)",
    btnHoverShadow: "0 6px 24px rgba(139, 38, 53, 0.45)",
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
        backgroundColor: "rgba(18, 15, 12, 0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        overflowY: "auto",
        animation: "modalBackdropFade 0.3s ease-out forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="announcement-modal-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 530,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
          borderRadius: 20,
          border: "1px solid rgba(194, 169, 121, 0.32)",
          boxShadow: "0 28px 70px -15px rgba(26, 20, 14, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.8) inset",
          overflow: "hidden",
          margin: "auto",
          animation: "modalCardSlide 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards",
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

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={isEn ? "Close announcement" : "Đóng thông báo"}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "rgba(194, 169, 121, 0.08)",
            color: "#857567",
            border: "1px solid rgba(194, 169, 121, 0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.2)";
            e.currentTarget.style.color = "#231B15";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.08)";
            e.currentTarget.style.color = "#857567";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✕
        </button>

        {/* Modal Header Section */}
        <div style={{ padding: "28px 32px 0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 36, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                borderRadius: 20,
                backgroundColor: config.tagBg,
                border: `1px solid ${config.tagBorder}`,
                fontFamily: "Montserrat, sans-serif",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: config.tagText,
              }}
            >
              <span>{config.symbol}</span>
              <span>{badge}</span>
            </span>

            <span
              style={{
                fontSize: 11,
                fontFamily: "Montserrat, sans-serif",
                color: "#A39282",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginLeft: "auto",
              }}
            >
              {settings.siteName || "Mộc Salon"}
            </span>
          </div>

          <h2
            id="announcement-modal-title"
            style={{
              margin: "18px 0 0",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(21px, 3vw, 25px)",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: 1.35,
              color: "#231B15",
            }}
          >
            {title}
          </h2>

          {/* Delicate Hairline Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 0" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.35), transparent)" }} />
            <span style={{ color: config.accentColor, fontSize: 10, opacity: 0.8 }}>✦</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.35), transparent)" }} />
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "18px 32px 26px 32px", boxSizing: "border-box" }}>
          {content && (
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13.5,
                lineHeight: 1.8,
                color: "#54493F",
                whiteSpace: "pre-line",
                marginBottom: 22,
                maxHeight: "42vh",
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
                    padding: "13px 22px",
                    background: config.btnBg,
                    color: "#ffffff",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    boxShadow: config.btnShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.25s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                    e.currentTarget.style.boxShadow = config.btnHoverShadow;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = config.btnShadow;
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
                  padding: "13px 22px",
                  backgroundColor: ctaText && ctaLink ? "transparent" : "#231B15",
                  color: ctaText && ctaLink ? "#75675A" : "#FFFFFF",
                  border: ctaText && ctaLink ? "1.5px solid rgba(117, 103, 90, 0.25)" : "none",
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
                    e.currentTarget.style.borderColor = "#231B15";
                    e.currentTarget.style.color = "#231B15";
                    e.currentTarget.style.backgroundColor = "rgba(194, 169, 121, 0.06)";
                  }
                }}
                onMouseOut={(e) => {
                  if (ctaText && ctaLink) {
                    e.currentTarget.style.borderColor = "rgba(117, 103, 90, 0.25)";
                    e.currentTarget.style.color = "#75675A";
                    e.currentTarget.style.backgroundColor = "transparent";
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
                marginTop: 2,
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
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
