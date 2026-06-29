"use client";

import { useState } from "react";
import Link from "next/link";
import { Service } from "@prisma/client";

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
                        {categories.map(cat => {
                            let title = cat.slug;
                            try {
                                const trans = JSON.parse(cat.translations || "{}");
                                if (trans["vi"]?.title) title = trans["vi"].title;
                            } catch (e) { }
                            return <option key={cat.id} value={cat.id}>{title}</option>
                        })}
                    </select>
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Hình ảnh (Image URL)</label>
                    <input type="url" name="imageUrl" className="admin-input" defaultValue={service.imageUrl} required />
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Đường dẫn Click (Link URL)</label>
                    <input type="text" name="linkUrl" className="admin-input" defaultValue={service.linkUrl || "#"} />
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Thứ tự hiển thị (Order)</label>
                    <input type="number" name="order" className="admin-input" defaultValue={service.order} required min={0} />
                </div>

                <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "30px" }}>
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
                            <i className="ph ph-translate"></i> {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {languages.map((lang) => {
                    const isVi = lang === "vi";
                    const defaultTitle = isVi ? service.title : translations[lang]?.title || "";
                    const defaultDesc = isVi ? (service.description || "") : translations[lang]?.description || "";

                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <div className="admin-form-group">
                                <label className="admin-label">Tên Dịch vụ ({lang.toUpperCase()})</label>
                                <input type="text" name={isVi ? "title" : `title_${lang}`} className="admin-input" defaultValue={defaultTitle} required={isVi} maxLength={80} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Mô tả ngắn ({lang.toUpperCase()})</label>
                                <textarea name={isVi ? "description" : `desc_${lang}`} className="admin-textarea" defaultValue={defaultDesc} rows={3} maxLength={200}></textarea>
                            </div>
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
