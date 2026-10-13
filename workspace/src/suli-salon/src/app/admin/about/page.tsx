"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { SiteSettings } from "@/lib/db";
import AdminLoading from "@/components/Admin/AdminLoading";

export default function AdminAboutContentPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    aboutHeadline: "",
    aboutSubheadline: "",
    aboutValues: []
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(async r => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then(data => {
        setSettings({
          aboutHeadline: data.aboutHeadline || "",
          aboutSubheadline: data.aboutSubheadline || "",
          aboutValues: Array.isArray(data.aboutValues) ? data.aboutValues : []
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
      })
    });
    setIsSaving(false);
    if (res.ok) flash("success", "About page content saved!");
    else flash("error", "Failed to save settings.");
  }

  function addValue() {
    setSettings(prev => ({
      ...prev,
      aboutValues: [...(prev.aboutValues || []), { title: "", description: "" }]
    }));
  }

  function updateValue(index: number, field: "title" | "description", val: string) {
    setSettings(prev => {
      const arr = [...(prev.aboutValues || [])];
      arr[index] = { ...arr[index], [field]: val };
      return { ...prev, aboutValues: arr };
    });
  }

  function removeValue(index: number) {
    setSettings(prev => ({
      ...prev,
      aboutValues: (prev.aboutValues || []).filter((_, i) => i !== index)
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
          <p className={styles.pageSubtitle}>Cập nhật câu chuyện thương hiệu và những giá trị cốt lõi của Suli Salon.</p>
        </div>
        <button onClick={handleSave} className={styles.btnPrimary} disabled={isSaving}>
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
           style={{ marginBottom: "1.5rem" }}>{msg.text}</p>
      )}

      <div className={styles.formCard} style={{ marginBottom: "24px" }}>
        <div className={styles.cardSectionTitle}>Phần giới thiệu</div>
        
        <div className={styles.formField}>
          <label>Tiêu đề chính</label>
          <input 
            value={settings.aboutHeadline || ""} 
            onChange={e => setSettings(s => ({ ...s, aboutHeadline: e.target.value }))}
            placeholder="Ví dụ: Nghệ thuật móng được chăm chút mỗi ngày"
          />
        </div>

        <div className={styles.formField}>
          <label>Mô tả giới thiệu</label>
          <textarea 
            value={settings.aboutSubheadline || ""} 
            onChange={e => setSettings(s => ({ ...s, aboutSubheadline: e.target.value }))}
            placeholder="Tóm tắt câu chuyện, phong cách và triết lý làm đẹp của salon..."
            rows={4}
          />
        </div>
      </div>

      <div className={styles.formCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className={styles.cardSectionTitle} style={{ margin: 0, padding: 0, border: 'none' }}>Giá trị cốt lõi</div>
            <button onClick={addValue} className={styles.btnSecondary} style={{ fontSize: 12 }}>+ Thêm giá trị</button>
        </div>
        
        {(settings.aboutValues || []).length === 0 && (
            <p style={{ color: '#7d7166', fontSize: 13 }}>Chưa có giá trị cốt lõi nào.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(settings.aboutValues || []).map((val, i) => (
            <div key={i} className={styles.sectionCard} style={{ padding: 16, position: 'relative' }}>
                <button 
                    onClick={() => removeValue(i)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: 14 }}
                    title="Xóa giá trị"
                >🗑️</button>
                <div className={styles.formField}>
                    <label>Tiêu đề</label>
                    <input 
                        value={val.title} 
                        onChange={e => updateValue(i, "title", e.target.value)}
                        placeholder="Ví dụ: Tỉ mỉ"
                        style={{ background: '#fff' }}
                    />
                </div>
                <div className={styles.formField} style={{ marginBottom: 0 }}>
                    <label>Mô tả</label>
                    <textarea 
                        value={val.description} 
                        onChange={e => updateValue(i, "description", e.target.value)}
                        placeholder="e.g. Every stroke is performed with exacting standards."
                        rows={2}
                        style={{ background: '#fff' }}
                    />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
