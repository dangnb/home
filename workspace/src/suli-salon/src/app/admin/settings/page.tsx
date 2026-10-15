"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "../admin.module.css";
import sStyles from "./settings.module.css";
import { FormInput } from "@/components/Admin/FormComponents";
import AdminLoading from "@/components/Admin/AdminLoading";
import type { SiteSettings } from "@/lib/db";

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"popup" | "contact" | "social" | "map" | "seo" | "footer" | "slots" | "banner">("popup");
  const [popupLang, setPopupLang] = useState<"vi" | "en">("vi");

  useEffect(() => {
    fetch("/api/settings")
      .then(async r => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then(setForm)
      .catch(() => setForm(null))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function set<K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) {
    setForm(p => p ? { ...p, [key]: val } : p);
  }

  function getPart(val?: string, lang: "vi" | "en" = popupLang) {
    if (!val) return "";
    const parts = val.split(" | ");
    if (lang === "vi") return parts[0] || "";
    return parts[1] || parts[0] || "";
  }

  function setPart(original: string | undefined, newVal: string, lang: "vi" | "en" = popupLang) {
    const parts = (original || "").split(" | ");
    const vi = lang === "vi" ? newVal : (parts[0] || "");
    const en = lang === "en" ? newVal : (parts[1] || "");
    if (!en) return vi;
    if (!vi) return en;
    return `${vi} | ${en}`;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      try {
        localStorage.removeItem("moc_announcement_dismissed");
        sessionStorage.removeItem("moc_announcement_dismissed");
      } catch {}
      Swal.fire({
        title: "Thành công!",
        text: "Đã lưu cấu hình hệ thống & làm mới hiển thị popup",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi lưu cấu hình",
        icon: "error"
      });
    }
  }

  if (isInitialLoading) {
    return <AdminLoading variant="form" label="Đang tải cấu hình..." />;
  }

  if (!form) {
    return <div className={styles.alertError}>Không thể tải cấu hình. Vui lòng làm mới trang để thử lại.</div>;
  }

  const tabs = [
    { id: "popup", label: "📢 Popup thông báo", icon: "📢" },
    { id: "contact", label: "📞 Liên hệ", icon: "📞" },
    { id: "social", label: "🌐 Mạng xã hội", icon: "🌐" },
    { id: "map", label: "📍 Bản đồ", icon: "📍" },
    { id: "seo", label: "🔍 SEO", icon: "🔍" },
    { id: "footer", label: "📄 Footer", icon: "📄" },
    { id: "slots", label: "🕐 Giờ xuất bến", icon: "🕐" },
    { id: "banner", label: "🖼️ Banner", icon: "🖼️" },
  ] as const;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Cấu Hình Hệ Thống</h1>
          <p style={{ fontSize: "0.875rem", color: "#888", marginTop: "0.25rem" }}>
            Quản lý thông tin liên hệ, mạng xã hội, bản đồ, SEO và popup thông báo
          </p>
        </div>
      </div>


      <form onSubmit={handleSave}>
        {/* Tab navigation */}
        <div className={sStyles.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              className={`${sStyles.tab} ${activeTab === t.id ? sStyles.tabActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Popup thông báo ── */}
        {activeTab === "popup" && (
          <div className={styles.formCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid rgba(114, 86, 52, 0.12)" }}>
              <div>
                <h3 className={styles.cardSectionTitle} style={{ margin: "0 0 6px" }}>
                  📢 Cấu Hình Popup Thông Báo Khách Truy Cập
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#66594e", margin: 0, lineHeight: 1.5 }}>
                  Tự động hiển thị cửa sổ thông báo/khuyến mãi ngay khi khách hàng tải trang web. Hỗ trợ 4 mức quan trọng với màu sắc trực quan tương ứng.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                  <a
                    href="/?preview_popup=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 6,
                      backgroundColor: "rgba(194, 169, 121, 0.15)",
                      border: "1px solid rgba(194, 169, 121, 0.4)",
                      color: "#725634",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    👁️ Xem thử popup trên web
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem("moc_announcement_dismissed");
                        sessionStorage.removeItem("moc_announcement_dismissed");
                      } catch {}
                      Swal.fire({
                        title: "Đã làm mới!",
                        text: "Đã xóa trạng thái đã đóng popup trên trình duyệt này. Bạn có thể mở trang chủ để kiểm tra ngay.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 6,
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      color: "#374151",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    🧹 Xóa lịch sử đã xem (để test lại)
                  </button>
                </div>
              </div>

              {/* Toggle switch */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: form.popupEnabled ? "rgba(34, 197, 94, 0.12)" : "rgba(120, 107, 94, 0.08)", padding: "8px 18px", borderRadius: 30, border: `1.5px solid ${form.popupEnabled ? "rgba(34, 197, 94, 0.35)" : "rgba(120, 107, 94, 0.2)"}` }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: form.popupEnabled ? "#15803d" : "#786b5e" }}>
                  {form.popupEnabled ? "🟢 ĐANG BẬT" : "⚪ ĐANG TẮT"}
                </span>
                <button
                  type="button"
                  onClick={() => set("popupEnabled", !form.popupEnabled)}
                  style={{
                    position: "relative",
                    width: 48,
                    height: 26,
                    borderRadius: 30,
                    backgroundColor: form.popupEnabled ? "#16a34a" : "#ccc",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.25s ease",
                    padding: 0,
                  }}
                  aria-label="Bật/Tắt Popup"
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: form.popupEnabled ? 25 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      transition: "left 0.25s ease",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Importance Levels Selection */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#302821", marginBottom: 10 }}>
                Mức Độ Quan Trọng Của Thông Báo & Màu Sắc Đại Diện
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
                {[
                  {
                    id: "promo" as const,
                    label: "Đặc quyền & Ưu đãi",
                    sub: "Khuyến mãi / Voucher & Quà tặng",
                    icon: "✦",
                    color: "#C2A979",
                    bg: "#FAF6EF",
                    border: "#C2A979",
                  },
                  {
                    id: "info" as const,
                    label: "Thông tin & Chào mừng",
                    sub: "Giới thiệu / Tin tức chung của Salon",
                    icon: "✧",
                    color: "#8C7C6D",
                    bg: "#F6F4F0",
                    border: "#8C7C6D",
                  },
                  {
                    id: "warning" as const,
                    label: "Lưu ý & Chỉ dẫn",
                    sub: "Hướng dẫn đón tiếp / Điều chỉnh lịch",
                    icon: "◈",
                    color: "#B27A43",
                    bg: "#FBF6EE",
                    border: "#B27A43",
                  },
                  {
                    id: "urgent" as const,
                    label: "Thông báo đặc biệt",
                    sub: "Thông điệp quan trọng / Thông báo gấp",
                    icon: "❖",
                    color: "#8B2635",
                    bg: "#FAF0F2",
                    border: "#8B2635",
                  },
                ].map((lvl) => {
                  const isSelected = (form.popupLevel || "promo") === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => set("popupLevel", lvl.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `2px solid ${isSelected ? lvl.border : "rgba(120, 107, 94, 0.15)"}`,
                        background: isSelected ? lvl.bg : "#fff",
                        boxShadow: isSelected ? `0 4px 14px ${lvl.color}25` : "none",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          backgroundColor: `${lvl.color}18`,
                          color: lvl.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {lvl.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: isSelected ? lvl.color : "#333" }}>
                          {lvl.label}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#777", marginTop: 2 }}>
                          {lvl.sub}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ color: lvl.color, fontWeight: "bold", fontSize: 16 }}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language Switcher Tabs for Announcement */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
              padding: "10px 16px",
              background: "#FAF7F2",
              borderRadius: 12,
              border: "1px solid rgba(194, 169, 121, 0.25)"
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#2E241E" }}>
                Soạn thảo nội dung thông báo theo ngôn ngữ:
              </span>
              <div style={{
                display: "inline-flex",
                padding: "3px",
                background: "rgba(194, 169, 121, 0.15)",
                borderRadius: "20px",
                border: "1px solid rgba(194, 169, 121, 0.35)",
                gap: "3px"
              }}>
                <button
                  type="button"
                  onClick={() => setPopupLang("vi")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "16px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: popupLang === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                    color: popupLang === "vi" ? "#FFFFFF" : "#78695C",
                  }}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setPopupLang("en")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "16px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: popupLang === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                    color: popupLang === "en" ? "#FFFFFF" : "#78695C",
                  }}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Inputs grid */}
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  {popupLang === "vi" ? "Huy hiệu nhỏ trên đầu popup (Badge - Tiếng Việt)" : "Small Top Badge (English)"}
                </label>
                <input
                  value={getPart(form.popupBadge, popupLang)}
                  onChange={(e) => set("popupBadge", setPart(form.popupBadge, e.target.value, popupLang))}
                  placeholder={popupLang === "vi" ? "🎁 ƯU ĐÃI ĐẶC BIỆT" : "SPECIAL PROMOTION"}
                />
              </div>

              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  {popupLang === "vi" ? "Tiêu đề thông báo (Title - Tiếng Việt)" : "Announcement Title (English)"} <span style={{ color: "#be123c" }}>*</span>
                </label>
                <input
                  value={getPart(form.popupTitle, popupLang)}
                  onChange={(e) => set("popupTitle", setPart(form.popupTitle, e.target.value, popupLang))}
                  placeholder={popupLang === "vi" ? "Chào mừng bạn đến với Mộc Salon" : "Welcome to Mộc Salon"}
                  required={form.popupEnabled}
                />
              </div>

              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  {popupLang === "vi" ? "Nội dung chi tiết thông báo (Content - Tiếng Việt)" : "Detailed Content (English)"}
                </label>
                <textarea
                  value={getPart(form.popupContent, popupLang)}
                  onChange={(e) => set("popupContent", setPart(form.popupContent, e.target.value, popupLang))}
                  rows={4}
                  placeholder={popupLang === "vi" ? "Nhập thông tin chi tiết về chương trình ưu đãi, sự kiện..." : "Enter announcement details, promotions, and notes in English..."}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(194,169,121,0.25)", borderRadius: 10, fontSize: "0.88rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              <div className={styles.formField}>
                <label>
                  {popupLang === "vi" ? "Chữ trên nút hành động (CTA Text - Tiếng Việt)" : "Action Button Text (CTA Text - English)"}
                </label>
                <input
                  value={getPart(form.popupCtaText, popupLang)}
                  onChange={(e) => set("popupCtaText", setPart(form.popupCtaText, e.target.value, popupLang))}
                  placeholder={popupLang === "vi" ? "Đặt lịch ngay" : "Book Now"}
                />
              </div>

              <div className={styles.formField}>
                <label>
                  Đường dẫn khi bấm nút (CTA Link)
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: "0.78rem" }}>
                    (Ví dụ: /dat-lich, /services, tel:0988123456)
                  </span>
                </label>
                <input
                  value={form.popupCtaLink || ""}
                  onChange={(e) => set("popupCtaLink", e.target.value)}
                  placeholder="/dat-lich"
                />
              </div>

              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Tần suất hiển thị mặc định (Dismiss Mode)</label>
                <select
                  value={form.popupDismissType || "daily"}
                  onChange={(e) => set("popupDismissType", e.target.value as "daily" | "session" | "always" | "until_change")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1.5px solid rgba(194,169,121,0.25)",
                    borderRadius: 10,
                    fontSize: "0.88rem",
                    backgroundColor: "#fff",
                    outline: "none",
                  }}
                >
                  <option value="daily">🕒 Mỗi khách chỉ thấy 1 lần trong ngày (Khuyên dùng)</option>
                  <option value="until_change">🔒 Chỉ hiển thị 1 lần cho đến khi có thông báo mới (Tối ưu trải nghiệm khách hàng)</option>
                  <option value="session">🌐 Mỗi khách chỉ thấy 1 lần trong mỗi phiên duyệt web</option>
                  <option value="always">⚡ Luôn hiển thị mỗi khi tải lại trang (Thích hợp khi test)</option>
                </select>
              </div>
            </div>

            {/* Live Visual Preview Card */}
            <div className={sStyles.preview} style={{ marginTop: 24 }}>
              <div className={sStyles.previewTitle}>
                👁️ Trình Xem Trước Popup (Live Preview chuẩn Luxury Salon)
              </div>
              <div style={{ padding: "32px 20px", background: "radial-gradient(ellipse at center, #241E1A 0%, #151311 100%)", display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 28px 70px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 255, 255, 0.8) inset",
                    border: "1px solid rgba(194, 169, 121, 0.35)",
                    position: "relative",
                  }}
                >
                  {/* Top Line */}
                  <div
                    style={{
                      height: 3,
                      background: form.popupLevel === "info"
                        ? "linear-gradient(90deg, transparent, #8C7C6D 30%, #C2A979 50%, #8C7C6D 70%, transparent)"
                        : form.popupLevel === "warning"
                        ? "linear-gradient(90deg, transparent, #B27A43 30%, #D8A066 50%, #B27A43 70%, transparent)"
                        : form.popupLevel === "urgent"
                        ? "linear-gradient(90deg, transparent, #8B2635 30%, #C2A979 50%, #8B2635 70%, transparent)"
                        : "linear-gradient(90deg, transparent, #C2A979 30%, #E7D7AF 50%, #C2A979 70%, transparent)",
                    }}
                  />

                  {/* Header Area */}
                  <div style={{ padding: "26px 28px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                          backgroundColor: form.popupLevel === "urgent"
                            ? "rgba(139, 38, 53, 0.1)"
                            : form.popupLevel === "warning"
                            ? "rgba(178, 122, 67, 0.12)"
                            : form.popupLevel === "info"
                            ? "rgba(140, 124, 109, 0.12)"
                            : "rgba(194, 169, 121, 0.12)",
                          border: form.popupLevel === "urgent"
                            ? "1px solid rgba(139, 38, 53, 0.3)"
                            : form.popupLevel === "warning"
                            ? "1px solid rgba(178, 122, 67, 0.35)"
                            : form.popupLevel === "info"
                            ? "1px solid rgba(140, 124, 109, 0.32)"
                            : "1px solid rgba(194, 169, 121, 0.35)",
                          color: form.popupLevel === "urgent"
                            ? "#7A1C2A"
                            : form.popupLevel === "warning"
                            ? "#8F5824"
                            : form.popupLevel === "info"
                            ? "#6B5C4E"
                            : "#967840",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {getPart(form.popupBadge, popupLang) || (popupLang === "en" ? "✦ ANNOUNCEMENT FROM MỘC SALON" : "✦ THÔNG BÁO TỪ MỘC SALON")}
                      </span>
                      <span style={{ fontSize: 11, color: "#A39282", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        Mộc Salon
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 22,
                        fontStyle: "italic",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: "#231B15",
                        marginTop: 14,
                      }}
                    >
                      {getPart(form.popupTitle, popupLang) || (popupLang === "en" ? "Sample Announcement Title..." : "Tiêu đề thông báo mẫu...")}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 0" }}>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.35), transparent)" }} />
                      <span style={{ color: "#C2A979", fontSize: 10, opacity: 0.8 }}>✦</span>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(194, 169, 121, 0.35), transparent)" }} />
                    </div>
                  </div>

                  {/* Body Area */}
                  <div style={{ padding: "16px 28px 24px" }}>
                    <div style={{ fontSize: 13.5, color: "#54493F", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 20 }}>
                      {getPart(form.popupContent, popupLang) || (popupLang === "en" ? "Detailed announcement content will be displayed here in luxury salon style..." : "Nội dung chi tiết thông báo sẽ được hiển thị tại đây với giao diện chuẩn salon cao cấp, tinh tế, trang nhã và tự nhiên...")}
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {getPart(form.popupCtaText, popupLang) && (
                        <div
                          style={{
                            flex: 1,
                            minWidth: 140,
                            padding: "12px 18px",
                            textAlign: "center",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            borderRadius: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            background: form.popupLevel === "urgent"
                              ? "linear-gradient(135deg, #8B2635 0%, #681522 100%)"
                              : form.popupLevel === "warning"
                              ? "linear-gradient(135deg, #B27A43 0%, #8A5420 100%)"
                              : form.popupLevel === "info"
                              ? "linear-gradient(135deg, #8C7C6D 0%, #5E5247 100%)"
                              : "linear-gradient(135deg, #C2A979 0%, #A28448 100%)",
                            boxShadow: "0 4px 16px rgba(194, 169, 121, 0.35)",
                          }}
                        >
                          {getPart(form.popupCtaText, popupLang)} →
                        </div>
                      )}
                      <div
                        style={{
                          padding: "12px 18px",
                          textAlign: "center",
                          color: "#75675A",
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 8,
                          border: "1.5px solid rgba(117, 103, 90, 0.25)",
                          flex: form.popupCtaText ? 0 : 1,
                        }}
                      >
                        Đã hiểu / Đóng
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10, color: "#8C7E72", fontSize: 11 }}>
                      <input type="checkbox" readOnly defaultChecked style={{ accentColor: "#C2A979", width: 13, height: 13 }} />
                      <span>Không hiển thị lại cho đến khi có thông báo mới</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Liên hệ ── */}
        {activeTab === "contact" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>📞 Contact Info</h3>
            <div className={styles.formGrid}>
              <FormInput
                label="Tên đơn vị"
                value={form.siteName}
                onChange={(e) => set("siteName", e.target.value)}
                placeholder="Mộc Salon"
              />
              <FormInput
                label="Slogan / Tagline"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Nghệ thuật móng tinh tế"
              />
              <FormInput
                label="Hotline chính"
                required
                icon="📞"
                value={form.hotline}
                onChange={(e) => set("hotline", e.target.value)}
                placeholder="0988 123 456"
                helpText={`Hiển thị: ${form.hotline ? form.hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3") : "—"}`}
              />
              <FormInput
                label="Hotline phụ (tuỳ chọn)"
                icon="📞"
                value={form.hotline2}
                onChange={(e) => set("hotline2", e.target.value)}
                placeholder="024 3988 8888"
              />
              <FormInput
                label="Email"
                type="email"
                icon="✉️"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="contact@mocsalon.vn"
              />
              <FormInput
                label="Giờ làm việc"
                icon="🕐"
                value={form.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
                placeholder="Thứ Hai – Thứ Bảy: 09:00 – 20:00, Chủ Nhật: 09:00 – 18:00"
              />
              <FormInput
                label="Address"
                icon="📍"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội"
                className={styles.fullWidth}
              />
            </div>

            {/* Preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Preview</div>
              <div className={sStyles.previewContact}>
                <div className={sStyles.previewItem}>
                  <span>📞</span>
                  <div>
                    <div className={sStyles.previewLabel}>Hotline ({form.workingHours})</div>
                    <div className={sStyles.previewValue}>{form.hotline || "—"}</div>
                  </div>
                </div>
                <div className={sStyles.previewItem}>
                  <span>✉️</span>
                  <div>
                    <div className={sStyles.previewLabel}>Email</div>
                    <div className={sStyles.previewValue}>{form.email || "—"}</div>
                  </div>
                </div>
                <div className={sStyles.previewItem}>
                  <span>📍</span>
                  <div>
                    <div className={sStyles.previewLabel}>Address</div>
                    <div className={sStyles.previewValue}>{form.address || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Mạng xã hội ── */}
        {activeTab === "social" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>🌐 Social Media</h3>
            <div className={styles.formGrid}>
              {[
                { key: "facebook", icon: "🔵", label: "Facebook", placeholder: "https://facebook.com/mocsalon.vietnam" },
                { key: "tiktok", icon: "⚫", label: "TikTok", placeholder: "https://tiktok.com/@mocsalon.official" },
                { key: "youtube", icon: "🔴", label: "YouTube", placeholder: "https://youtube.com/@mocsalon" },
                { key: "zalo", icon: "🔷", label: "Zalo", placeholder: "https://zalo.me/0988123456" },
                { key: "instagram", icon: "🟣", label: "Instagram", placeholder: "https://instagram.com/mocsalon.official" },
              ].map(s => (
                <div key={s.key} className={styles.formField}>
                  <label>{s.icon} {s.label}</label>
                  <div className={sStyles.inputWithIcon}>
                    <span className={sStyles.inputIcon}>{s.icon}</span>
                    <input
                      type="url"
                      value={form[s.key as keyof SiteSettings] as string}
                      onChange={e => set(s.key as keyof SiteSettings, e.target.value)}
                      placeholder={s.placeholder}
                    />
                  </div>
                  {(form[s.key as keyof SiteSettings] as string) && (
                    <a href={form[s.key as keyof SiteSettings] as string}
                      target="_blank" rel="noreferrer"
                      style={{ fontSize: "0.8rem", color: "#876938", fontWeight: 600 }}>
                      Kiểm tra link ↗
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Social preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Preview icon mạng xã hội</div>
              <div className={sStyles.socialPreview}>
                {form.facebook && <a href={form.facebook} target="_blank" rel="noreferrer" className={sStyles.socialChip} style={{ background: "#1877f2" }}>f Facebook</a>}
                {form.tiktok && <a href={form.tiktok} target="_blank" rel="noreferrer" className={sStyles.socialChip} style={{ background: "#000" }}>♪ TikTok</a>}
                {form.youtube && <a href={form.youtube} target="_blank" rel="noreferrer" className={sStyles.socialChip} style={{ background: "#ff0000" }}>▶ YouTube</a>}
                {form.zalo && <a href={form.zalo} target="_blank" rel="noreferrer" className={sStyles.socialChip} style={{ background: "#0068ff" }}>Z Zalo</a>}
                {form.instagram && <a href={form.instagram} target="_blank" rel="noreferrer" className={sStyles.socialChip} style={{ background: "#e1306c" }}>📷 Instagram</a>}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Bản đồ ── */}
        {activeTab === "map" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>📍 Cấu Hình Map</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label>Vĩ độ (Latitude)</label>
                <input value={form.mapLat} onChange={e => set("mapLat", e.target.value)}
                  placeholder="16.0600" />
              </div>
              <div className={styles.formField}>
                <label>Kinh độ (Longitude)</label>
                <input value={form.mapLng} onChange={e => set("mapLng", e.target.value)}
                  placeholder="108.2270" />
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Google Maps Embed URL</label>
                <textarea
                  value={form.mapEmbedUrl}
                  onChange={e => set("mapEmbedUrl", e.target.value)}
                  rows={4}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <span style={{ fontSize: "0.8rem", color: "#75695e", fontWeight: 500, lineHeight: 1.5 }}>
                  {`Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép URL trong thẻ src=""`}
                </span>
              </div>
            </div>

            {/* Map preview */}
            {form.mapEmbedUrl && (
              <div className={sStyles.preview}>
                <div className={sStyles.previewTitle}>Preview bản đồ</div>
                <div className={sStyles.mapPreview}>
                  <iframe
                    src={form.mapEmbedUrl}
                    width="100%" height="300"
                    style={{ border: 0, borderRadius: "10px" }}
                    allowFullScreen loading="lazy"
                    title="Map preview"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: SEO ── */}
        {activeTab === "seo" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>🔍 Cấu Hình SEO</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Tiêu đề trang (SEO Title)</label>
                <input value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}
                  placeholder="Mộc Salon – Nghệ thuật móng tinh tế" />
                <span style={{ fontSize: "0.8rem", color: form.seoTitle.length > 60 ? "#c24138" : "#75695e", fontWeight: 500 }}>
                  {form.seoTitle.length}/60 ký tự {form.seoTitle.length > 60 ? "⚠️ Quá dài" : "✓"}
                </span>
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Mô tả (Meta Description)</label>
                <textarea value={form.seoDescription}
                  onChange={e => set("seoDescription", e.target.value)}
                  rows={3} placeholder="Mô tả ngắn về website..." />
                <span style={{ fontSize: "0.8rem", color: form.seoDescription.length > 160 ? "#c24138" : "#75695e", fontWeight: 500 }}>
                  {form.seoDescription.length}/160 ký tự {form.seoDescription.length > 160 ? "⚠️ Quá dài" : "✓"}
                </span>
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Keywords</label>
                <input value={form.seoKeywords} onChange={e => set("seoKeywords", e.target.value)}
                  placeholder="nail salon prague, gel nails, manicure, pedicure, nail art" />
                <span style={{ fontSize: "0.8rem", color: "#75695e", fontWeight: 500 }}>Separate with commas</span>
              </div>
            </div>

            {/* SEO preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Preview kết quả Google</div>
              <div className={sStyles.seoPreview}>
                <div className={sStyles.seoUrl}>mocsalon.vn</div>
                <div className={sStyles.seoTitle}>{form.seoTitle || "Tiêu đề trang"}</div>
                <div className={sStyles.seoDesc}>{form.seoDescription || "Mô tả trang..."}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Footer ── */}
        {activeTab === "footer" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>📄 Nội Dung Footer</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.formField}>
                <label>Dòng bản quyền</label>
                <input value={form.copyright} onChange={e => set("copyright", e.target.value)}
                  placeholder="© 2025 Mộc Salon – Bảo lưu mọi quyền" />
              </div>

              <div className={styles.formField}>
                <label style={{ marginBottom: "0.5rem", display: "block" }}>
                  Taglines footer
                  <span style={{ fontWeight: 500, color: "#75695e", marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                    (hiển thị dưới logo)
                  </span>
                </label>
                {form.footerTaglines.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <input
                      value={line}
                      onChange={e => {
                        const arr = [...form.footerTaglines];
                        arr[i] = e.target.value;
                        set("footerTaglines", arr);
                      }}
                      placeholder="✨ Không gian thư giãn, phong cách mộc tự nhiên"
                      style={{ flex: 1, padding: "0.6rem 0.85rem", border: "1.5px solid rgba(194,169,121,0.15)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
                    />
                    <button type="button"
                      onClick={() => set("footerTaglines", form.footerTaglines.filter((_, idx) => idx !== i))}
                      style={{ width: "34px", height: "34px", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "12px", background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button"
                  className={styles.btnSecondary}
                  style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}
                  onClick={() => set("footerTaglines", [...form.footerTaglines, ""])}>
                  + Thêm dòng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Giờ Hẹn ── */}
        {activeTab === "slots" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>🕐 Cấu Hình Giờ Hẹn</h3>
            <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Danh sách các khung giờ để khách chọn khi đặt lịch. Mỗi dòng là một lựa chọn.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(form.departureSlots ?? []).map((slot, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "#C2A979", color: "#fff", fontSize: "0.8rem",
                    fontWeight: 800, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>{i + 1}</span>
                  <input
                    value={slot}
                    onChange={e => {
                      const arr = [...(form.departureSlots ?? [])];
                      arr[i] = e.target.value;
                      set("departureSlots", arr);
                    }}
                    placeholder="10:00 - Sáng"
                    style={{
                      flex: 1, padding: "0.65rem 0.85rem",
                      border: "1.5px solid rgba(194,169,121,0.15)", borderRadius: "12px",
                      fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => set("departureSlots", (form.departureSlots ?? []).filter((_, idx) => idx !== i))}
                    style={{
                      width: "34px", height: "34px", border: "1px solid rgba(192,57,43,0.2)",
                      borderRadius: "12px", background: "#fff", color: "#ef4444",
                      cursor: "pointer", flexShrink: 0, fontSize: "0.9rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >✕</button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.btnSecondary}
              style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}
              onClick={() => set("departureSlots", [...(form.departureSlots ?? []), ""])}
            >
              + Thêm khung giờ
            </button>

            {/* Preview */}
            <div className={sStyles.preview} style={{ marginTop: "1.5rem" }}>
              <div className={sStyles.previewTitle}>Preview trong form appointment</div>
              <div style={{ padding: "1rem" }}>
                <select style={{
                  width: "100%", padding: "0.65rem 0.85rem",
                  border: "1.5px solid rgba(194,169,121,0.15)", borderRadius: "12px",
                  fontSize: "0.875rem", background: "#fff",
                }}>
                  {(form.departureSlots ?? []).map((slot, i) => (
                    <option key={i}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Banner ── */}
        {activeTab === "banner" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>🖼️ Cấu Hình Banner Trang Chủ</h3>
            <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Banner chiếm toàn màn hình trang chủ. Thay đổi ảnh, tiêu đề, nút CTA và các chỉ số thống kê.
            </p>

            <div className={styles.formGrid}>
              {/* Ảnh banner */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Ảnh Banner (URL)</label>
                <div className={sStyles.inputWithIcon}>
                  <span className={sStyles.inputIcon}>🖼️</span>
                  <input value={form.bannerImage ?? ""} onChange={e => set("bannerImage", e.target.value)}
                    placeholder="https://.../banner-moc-salon.jpg" />
                </div>
                {form.bannerImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.bannerImage} alt="preview" style={{
                    marginTop: "0.5rem", height: "120px", width: "100%",
                    objectFit: "cover", borderRadius: "14px", border: "1px solid rgba(194,169,121,0.15)",
                  }} />
                )}
              </div>

              {/* Badge */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Badge (dòng nhỏ phía trên tiêu đề)</label>
                <input value={form.bannerBadge ?? ""} onChange={e => set("bannerBadge", e.target.value)}
                  placeholder="⭐ Hơn 1000 đánh giá 5 sao trên Google" />
              </div>

              {/* Tiêu đề */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Tiêu đề chính</label>
                <textarea value={form.bannerTitle ?? ""} onChange={e => set("bannerTitle", e.target.value)}
                  rows={3} placeholder={"Mộc Salon\nNghệ thuật móng tinh tế"} />
                <span style={{ fontSize: "0.8rem", color: "#75695e", fontWeight: 500 }}>Dùng Enter để xuống dòng trong tiêu đề</span>
              </div>

              {/* Subtitle */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Mô tả phụ (tuỳ chọn)</label>
                <input value={form.bannerSubtitle ?? ""} onChange={e => set("bannerSubtitle", e.target.value)}
                  placeholder="Chăm sóc móng tinh tế, dành riêng cho vẻ đẹp của bạn..." />
              </div>

              {/* CTA 1 */}
              <div className={styles.formField}>
                <label>Nút CTA 1 – Text</label>
                <input value={form.bannerCta1Text ?? ""} onChange={e => set("bannerCta1Text", e.target.value)}
                  placeholder="Đặt lịch ngay" />
              </div>
              <div className={styles.formField}>
                <label>Nút CTA 1 – Link</label>
                <input value={form.bannerCta1Link ?? ""} onChange={e => set("bannerCta1Link", e.target.value)}
                  placeholder="tel:+84123456789 hoặc /booking" />
              </div>

              {/* CTA 2 */}
              <div className={styles.formField}>
                <label>Nút CTA 2 – Text</label>
                <input value={form.bannerCta2Text ?? ""} onChange={e => set("bannerCta2Text", e.target.value)}
                  placeholder="Khám phá dịch vụ ↓" />
              </div>
              <div className={styles.formField}>
                <label>Nút CTA 2 – Link</label>
                <input value={form.bannerCta2Link ?? ""} onChange={e => set("bannerCta2Link", e.target.value)}
                  placeholder="#dich-vu hoặc /services" />
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.75rem" }}>
                Chỉ số thống kê (hiển thị dưới nút CTA)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(form.bannerStats ?? []).map((stat, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      value={stat.value}
                      onChange={e => {
                        const arr = [...(form.bannerStats ?? [])];
                        arr[i] = { ...arr[i], value: e.target.value };
                        set("bannerStats", arr);
                      }}
                      placeholder="10+"
                      style={{ width: "90px", padding: "0.6rem 0.75rem", border: "1.5px solid rgba(194,169,121,0.15)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", fontWeight: 700 }}
                    />
                    <input
                      value={stat.label}
                      onChange={e => {
                        const arr = [...(form.bannerStats ?? [])];
                        arr[i] = { ...arr[i], label: e.target.value };
                        set("bannerStats", arr);
                      }}
                      placeholder="Năm kinh nghiệm"
                      style={{ flex: 1, padding: "0.6rem 0.75rem", border: "1.5px solid rgba(194,169,121,0.15)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
                    />
                    <button type="button"
                      onClick={() => set("bannerStats", (form.bannerStats ?? []).filter((_, idx) => idx !== i))}
                      style={{ width: "34px", height: "34px", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "12px", background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className={styles.btnSecondary}
                  style={{ fontSize: "0.82rem", marginTop: "0.25rem", width: "fit-content" }}
                  onClick={() => set("bannerStats", [...(form.bannerStats ?? []), { value: "", label: "" }])}>
                  + Thêm chỉ số
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className={sStyles.preview} style={{ marginTop: "1.5rem" }}>
              <div className={sStyles.previewTitle}>Preview banner</div>
              <div style={{
                position: "relative", height: "220px", borderRadius: "0 0 10px 10px",
                overflow: "hidden", background: "#0d1f3c",
              }}>
                {form.bannerImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.bannerImage} alt="preview" style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", opacity: 0.5,
                  }} />
                )}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, transparent 0%, rgba(0,15,35,0.85) 100%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "1.25rem", textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                }}>
                  {form.bannerBadge && (
                    <span style={{ background: "rgba(1,191,147,0.9)", color: "#fff", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.055em", lineHeight: 1.25 }}>
                      {form.bannerBadge}
                    </span>
                  )}
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", lineHeight: 1.3, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                    {(form.bannerTitle ?? "").split("\\n").join(" · ")}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {form.bannerCta1Text && (
                      <span style={{ background: "var(--primary)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, padding: "0.35rem 0.85rem", borderRadius: "100px" }}>
                        {form.bannerCta1Text}
                      </span>
                    )}
                    {form.bannerCta2Text && (
                      <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.8rem", fontWeight: 600, padding: "0.35rem 0.85rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.3)" }}>
                        {form.bannerCta2Text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "2rem", marginTop: "0.5rem" }}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}
            style={{ padding: "0.7rem 2rem", fontSize: "0.95rem" }}>
            {loading ? "Saving..." : "💾 Lưu Cấu Hình"}
          </button>
        </div>
      </form>
    </div>
  );
}
