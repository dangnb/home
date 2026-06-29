"use client";

import { useState } from "react";
import Link from "next/link";
import { saveSlide } from "../actions";

interface SlideFormProps {
    slide?: any;
    languages: string[];
}

export default function SlideForm({ slide, languages }: SlideFormProps) {
    const [activeLang, setActiveLang] = useState(languages[0] || "vi");
    const [previewImage, setPreviewImage] = useState<string | null>(slide?.imageUrl || null);

    // Process Translations
    let t: Record<string, any> = {};
    if (slide?.translations) {
        try { t = JSON.parse(slide.translations); } catch (e) { }
    }

    const saveAction = saveSlide.bind(null, slide?.id);

    return (
        <div className="admin-card">
            <form action={saveAction}>
                <div className="admin-stat-grid" style={{ marginBottom: 0, gridTemplateColumns: "1fr 1fr" }}>
                    <div className="admin-form-group">
                        <label className="admin-label">Trạng thái hiển thị</label>
                        <select name="isActive" className="admin-input" defaultValue={slide ? (slide.isActive ? "on" : "off") : "on"}>
                            <option value="on">Cho phép hiển thị</option>
                            <option value="off">Ẩn khỏi website</option>
                        </select>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-label">Thứ tự hiển thị (Số nhỏ xếp trước)</label>
                        <input type="number" name="order" className="admin-input" defaultValue={slide?.order || 0} required />
                    </div>
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Đường dẫn khi click (Tùy chọn)</label>
                    <input type="text" name="linkUrl" className="admin-input" defaultValue={slide?.linkUrl || "#"} />
                </div>

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

                <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "20px", alignItems: "center" }}>
                    <span style={{ marginRight: "20px", fontWeight: "bold", color: "#334155" }}><i className="ph ph-translate"></i> Nội dung Đa Ngôn Ngữ:</span>
                    {languages.map(lang => (
                        <button
                            type="button"
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            style={{
                                padding: "10px 20px", border: "none", backgroundColor: "transparent",
                                borderBottom: activeLang === lang ? "2px solid #3b82f6" : "2px solid transparent",
                                color: activeLang === lang ? "#3b82f6" : "#64748b", fontWeight: "bold", cursor: "pointer", marginBottom: "-2px"
                            }}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {languages.map((lang) => {
                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <div className="admin-form-group">
                                <label className="admin-label">Tiêu đề chính (H1 - {lang.toUpperCase()})</label>
                                <input type="text" name={`title_${lang}`} className="admin-input" defaultValue={t[lang]?.title || ""} required={lang === "vi"} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Tiêu đề phụ ({lang.toUpperCase()})</label>
                                <input type="text" name={`subtitle_${lang}`} className="admin-input" defaultValue={t[lang]?.subtitle || ""} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Mô tả ngắn ({lang.toUpperCase()})</label>
                                <textarea name={`desc_${lang}`} className="admin-textarea" defaultValue={t[lang]?.desc || ""} rows={3}></textarea>
                            </div>
                        </div>
                    )
                })}

                <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <Link href="/admin/slides" className="admin-btn btn-outline">
                        <i className="ph ph-x"></i> Hủy & Quay lại
                    </Link>
                    <button type="submit" className="admin-btn btn-primary">
                        <i className="ph ph-floppy-disk"></i> {slide ? "Cập nhật Slide" : "Thêm Slide mới"}
                    </button>
                </div>
            </form>
        </div>
    );
}
