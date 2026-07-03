"use client";

import { useState } from "react";
import Link from "next/link";
import { saveSlide } from "../actions";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import LanguageTabs from "@/components/ui/LanguageTabs";
import SubmitButton from "@/components/ui/SubmitButton";
import { getTranslation } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/swalTheme";

interface SlideFormProps {
    slide?: any;
    languages: string[];
}

export default function SlideForm({ slide, languages }: SlideFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");
    const [previewImage, setPreviewImage] = useState<string | null>(slide?.imageUrl || null);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        try {
            const saveAction = saveSlide.bind(null, slide?.id || "new");
            const res = await saveAction(formData);
            if (res?.success) {
                toastSuccess("Lưu Slide thành công!");
                router.push("/admin/slides");
                router.refresh();
            }
        } catch (e: any) {
            toastError(e.message || "Lỗi lưu Slide!");
        }
    };

    return (
        <div className="admin-card">
            <form action={handleSubmit}>
                <div className="admin-stat-grid" style={{ marginBottom: 0, gridTemplateColumns: "1fr 1fr" }}>
                    <div className="admin-form-group">
                        <label className="admin-label">Trạng thái hiển thị</label>
                        <select name="isActive" className="admin-input" defaultValue={slide ? (slide.isActive ? "on" : "off") : "on"}>
                            <option value="on">Cho phép hiển thị</option>
                            <option value="off">Ẩn khỏi website</option>
                        </select>
                    </div>

                    <FormInput
                        label="Thứ tự hiển thị (Số nhỏ xếp trước)"
                        type="number"
                        name="order"
                        defaultValue={slide?.order || 0}
                        required
                    />
                </div>

                <FormInput
                    label="Đường dẫn khi click (Tùy chọn)"
                    type="text"
                    name="linkUrl"
                    defaultValue={slide?.linkUrl || "#"}
                />

                <div className="admin-form-group">
                    <label className="admin-label">Ảnh Banner (Sẽ áp dụng chung cho tất cả ngôn ngữ)</label>
                    {previewImage && (
                        <div style={{ marginBottom: "15px" }}>
                            <img src={previewImage} alt="Current" style={{ width: "200px", borderRadius: "8px", border: "2px solid #e2e8f0", objectFit: "cover" }} />
                        </div>
                    )}
                    {slide?.imageUrl && <input type="hidden" name="existingImageUrl" value={slide.imageUrl} />}
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="admin-input"
                        required={!slide?.imageUrl}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setPreviewImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
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
                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <FormInput
                                label={`Tiêu đề chính (H1 - ${lang.toUpperCase()})`}
                                type="text"
                                name={`title_${lang}`}
                                defaultValue={getTranslation(slide?.translations, lang, 'title')}
                                required={lang === "vi"}
                            />

                            <FormInput
                                label={`Tiêu đề phụ (${lang.toUpperCase()})`}
                                type="text"
                                name={`subtitle_${lang}`}
                                defaultValue={getTranslation(slide?.translations, lang, 'subtitle')}
                            />

                            <FormTextarea
                                label={`Mô tả ngắn (${lang.toUpperCase()})`}
                                name={`desc_${lang}`}
                                defaultValue={getTranslation(slide?.translations, lang, 'desc')}
                                rows={3}
                            />
                        </div>
                    )
                })}

                <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <Link href="/admin/slides" className="admin-btn btn-outline">
                        <i className="ph ph-x"></i> Hủy & Quay lại
                    </Link>
                    <SubmitButton className="admin-btn btn-primary" icon={<i className="ph ph-floppy-disk"></i>}>
                        {slide ? "Cập nhật Slide" : "Thêm Slide mới"}
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
