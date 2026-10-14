"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { SiteSettings } from "@/lib/db";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdAdd, MdCheck, MdDeleteOutline } from "react-icons/md";

export default function AdminAboutContentPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    aboutHeadline: "",
    aboutSubheadline: "",
    aboutValues: [],
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => {
        setSettings({
          aboutHeadline: data.aboutHeadline || "",
          aboutSubheadline: data.aboutSubheadline || "",
          aboutValues: Array.isArray(data.aboutValues) ? data.aboutValues : [],
        });
      })
      .catch(() => setMsg({ type: "error", text: "Không thể tải nội dung giới thiệu. Vui lòng thử lại." }))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  async function handleSave() {
    setIsSaving(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aboutHeadline: settings.aboutHeadline,
        aboutSubheadline: settings.aboutSubheadline,
        aboutValues: settings.aboutValues,
      }),
    });
    setIsSaving(false);
    if (res.ok) flash("success", "Đã lưu nội dung trang giới thiệu thành công!");
    else flash("error", "Lỗi khi lưu thiết lập giới thiệu.");
  }

  function addValue() {
    setSettings((prev) => ({
      ...prev,
      aboutValues: [...(prev.aboutValues || []), { title: "", description: "" }],
    }));
  }

  function updateValue(index: number, field: "title" | "description", val: string) {
    setSettings((prev) => {
      const arr = [...(prev.aboutValues || [])];
      arr[index] = { ...arr[index], [field]: val };
      return { ...prev, aboutValues: arr };
    });
  }

  function removeValue(index: number) {
    setSettings((prev) => ({
      ...prev,
      aboutValues: (prev.aboutValues || []).filter((_, i) => i !== index),
    }));
  }

  if (isInitialLoading) {
    return <AdminLoading variant="form" label="Đang tải trang giới thiệu..." />;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Trang giới thiệu</h1>
          <p className={styles.pageSubtitle}>Cập nhật câu chuyện thương hiệu và những giá trị cốt lõi của Mộc Salon.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={styles.btnPrimary}
          disabled={isSaving}
        >
          <MdCheck size={16} />
          <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.5rem" }}>
          {msg.text}
        </p>
      )}

      <div className={styles.formCard} style={{ marginBottom: "24px" }}>
        <div className={styles.cardSectionTitle}>Phần giới thiệu chung</div>

        <div className={styles.formField}>
          <label>Tiêu đề chính</label>
          <input
            value={settings.aboutHeadline || ""}
            onChange={(e) => setSettings((s) => ({ ...s, aboutHeadline: e.target.value }))}
            placeholder="Ví dụ: Nghệ thuật móng được chăm chút mỗi ngày"
          />
        </div>

        <div className={styles.formField} style={{ marginTop: "14px" }}>
          <label>Mô tả giới thiệu</label>
          <textarea
            value={settings.aboutSubheadline || ""}
            onChange={(e) => setSettings((s) => ({ ...s, aboutSubheadline: e.target.value }))}
            placeholder="Tóm tắt câu chuyện, phong cách và triết lý làm đẹp của salon..."
            rows={4}
          />
        </div>
      </div>

      <div className={styles.formCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div className={styles.cardSectionTitle} style={{ margin: 0, padding: 0, border: "none" }}>
            Giá trị cốt lõi
          </div>
          <button type="button" onClick={addValue} className={styles.btnSecondary} style={{ fontSize: 12.5 }}>
            <MdAdd size={15} />
            <span>Thêm giá trị</span>
          </button>
        </div>

        {(settings.aboutValues || []).length === 0 && (
          <div className={styles.emptyState}>
            <span style={{ fontSize: 24, opacity: 0.6 }}>✦</span>
            <span>Chưa có giá trị cốt lõi nào. Hãy nhấn &quot;Thêm giá trị&quot; để bổ sung.</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(settings.aboutValues || []).map((val, i) => (
            <div key={i} className={styles.sectionCard} style={{ padding: 20, position: "relative" }}>
              <button
                type="button"
                onClick={() => removeValue(i)}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "rgba(184, 70, 59, 0.08)",
                  border: "1px solid rgba(184, 70, 59, 0.2)",
                  color: "#99352A",
                  borderRadius: 7,
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "grid",
                  placeItems: "center",
                  transition: "all 0.2s ease",
                }}
                title="Xóa giá trị này"
              >
                <MdDeleteOutline size={15} />
              </button>
              <div className={styles.formField}>
                <label>Tiêu đề giá trị</label>
                <input
                  value={val.title}
                  onChange={(e) => updateValue(i, "title", e.target.value)}
                  placeholder="Ví dụ: Tỉ mỉ & Thuần khiết"
                />
              </div>
              <div className={styles.formField} style={{ marginBottom: 0, marginTop: "12px" }}>
                <label>Mô tả chi tiết</label>
                <textarea
                  value={val.description}
                  onChange={(e) => updateValue(i, "description", e.target.value)}
                  placeholder="Mô tả chuẩn mực chất lượng và cam kết dành cho khách hàng..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
