"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import { getTranslation } from "@/lib/utils";

interface NewServiceFormProps {
    languages: string[];
    categories: any[];
    action: (payload: FormData) => void;
}

export default function NewServiceForm({ languages, categories, action }: NewServiceFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");

    return (
        <div className="admin-card">
            <form action={action}>

                <div className="admin-form-group">
                    <label className="admin-label">Chuyên mục (Danh mục bài viết)</label>
                    <select name="categoryId" className="admin-input" required>
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
                    defaultValue="/assets/service1.png"
                    required
                />

                <FormInput
                    label="Đường dẫn Click (Link URL)"
                    type="text"
                    name="linkUrl"
                    defaultValue="#"
                />

                <FormInput
                    label="Thứ tự hiển thị (Order)"
                    type="number"
                    name="order"
                    defaultValue="1"
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
                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <FormInput
                                label={`Tên Dịch vụ (${lang.toUpperCase()})`}
                                type="text"
                                name={isVi ? "title" : `title_${lang}`}
                                required={isVi}
                                maxLength={80}
                            />

                            <FormTextarea
                                label={`Mô tả ngắn (${lang.toUpperCase()})`}
                                name={isVi ? "description" : `desc_${lang}`}
                                rows={3}
                                maxLength={200}
                            />
                        </div>
                    );
                })}

                <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Link href="/admin/services" className="admin-btn btn-outline">Hủy bỏ</Link>
                    <button type="submit" className="admin-btn btn-success">
                        <i className="ph ph-check-circle"></i> Thêm mới
                    </button>
                </div>
            </form>
        </div>
    );
}
