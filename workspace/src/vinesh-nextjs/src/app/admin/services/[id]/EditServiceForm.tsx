"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Service } from "@prisma/client";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import SubmitButton from "@/components/ui/SubmitButton";
import RichTextEditor from "@/components/ui/RichTextEditor";
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
    const [previewImage, setPreviewImage] = useState<string | null>(service.imageUrl || null);

    // Initialize rich text content for all languages
    const [descContent, setDescContent] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        languages.forEach(lang => {
            const isVi = lang === "vi";
            initial[lang] = isVi ? (service.description || "") : (translations[lang]?.description || "");
        });
        return initial;
    });

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

                <div className="admin-form-group">
                    <label className="admin-label">Ảnh Dịch vụ / Bài viết</label>
                    {previewImage && (
                        <div style={{ marginBottom: "15px" }}>
                            <img src={previewImage} alt="Current" style={{ width: "200px", borderRadius: "8px", border: "2px solid #e2e8f0", objectFit: "cover" }} />
                        </div>
                    )}
                    {service.imageUrl && <input type="hidden" name="existingImageUrl" value={service.imageUrl} />}
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="admin-input"
                        required={!service.imageUrl}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setPreviewImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                </div>

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

                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <FormInput
                                label={`Tên Bài viết / Dịch vụ (${lang.toUpperCase()})`}
                                type="text"
                                name={isVi ? "title" : `title_${lang}`}
                                defaultValue={defaultTitle}
                                required={isVi}
                                maxLength={80}
                            />

                            <RichTextEditor
                                label={`Nội dung (${lang.toUpperCase()})`}
                                name={isVi ? "description" : `desc_${lang}`}
                                value={descContent[lang] || ""}
                                onChange={(val) => setDescContent(prev => ({ ...prev, [lang]: val }))}
                                placeholder="Viết nội dung chi tiết của bài viết..."
                            />
                        </div>
                    );
                })}

                <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Link href="/admin/services" className="admin-btn btn-outline">Hủy bỏ</Link>
                    <SubmitButton className="admin-btn btn-primary" icon={<i className="ph ph-floppy-disk"></i>}>
                        Cập nhật Dịch vụ
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
