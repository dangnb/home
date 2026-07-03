"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "../admin.module.css";
import sStyles from "./settings.module.css";
import { FormInput } from "@/components/Admin/FormComponents";

interface SiteSettings {
  siteName: string; tagline: string;
  hotline: string; hotline2: string;
  email: string; address: string; workingHours: string;
  facebook: string; tiktok: string; youtube: string;
  zalo: string; instagram: string;
  mapEmbedUrl: string; mapLat: string; mapLng: string;
  seoTitle: string; seoDescription: string; seoKeywords: string;
  footerTaglines: string[];
  copyright: string;
  departureSlots: string[];
  bannerImage: string;
  bannerBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerCta1Text: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Link: string;
  bannerStats: { value: string; label: string }[];
}

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "social" | "map" | "seo" | "footer" | "slots" | "banner">("contact");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setForm);
  }, []);

  function set<K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) {
    setForm(p => p ? { ...p, [key]: val } : p);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
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

  if (!form) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️</div>
      Đang tải cấu hình...
    </div>
  );

  const tabs = [
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
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
            Quản lý thông tin liên hệ, mạng xã hội, bản đồ và SEO
          </p>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1.5rem" }}>
          {msg.type === "error" ? "⚠️ " : "✅ "}{msg.text}
        </p>
      )}

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

        {/* ── Tab: Liên hệ ── */}
        {activeTab === "contact" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>📞 Thông Tin Liên Hệ</h3>
            <div className={styles.formGrid}>
              <FormInput
                label="Tên đơn vị"
                value={form.siteName}
                onChange={(e) => set("siteName", e.target.value)}
                placeholder="Du Thuyền Sông Hàn – 2Da Tickets"
              />
              <FormInput
                label="Slogan / Tagline"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Quầy Vé Du Thuyền Sông Hàn Đà Nẵng Uy Tín"
              />
              <FormInput
                label="Hotline chính"
                required
                icon="📞"
                value={form.hotline}
                onChange={(e) => set("hotline", e.target.value)}
                placeholder="0796768636"
                helpText={`Hiển thị: ${form.hotline ? form.hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3") : "—"}`}
              />
              <FormInput
                label="Hotline phụ (tuỳ chọn)"
                icon="📞"
                value={form.hotline2}
                onChange={(e) => set("hotline2", e.target.value)}
                placeholder="0900000000"
              />
              <FormInput
                label="Email"
                type="email"
                icon="✉️"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="support@duthuyensonghan.vn"
              />
              <FormInput
                label="Giờ làm việc"
                icon="🕐"
                value={form.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
                placeholder="24/7"
              />
              <FormInput
                label="Địa chỉ"
                icon="📍"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Cảng Sông Thu, dưới chân Cầu Trần Thị Lý, Đà Nẵng"
                className={styles.fullWidth}
              />
            </div>

            {/* Preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Xem trước</div>
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
                    <div className={sStyles.previewLabel}>Địa chỉ</div>
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
            <h3 className={styles.cardSectionTitle}>🌐 Mạng Xã Hội</h3>
            <div className={styles.formGrid}>
              {[
                { key: "facebook", icon: "🔵", label: "Facebook", placeholder: "https://www.facebook.com/2datickets" },
                { key: "tiktok", icon: "⚫", label: "TikTok", placeholder: "https://www.tiktok.com/@duthuyensonghan.danang" },
                { key: "youtube", icon: "🔴", label: "YouTube", placeholder: "https://www.youtube.com/@2datickets" },
                { key: "zalo", icon: "🔷", label: "Zalo", placeholder: "https://zalo.me/0796768636" },
                { key: "instagram", icon: "🟣", label: "Instagram", placeholder: "https://www.instagram.com/..." },
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
                      style={{ fontSize: "0.75rem", color: "#01bf93" }}>
                      Kiểm tra link ↗
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Social preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Xem trước icon mạng xã hội</div>
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
            <h3 className={styles.cardSectionTitle}>📍 Cấu Hình Bản Đồ</h3>
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
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5 }}>
                  Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép URL trong thẻ src=""
                </span>
              </div>
            </div>

            {/* Map preview */}
            {form.mapEmbedUrl && (
              <div className={sStyles.preview}>
                <div className={sStyles.previewTitle}>Xem trước bản đồ</div>
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
                  placeholder="Du thuyền Sông Hàn – Đặt Vé Uy Tín, Giá Tốt" />
                <span style={{ fontSize: "0.75rem", color: form.seoTitle.length > 60 ? "#ef4444" : "#94a3b8" }}>
                  {form.seoTitle.length}/60 ký tự {form.seoTitle.length > 60 ? "⚠️ Quá dài" : "✓"}
                </span>
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Mô tả (Meta Description)</label>
                <textarea value={form.seoDescription}
                  onChange={e => set("seoDescription", e.target.value)}
                  rows={3} placeholder="Mô tả ngắn về website..." />
                <span style={{ fontSize: "0.75rem", color: form.seoDescription.length > 160 ? "#ef4444" : "#94a3b8" }}>
                  {form.seoDescription.length}/160 ký tự {form.seoDescription.length > 160 ? "⚠️ Quá dài" : "✓"}
                </span>
              </div>
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Từ khóa (Keywords)</label>
                <input value={form.seoKeywords} onChange={e => set("seoKeywords", e.target.value)}
                  placeholder="du thuyền sông hàn, du thuyen song han, vé du thuyền đà nẵng" />
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Phân cách bằng dấu phẩy</span>
              </div>
            </div>

            {/* SEO preview */}
            <div className={sStyles.preview}>
              <div className={sStyles.previewTitle}>Xem trước kết quả Google</div>
              <div className={sStyles.seoPreview}>
                <div className={sStyles.seoUrl}>duthuyensonghan.vn</div>
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
                  placeholder="© Copyright 2Da Tickets Du Thuyền Sông Hàn Đà Nẵng" />
              </div>

              <div className={styles.formField}>
                <label style={{ marginBottom: "0.5rem", display: "block" }}>
                  Taglines footer
                  <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: "0.5rem", fontSize: "0.78rem" }}>
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
                      placeholder="✅ Ưu tiên view đẹp."
                      style={{ flex: 1, padding: "0.6rem 0.85rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
                    />
                    <button type="button"
                      onClick={() => set("footerTaglines", form.footerTaglines.filter((_, idx) => idx !== i))}
                      style={{ width: "34px", height: "34px", border: "1px solid #fecaca", borderRadius: "8px", background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>
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

        {/* ── Tab: Giờ xuất bến ── */}
        {activeTab === "slots" && (
          <div className={styles.formCard}>
            <h3 className={styles.cardSectionTitle}>🕐 Cấu Hình Giờ Xuất Bến</h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Danh sách các chuyến xuất bến hiển thị trong form đặt lịch. Mỗi dòng là một lựa chọn.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(form.departureSlots ?? []).map((slot, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "#01bf93", color: "#fff", fontSize: "0.72rem",
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
                    placeholder="17:00 – Chuyến chiều"
                    style={{
                      flex: 1, padding: "0.65rem 0.85rem",
                      border: "1.5px solid #e2e8f0", borderRadius: "8px",
                      fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => set("departureSlots", (form.departureSlots ?? []).filter((_, idx) => idx !== i))}
                    style={{
                      width: "34px", height: "34px", border: "1px solid #fecaca",
                      borderRadius: "8px", background: "#fff", color: "#ef4444",
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
              + Thêm chuyến
            </button>

            {/* Preview */}
            <div className={sStyles.preview} style={{ marginTop: "1.5rem" }}>
              <div className={sStyles.previewTitle}>Xem trước trong form đặt lịch</div>
              <div style={{ padding: "1rem" }}>
                <select style={{
                  width: "100%", padding: "0.65rem 0.85rem",
                  border: "1.5px solid #e2e8f0", borderRadius: "8px",
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
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Banner chiếm toàn màn hình trang chủ. Thay đổi ảnh, tiêu đề, nút CTA và các chỉ số thống kê.
            </p>

            <div className={styles.formGrid}>
              {/* Ảnh banner */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Ảnh Banner (URL)</label>
                <div className={sStyles.inputWithIcon}>
                  <span className={sStyles.inputIcon}>🖼️</span>
                  <input value={form.bannerImage ?? ""} onChange={e => set("bannerImage", e.target.value)}
                    placeholder="/images/banner_desktop.webp" />
                </div>
                {form.bannerImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.bannerImage} alt="preview" style={{
                    marginTop: "0.5rem", height: "120px", width: "100%",
                    objectFit: "cover", borderRadius: "10px", border: "1px solid #e2e8f0",
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
                  rows={3} placeholder={"Du Thuyền Sông Hàn Đà Nẵng\nĐặt Vé Giá Tốt – Trực Tiếp Đón Khách"} />
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Dùng Enter để xuống dòng trong tiêu đề</span>
              </div>

              {/* Subtitle */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label>Mô tả phụ (tuỳ chọn)</label>
                <input value={form.bannerSubtitle ?? ""} onChange={e => set("bannerSubtitle", e.target.value)}
                  placeholder="Trực tiếp đón và dẫn lên du thuyền..." />
              </div>

              {/* CTA 1 */}
              <div className={styles.formField}>
                <label>Nút CTA 1 – Text</label>
                <input value={form.bannerCta1Text ?? ""} onChange={e => set("bannerCta1Text", e.target.value)}
                  placeholder="📞 Đặt Vé Ngay" />
              </div>
              <div className={styles.formField}>
                <label>Nút CTA 1 – Link</label>
                <input value={form.bannerCta1Link ?? ""} onChange={e => set("bannerCta1Link", e.target.value)}
                  placeholder="tel:0796768636 hoặc /dat-lich" />
              </div>

              {/* CTA 2 */}
              <div className={styles.formField}>
                <label>Nút CTA 2 – Text</label>
                <input value={form.bannerCta2Text ?? ""} onChange={e => set("bannerCta2Text", e.target.value)}
                  placeholder="Xem Du Thuyền ↓" />
              </div>
              <div className={styles.formField}>
                <label>Nút CTA 2 – Link</label>
                <input value={form.bannerCta2Link ?? ""} onChange={e => set("bannerCta2Link", e.target.value)}
                  placeholder="#khong-an-toi hoặc /gia-ve" />
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
                      style={{ width: "90px", padding: "0.6rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", fontWeight: 700 }}
                    />
                    <input
                      value={stat.label}
                      onChange={e => {
                        const arr = [...(form.bannerStats ?? [])];
                        arr[i] = { ...arr[i], label: e.target.value };
                        set("bannerStats", arr);
                      }}
                      placeholder="Du Thuyền"
                      style={{ flex: 1, padding: "0.6rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
                    />
                    <button type="button"
                      onClick={() => set("bannerStats", (form.bannerStats ?? []).filter((_, idx) => idx !== i))}
                      style={{ width: "34px", height: "34px", border: "1px solid #fecaca", borderRadius: "8px", background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
              <div className={sStyles.previewTitle}>Xem trước banner</div>
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
                    <span style={{ background: "rgba(1,191,147,0.9)", color: "#fff", fontSize: "0.65rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {form.bannerBadge}
                    </span>
                  )}
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", lineHeight: 1.3, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                    {(form.bannerTitle ?? "").split("\\n").join(" · ")}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {form.bannerCta1Text && (
                      <span style={{ background: "var(--primary)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.35rem 0.85rem", borderRadius: "100px" }}>
                        {form.bannerCta1Text}
                      </span>
                    )}
                    {form.bannerCta2Text && (
                      <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, padding: "0.35rem 0.85rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.3)" }}>
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
            {loading ? "Đang lưu..." : "💾 Lưu Cấu Hình"}
          </button>
        </div>
      </form>
    </div>
  );
}
