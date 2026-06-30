"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";

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
                    <FormInput
                        label="Tên công ty / Thương hiệu"
                        type="text"
                        name="siteName"
                        defaultValue={settings.siteName}
                        required
                        minLength={2}
                    />

                    <FormInput
                        label="Số điện thoại Hotline"
                        type="tel"
                        name="phone"
                        defaultValue={settings.phone}
                        required
                    />

                    <FormInput
                        label="Email liên hệ"
                        type="email"
                        name="email"
                        defaultValue={settings.email}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                    <span style={{ marginRight: "20px", fontWeight: "bold", color: "#334155" }}><i className="ph ph-translate"></i> Nội dung Đa Ngôn Ngữ:</span>
                </div>

                <LanguageTabs
                    languages={languages}
                    activeLang={activeLang}
                    onTabChange={setActiveLang}
                />

                {languages.map((lang) => {
                    const isVi = lang === "vi";
                    const s = (key: string) => settings[isVi ? key : `${key}_${lang}`];
                    const n = (key: string) => isVi ? key : `${key}_${lang}`;

                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>

                            <h4 style={{ color: "#38bdf8", borderBottom: "1px dashed #e2e8f0", paddingBottom: "10px" }}>1. Thông tin chân trang (Footer)</h4>
                            <FormInput
                                label={`Địa chỉ Công ty (${lang.toUpperCase()})`}
                                type="text"
                                name={n("address")}
                                defaultValue={s("address")}
                            />

                            <FormTextarea
                                label={`Mô tả Công ty ở Footer (${lang.toUpperCase()})`}
                                name={n("footerDesc")}
                                defaultValue={s("footerDesc")}
                                rows={2}
                            />

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
                                    <FormInput
                                        label="Tiêu đề chính (H1)"
                                        type="text"
                                        name={n("heroTitle")}
                                        defaultValue={s("heroTitle")}
                                    />
                                    <FormInput
                                        label="Tiêu đề phụ"
                                        type="text"
                                        name={n("heroSubtitle")}
                                        defaultValue={s("heroSubtitle")}
                                    />
                                </div>

                                <FormTextarea
                                    label="Mô tả Meta / Hero"
                                    name={n("heroDesc")}
                                    defaultValue={s("heroDesc")}
                                    rows={2}
                                />
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
                                    <FormInput
                                        label="Tiêu đề chính (H1)"
                                        type="text"
                                        name={n("heroTitle2")}
                                        defaultValue={s("heroTitle2")}
                                    />
                                    <FormInput
                                        label="Tiêu đề phụ"
                                        type="text"
                                        name={n("heroSubtitle2")}
                                        defaultValue={s("heroSubtitle2")}
                                    />
                                </div>
                                <FormTextarea
                                    label="Mô tả Meta / Hero"
                                    name={n("heroDesc2")}
                                    defaultValue={s("heroDesc2")}
                                    rows={2}
                                />
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
                                    <FormInput
                                        label="Tiêu đề chính (H1)"
                                        type="text"
                                        name={n("heroTitle3")}
                                        defaultValue={s("heroTitle3")}
                                    />
                                    <FormInput
                                        label="Tiêu đề phụ"
                                        type="text"
                                        name={n("heroSubtitle3")}
                                        defaultValue={s("heroSubtitle3")}
                                    />
                                </div>
                                <FormTextarea
                                    label="Mô tả Meta / Hero"
                                    name={n("heroDesc3")}
                                    defaultValue={s("heroDesc3")}
                                    rows={2}
                                />
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
