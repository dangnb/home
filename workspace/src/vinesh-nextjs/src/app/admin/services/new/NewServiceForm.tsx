"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import SubmitButton from "@/components/ui/SubmitButton";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { getTranslation } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/swalTheme";

interface NewServiceFormProps {
    languages: string[];
    categories: any[];
    action: (payload: FormData) => Promise<any>;
}

export default function NewServiceForm({ languages, categories, action }: NewServiceFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [descContent, setDescContent] = useState<Record<string, string>>({});
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        try {
            const res = await action(formData);
            if (res?.success) {
                toastSuccess("Tạo mới thành công!");
                router.push("/admin/services");
                router.refresh();
            }
        } catch (e: any) {
            toastError(e.message || "Tạo mới thất bại!");
        }
    };

    return (
        <div className="admin-card">
            <form action={handleSubmit}>

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

                <div className="admin-form-group">
                    <label className="admin-label">Ảnh Dịch vụ / Bài viết</label>
                    {previewImage && (
                        <div style={{ marginBottom: "15px" }}>
                            <img src={previewImage} alt="Current" style={{ width: "200px", borderRadius: "8px", border: "2px solid #e2e8f0", objectFit: "cover" }} />
                        </div>
                    )}
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="admin-input"
                        required
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
                                label={`Tên Bài viết / Dịch vụ (${lang.toUpperCase()})`}
                                type="text"
                                name={isVi ? "title" : `title_${lang}`}
                                required={isVi}
                                maxLength={80}
                            />

                            <RichTextEditor
                                label={`Nội dung (${lang.toUpperCase()})`}
                                name={isVi ? "description" : `desc_${lang}`}
                                value={descContent[lang] || ""}
                                onChange={(val) => setDescContent(prev => ({ ...prev, [lang]: val }))}
                                placeholder="Viết nội dung bài viết..."
                            />
                        </div>
                    );
                })}

                <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Link href="/admin/services" className="admin-btn btn-outline">Hủy bỏ</Link>
                    <SubmitButton className="admin-btn btn-success" icon={<i className="ph ph-check-circle"></i>}>
                        Thêm mới
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
