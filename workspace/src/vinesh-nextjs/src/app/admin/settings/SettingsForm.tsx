"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import SubmitButton from "@/components/ui/SubmitButton";

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

                        </div>
                    )
                })}

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
                    <SubmitButton className="admin-btn btn-primary" icon={<i className="ph ph-floppy-disk"></i>}>
                        Lưu cấu hình toàn bộ
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
