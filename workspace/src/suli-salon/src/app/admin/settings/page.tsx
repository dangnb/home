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
      Swal.fire({
        title: "Thành công!",
        text: "Đã lưu cấu hình hệ thống",
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
                    id: "info" as const,
                    label: "Thông thường",
                    sub: "Chào mừng / Tin tức chung",
                    icon: "ℹ️",
                    color: "#2563EB",
                    bg: "#EFF6FF",
                    border: "#3B82F6",
                  },
                  {
                    id: "promo" as const,
                    label: "Khuyến mãi",
                    sub: "Ưu đãi / Giảm giá đặc biệt",
                    icon: "🎁",
                    color: "#BE123C",
                    bg: "#FFF1F2",
                    border: "#E11D48",
                  },
                  {
                    id: "warning" as const,
                    label: "Lưu ý quan trọng",
                    sub: "Đổi lịch / Hướng dẫn đón tiếp",
                    icon: "⚠️",
                    color: "#D97706",
                    bg: "#FFFBEB",
                    border: "#F59E0B",
                  },
                  {
                    id: "urgent" as const,
                    label: "Khẩn cấp",
                    sub: "Thông báo gấp / Tạm ngưng",
                    icon: "🚨",
                    color: "#DC2626",
                    bg: "#FEF2F2",
                    border: "#EF4444",
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

            {/* Inputs grid */}
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  Huy hiệu nhỏ trên đầu popup (Badge)
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: "0.78rem" }}>
                    (Hỗ trợ song ngữ dạng: Tiêu đề TV | English Badge)
                  </span>
                </label>
                <input
                  value={form.popupBadge || ""}
                  onChange={(e) => set("popupBadge", e.target.value)}
                  placeholder="🎁 ƯU ĐÃI ĐẶC BIỆT | SPECIAL PROMOTION"
                />
              </div>

              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  Tiêu đề thông báo (Title) <span style={{ color: "#be123c" }}>*</span>
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: "0.78rem" }}>
                    (Hỗ trợ song ngữ dạng: Tiêu đề TV | English Title)
                  </span>
                </label>
                <input
                  value={form.popupTitle || ""}
                  onChange={(e) => set("popupTitle", e.target.value)}
                  placeholder="Chào mừng bạn đến với Mộc Salon | Welcome to Mộc Salon"
                  required={form.popupEnabled}
                />
              </div>

              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>
                  Nội dung chi tiết thông báo (Content)
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: "0.78rem" }}>
                    (Hỗ trợ xuống dòng & mô tả chi tiết, thể lệ, lưu ý)
                  </span>
                </label>
                <textarea
                  value={form.popupContent || ""}
                  onChange={(e) => set("popupContent", e.target.value)}
                  rows={4}
                  placeholder="Nhập thông tin chi tiết về chương trình ưu đãi, sự kiện hoặc lưu ý dành cho khách hàng..."
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(194,169,121,0.25)", borderRadius: 10, fontSize: "0.88rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              <div className={styles.formField}>
                <label>
                  Chữ trên nút hành động (CTA Text)
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6, fontSize: "0.78rem" }}>
                    (Để trống nếu không muốn hiện nút)
                  </span>
                </label>
                <input
                  value={form.popupCtaText || ""}
                  onChange={(e) => set("popupCtaText", e.target.value)}
                  placeholder="Đặt lịch ngay | Book Now"
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
                <label>Tần suất hiển thị cho mỗi khách truy cập (Dismiss Mode)</label>
                <select
                  value={form.popupDismissType || "daily"}
                  onChange={(e) => set("popupDismissType", e.target.value as "daily" | "session" | "always")}
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
                  <option value="daily">🕒 Mỗi khách chỉ thấy 1 lần trong ngày (Khuyên dùng - chuyên nghiệp, không gây phiền)</option>
                  <option value="session">🌐 Mỗi khách chỉ thấy 1 lần trong mỗi phiên duyệt web</option>
                  <option value="always">⚡ Luôn hiển thị mỗi khi tải lại trang (Thích hợp khi test hoặc thông báo khẩn cấp)</option>
                </select>
              </div>
            </div>

            {/* Live Visual Preview Card */}
            <div className={sStyles.preview} style={{ marginTop: 24 }}>
              <div className={sStyles.previewTitle}>
                👁️ Trình Xem Trước Popup (Live Preview theo mức quan trọng "{form.popupLevel || "promo"}")
              </div>
              <div style={{ padding: "28px 20px", background: "#EAE5DC", display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 500,
                    background: "#FDFBF7",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
                    border: form.popupLevel === "info"
                      ? "1.5px solid #3B82F6"
                      : form.popupLevel === "warning"
                      ? "1.5px solid #F59E0B"
                      : form.popupLevel === "urgent"
                      ? "1.5px solid #EF4444"
                      : "1.5px solid #E11D48",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 22px 18px",
                      background: form.popupLevel === "info"
                        ? "linear-gradient(135deg, #0F172A, #1E3A8A 65%, #3B82F6)"
                        : form.popupLevel === "warning"
                        ? "linear-gradient(135deg, #451A03, #78350F 55%, #D97706)"
                        : form.popupLevel === "urgent"
                        ? "linear-gradient(135deg, #450A0A, #7F1D1D 55%, #DC2626)"
                        : "linear-gradient(135deg, #4C0519, #881337 50%, #C2A979)",
                      color: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          textTransform: "uppercase",
                        }}
                      >
                        {form.popupBadge || "THÔNG BÁO TỪ MỘC SALON"}
                      </span>
                      <span style={{ fontSize: 13, opacity: 0.7 }}>✕</span>
                    </div>
                    <div style={{ fontFamily: "serif", fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                      {form.popupTitle || "Tiêu đề thông báo mẫu..."}
                    </div>
                  </div>

                  <div style={{ padding: "18px 22px 20px" }}>
                    <div style={{ fontSize: 13, color: "#4A4036", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 18 }}>
                      {form.popupContent || "Nội dung chi tiết thông báo sẽ được hiển thị tại đây với giao diện rõ ràng, dễ đọc cho khách hàng..."}
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      {form.popupCtaText && (
                        <div
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            textAlign: "center",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            borderRadius: 6,
                            textTransform: "uppercase",
                            background: form.popupLevel === "info"
                              ? "#2563EB"
                              : form.popupLevel === "warning"
                              ? "#D97706"
                              : form.popupLevel === "urgent"
                              ? "#DC2626"
                              : "#BE123C",
                          }}
                        >
                          {form.popupCtaText} →
                        </div>
                      )}
                      <div
                        style={{
                          padding: "10px 16px",
                          textAlign: "center",
                          color: "#666",
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                        }}
                      >
                        Đã hiểu / Đóng
                      </div>
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
