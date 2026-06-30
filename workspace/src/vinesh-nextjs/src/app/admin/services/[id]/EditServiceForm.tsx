"use client";

import { useState } from "react";
import Link from "next/link";
import { Service } from "@prisma/client";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import { getTranslation } from "@/lib/utils";

interface EditServiceFormProps {
    service: Service;
    languages: string[];
    categories: any[];
    translations: Record<string, any>;
    action: (payload: FormData) => void;
}

export default function EditServiceForm({ service, languages, categories, translations, action }: EditServiceFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");

    return (
        <div className="admin-card">
            <form action={action}>

                <div className="admin-form-group">
                    <label className="admin-label">Chuyên mục (Danh mục bài viết)</label>
                    <select name="categoryId" className="admin-input" defaultValue={(service as any).categoryId || ""} required>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {getTranslation(cat.translations, "vi", "title") || cat.slug}
                            </option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Hình ảnh (Image URL)"
                    type="url"
                    name="imageUrl"
                    defaultValue={service.imageUrl}
                    required
                />

                <FormInput
                    label="Đường dẫn Click (Link URL)"
                    type="text"
                    name="linkUrl"
                    defaultValue={service.linkUrl || "#"}
                />

                <FormInput
                    label="Thứ tự hiển thị (Order)"
                    type="number"
                    name="order"
                    defaultValue={service.order}
                    required
                    min={0}
                />

                <LanguageTabs
                    languages={languages}
                    activeLang={activeLang}
                    onTabChange={setActiveLang}
                />

                {languages.map((lang) => {
                    const isVi = lang === "vi";
                    const defaultTitle = isVi ? service.title : translations[lang]?.title || "";
                    const defaultDesc = isVi ? (service.description || "") : translations[lang]?.description || "";

                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <FormInput
                                label={`Tên Dịch vụ (${lang.toUpperCase()})`}
                                type="text"
                                name={isVi ? "title" : `title_${lang}`}
                                defaultValue={defaultTitle}
                                required={isVi}
                                maxLength={80}
                            />

                            <FormTextarea
                                label={`Mô tả ngắn (${lang.toUpperCase()})`}
                                name={isVi ? "description" : `desc_${lang}`}
                                defaultValue={defaultDesc}
                                rows={3}
                                maxLength={200}
                            />
                        </div>
                    );
                })}

                <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Link href="/admin/services" className="admin-btn btn-outline">Hủy bỏ</Link>
                    <button type="submit" className="admin-btn btn-primary">
                        <i className="ph ph-floppy-disk"></i> Cập nhật Dịch vụ
                    </button>
                </div>
            </form>
        </div>
    );
}
