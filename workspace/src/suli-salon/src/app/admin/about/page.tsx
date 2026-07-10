"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { SiteSettings } from "@/lib/db";

export default function AdminAboutContentPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    aboutHeadline: "",
    aboutSubheadline: "",
    aboutValues: []
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      setSettings({
        aboutHeadline: data.aboutHeadline || "",
        aboutSubheadline: data.aboutSubheadline || "",
        aboutValues: data.aboutValues || []
      });
    });
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

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>About Content</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Manage the introductory text and core values on the About page.
          </p>
        </div>
        <button onClick={handleSave} className={styles.btnPrimary} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
           style={{ marginBottom: "1.5rem" }}>{msg.text}</p>
      )}

      <div className={styles.formCard} style={{ marginBottom: "24px" }}>
        <div className={styles.cardSectionTitle}>Introductory Text</div>
        
        <div className={styles.formField}>
          <label>Headline</label>
          <input 
            value={settings.aboutHeadline || ""} 
            onChange={e => setSettings(s => ({ ...s, aboutHeadline: e.target.value }))}
            placeholder="e.g. A Decade of Refined Artistry"
          />
        </div>

        <div className={styles.formField}>
          <label>Sub-headline</label>
          <textarea 
            value={settings.aboutSubheadline || ""} 
            onChange={e => setSettings(s => ({ ...s, aboutSubheadline: e.target.value }))}
            placeholder="A brief description of your salon's history and philosophy..."
            rows={4}
          />
        </div>
      </div>

      <div className={styles.formCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className={styles.cardSectionTitle} style={{ margin: 0, padding: 0, border: 'none' }}>Core Values</div>
            <button onClick={addValue} className={styles.btnSecondary} style={{ fontSize: 12 }}>+ Add Value</button>
        </div>
        
        {(settings.aboutValues || []).length === 0 && (
            <p style={{ color: '#888', fontSize: 13 }}>No core values added yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(settings.aboutValues || []).map((val, i) => (
            <div key={i} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, background: '#fafafa', position: 'relative' }}>
                <button 
                    onClick={() => removeValue(i)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: 14 }}
                    title="Remove"
                >🗑️</button>
                <div className={styles.formField}>
                    <label>Title</label>
                    <input 
                        value={val.title} 
                        onChange={e => updateValue(i, "title", e.target.value)}
                        placeholder="e.g. Precision"
                        style={{ background: '#fff' }}
                    />
                </div>
                <div className={styles.formField} style={{ marginBottom: 0 }}>
                    <label>Description</label>
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
