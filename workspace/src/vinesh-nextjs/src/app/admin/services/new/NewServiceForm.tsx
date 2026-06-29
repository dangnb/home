"use client";

import { useState } from "react";
import Link from "next/link";

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
                    <input type="url" name="imageUrl" className="admin-input" defaultValue="/assets/service1.png" required />
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Đường dẫn Click (Link URL)</label>
                    <input type="text" name="linkUrl" className="admin-input" defaultValue="#" />
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Thứ tự hiển thị (Order)</label>
                    <input type="number" name="order" className="admin-input" defaultValue="1" required min={0} />
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
                    return (
                        <div key={lang} style={{ display: activeLang === lang ? "block" : "none" }}>
                            <div className="admin-form-group">
                                <label className="admin-label">Tên Dịch vụ ({lang.toUpperCase()})</label>
                                <input type="text" name={isVi ? "title" : `title_${lang}`} className="admin-input" required={isVi} maxLength={80} />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Mô tả ngắn ({lang.toUpperCase()})</label>
                                <textarea name={isVi ? "description" : `desc_${lang}`} className="admin-textarea" rows={3} maxLength={200}></textarea>
                            </div>
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
