"use client";

import { useState } from "react";

interface SettingsFormProps {
    settings: Record<string, string>;
    languages: string[];
    action: (payload: FormData) => void;
}

export default function SettingsForm({ settings, languages, action }: SettingsFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");

    return (
        <div className="admin-card">
            <form action={action}>

                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr" }}>
                    <div className="admin-form-group">
                        <label className="admin-label">Tên công ty / Thương hiệu</label>
                        <input type="text" name="siteName" className="admin-input" defaultValue={settings.siteName} required minLength={2} />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Số điện thoại Hotline</label>
                        <input type="tel" name="phone" className="admin-input" defaultValue={settings.phone} required />
                    </div>
                </div>

                <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "10px", alignItems: "center" }}>
                    <span style={{ marginRight: "20px", fontWeight: "bold", color: "#334155" }}><i className="ph ph-translate"></i> Nội dung Cấu hình:</span>
                    {languages.map(lang => (
                        <button
                            type="button"
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                backgroundColor: "transparent",
                                borderBottom: activeLang === lang ? "2px solid #3b82f6" : "2px solid transparent",
                                color: activeLang === lang ? "#3b82f6" : "#64748b",
                                fontWeight: "bold",
                                cursor: "pointer",
                                marginBottom: "-2px"
                            }}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {languages.map((lang) => {
                    const isVi = lang === "vi";
                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <div className="admin-form-group">
                                <label className="admin-label">Tiêu đề chính (H1 - {lang.toUpperCase()})</label>
                                <input type="text" name={isVi ? "heroTitle" : `heroTitle_${lang}`} className="admin-input" defaultValue={settings[isVi ? "heroTitle" : `heroTitle_${lang}`]} required={isVi} maxLength={60} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Tiêu đề phụ ({lang.toUpperCase()})</label>
                                <input type="text" name={isVi ? "heroSubtitle" : `heroSubtitle_${lang}`} className="admin-input" defaultValue={settings[isVi ? "heroSubtitle" : `heroSubtitle_${lang}`]} maxLength={100} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Mô tả Meta / Hero ({lang.toUpperCase()})</label>
                                <textarea name={isVi ? "heroDesc" : `heroDesc_${lang}`} className="admin-textarea" defaultValue={settings[isVi ? "heroDesc" : `heroDesc_${lang}`]} rows={3} maxLength={160}></textarea>
                            </div>
                        </div>
                    )
                })}

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="admin-btn btn-primary">
                        <i className="ph ph-floppy-disk"></i> Lưu cấu hình
                    </button>
                </div>
            </form>
        </div>
    );
}
