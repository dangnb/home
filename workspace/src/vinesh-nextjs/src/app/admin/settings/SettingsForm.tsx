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
                <h3 style={{ marginTop: 0, marginBottom: 15, color: "#0f172a", fontSize: "1.2rem" }}>Thông tin Chung</h3>
                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <div className="admin-form-group">
                        <label className="admin-label">Tên công ty / Thương hiệu</label>
                        <input type="text" name="siteName" className="admin-input" defaultValue={settings.siteName} required minLength={2} />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Số điện thoại Hotline</label>
                        <input type="tel" name="phone" className="admin-input" defaultValue={settings.phone} required />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Email liên hệ</label>
                        <input type="email" name="email" className="admin-input" defaultValue={settings.email} />
                    </div>
                </div>

                <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "20px", alignItems: "center" }}>
                    <span style={{ marginRight: "20px", fontWeight: "bold", color: "#334155" }}><i className="ph ph-translate"></i> Nội dung Đa Ngôn Ngữ:</span>
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
                    const s = (key: string) => settings[isVi ? key : `${key}_${lang}`];
                    const n = (key: string) => isVi ? key : `${key}_${lang}`;

                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>

                            <h4 style={{ color: "#38bdf8", borderBottom: "1px dashed #e2e8f0", paddingBottom: "10px" }}>1. Thông tin chân trang (Footer)</h4>
                            <div className="admin-form-group">
                                <label className="admin-label">Địa chỉ Công ty ({lang.toUpperCase()})</label>
                                <input type="text" name={n("address")} className="admin-input" defaultValue={s("address")} />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Mô tả Công ty ở Footer ({lang.toUpperCase()})</label>
                                <textarea name={n("footerDesc")} className="admin-textarea" defaultValue={s("footerDesc")} rows={2}></textarea>
                            </div>

                            <h4 style={{ color: "#38bdf8", borderBottom: "1px dashed #e2e8f0", paddingBottom: "10px", marginTop: "30px" }}>2. Slider Băng rôn (Hero section)</h4>

                            {/* Slide 1 */}
                            <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Slide 1 (Mặc định)</label>

                                {isVi && (
                                    <div className="admin-form-group">
                                        <label className="admin-label">Ảnh Nền Slide 1 (Dùng chung các ngôn ngữ)</label>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {settings.heroImage1 && <img src={settings.heroImage1} width={80} style={{ borderRadius: 6 }} alt="Preview" />}
                                            <input type="file" name="heroImage1" accept="image/*" className="admin-input" style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                )}

                                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề chính (H1)</label>
                                        <input type="text" name={n("heroTitle")} className="admin-input" defaultValue={s("heroTitle")} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề phụ</label>
                                        <input type="text" name={n("heroSubtitle")} className="admin-input" defaultValue={s("heroSubtitle")} />
                                    </div>
                                </div>
                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label">Mô tả Meta / Hero</label>
                                    <textarea name={n("heroDesc")} className="admin-textarea" defaultValue={s("heroDesc")} rows={2}></textarea>
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Slide 2</label>

                                {isVi && (
                                    <div className="admin-form-group">
                                        <label className="admin-label">Ảnh Nền Slide 2 (Dùng chung các ngôn ngữ)</label>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {settings.heroImage2 && <img src={settings.heroImage2} width={80} style={{ borderRadius: 6 }} alt="Preview" />}
                                            <input type="file" name="heroImage2" accept="image/*" className="admin-input" style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                )}

                                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề chính (H1)</label>
                                        <input type="text" name={n("heroTitle2")} className="admin-input" defaultValue={s("heroTitle2")} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề phụ</label>
                                        <input type="text" name={n("heroSubtitle2")} className="admin-input" defaultValue={s("heroSubtitle2")} />
                                    </div>
                                </div>
                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label">Mô tả Meta / Hero</label>
                                    <textarea name={n("heroDesc2")} className="admin-textarea" defaultValue={s("heroDesc2")} rows={2}></textarea>
                                </div>
                            </div>

                            {/* Slide 3 */}
                            <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Slide 3</label>

                                {isVi && (
                                    <div className="admin-form-group">
                                        <label className="admin-label">Ảnh Nền Slide 3 (Dùng chung các ngôn ngữ)</label>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {settings.heroImage3 && <img src={settings.heroImage3} width={80} style={{ borderRadius: 6 }} alt="Preview" />}
                                            <input type="file" name="heroImage3" accept="image/*" className="admin-input" style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                )}

                                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề chính (H1)</label>
                                        <input type="text" name={n("heroTitle3")} className="admin-input" defaultValue={s("heroTitle3")} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tiêu đề phụ</label>
                                        <input type="text" name={n("heroSubtitle3")} className="admin-input" defaultValue={s("heroSubtitle3")} />
                                    </div>
                                </div>
                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label">Mô tả Meta / Hero</label>
                                    <textarea name={n("heroDesc3")} className="admin-textarea" defaultValue={s("heroDesc3")} rows={2}></textarea>
                                </div>
                            </div>

                        </div>
                    )
                })}

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="admin-btn btn-primary">
                        <i className="ph ph-floppy-disk"></i> Lưu cấu hình toàn bộ
                    </button>
                </div>
            </form>
        </div>
    );
}
