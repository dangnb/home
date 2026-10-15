"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getLocalizedText, getLocalizedPrice } from "@/lib/i18n/routes";

export type AdminLocale = "vi" | "en";

interface AdminLocaleContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  // Helpers
  t: (text: string | null | undefined, overrideLocale?: AdminLocale) => string;
  tPrice: (price: string | null | undefined, overrideLocale?: AdminLocale) => string;
  tOther: (text: string | null | undefined) => string;
  splitBilingual: (text: string | null | undefined) => { vi: string; en: string };
  joinBilingual: (vi: string, en: string) => string;
}

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null);

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("vi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("moc_admin_locale");
      if (saved === "vi" || saved === "en") {
        setLocaleState(saved);
      }
    } catch {}
  }, []);

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("moc_admin_locale", newLocale);
    } catch {}
  };

  const t = (text: string | null | undefined, overrideLocale?: AdminLocale): string => {
    if (!text) return "";
    return getLocalizedText(text, overrideLocale || locale);
  };

  const tPrice = (price: string | null | undefined, overrideLocale?: AdminLocale): string => {
    if (!price) return "";
    return getLocalizedPrice(price, overrideLocale || locale);
  };

  const tOther = (text: string | null | undefined): string => {
    if (!text || !text.includes(" | ")) return "";
    const otherLocale: AdminLocale = locale === "vi" ? "en" : "vi";
    return getLocalizedText(text, otherLocale);
  };

  const splitBilingual = (text: string | null | undefined): { vi: string; en: string } => {
    if (!text) return { vi: "", en: "" };
    if (text.includes(" | ")) {
      const [vi, en] = text.split(" | ");
      return { vi: (vi || "").trim(), en: (en || "").trim() };
    }
    return { vi: text.trim(), en: "" };
  };

  const joinBilingual = (vi: string, en: string): string => {
    const v = vi?.trim() || "";
    const e = en?.trim() || "";
    if (v && e) return `${v} | ${e}`;
    return v || e || "";
  };

  return (
    <AdminLocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        tPrice,
        tOther,
        splitBilingual,
        joinBilingual,
      }}
    >
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    return {
      locale: "vi" as AdminLocale,
      setLocale: () => {},
      t: (text: string | null | undefined) => (text ? getLocalizedText(text, "vi") : ""),
      tPrice: (price: string | null | undefined) => (price ? getLocalizedPrice(price, "vi") : ""),
      tOther: () => "",
      splitBilingual: (text: string | null | undefined) => ({ vi: text || "", en: "" }),
      joinBilingual: (vi: string, en: string) => (vi && en ? `${vi} | ${en}` : vi || en || ""),
    };
  }
  return ctx;
}

export function AdminLanguageSelector({
  className = "",
  compact = false,
  light = false,
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
}) {
  const { locale, setLocale } = useAdminLocale();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px",
        background: light ? "rgba(194, 169, 121, 0.12)" : "rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        border: `1px solid ${light ? "rgba(194, 169, 121, 0.35)" : "rgba(194, 169, 121, 0.25)"}`,
        gap: "3px",
      }}
      className={className}
      title="Chọn ngôn ngữ hiển thị dữ liệu trong trang quản trị"
    >
      <button
        type="button"
        onClick={() => setLocale("vi")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: compact ? "4px 8px" : "5px 12px",
          fontSize: compact ? "11px" : "12px",
          fontWeight: 700,
          borderRadius: "16px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: locale === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
          color: locale === "vi" ? "#FFFFFF" : light ? "#78695C" : "#C2A979",
          boxShadow: locale === "vi" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
        }}
      >
        <span>🇻🇳</span>
        <span>{compact ? "VI" : "Tiếng Việt"}</span>
      </button>

      <button
        type="button"
        onClick={() => setLocale("en")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: compact ? "4px 8px" : "5px 12px",
          fontSize: compact ? "11px" : "12px",
          fontWeight: 700,
          borderRadius: "16px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: locale === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
          color: locale === "en" ? "#FFFFFF" : light ? "#78695C" : "#C2A979",
          boxShadow: locale === "en" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
        }}
      >
        <span>🇬🇧</span>
        <span>{compact ? "EN" : "English"}</span>
      </button>
    </div>
  );
}
