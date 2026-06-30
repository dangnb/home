"use client";

import { useState } from "react";
import { saveCategory } from "../actions";
import FormInput from "@/components/ui/FormInput";
import { getTranslation } from "@/lib/utils";

export default function CategoryForm({ languages, category, allCategories = [] }: { languages: any[], category?: any, allCategories?: any[] }) {
    const [activeLang, setActiveLang] = useState(languages.find(l => l.isDefault)?.code || "vi");

    const saveAction = saveCategory.bind(null, category?.id || "new");

    return (
        <form action={saveAction} className="admin-card">
            <FormInput
                label="Đường dẫn tĩnh (Slug URL)"
                type="text"
                name="slug"
                defaultValue={category?.slug || ""}
                required
                placeholder="thu-nghiem, tin-tuc..."
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <FormInput
                    label="Số thứ tự ưu tiên hiển thị"
                    type="number"
                    name="order"
                    defaultValue={category?.order || 0}
                />

                <div className="admin-form-group">
                    <label className="admin-label">Danh mục cha (nhóm vào)</label>
                    <select name="parentId" className="admin-input" defaultValue={category?.parentId || ""}>
                        <option value="">-- Trống (Đây là danh mục lớn nhất) --</option>
                        {allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {getTranslation(cat.translations, "vi", "title") || cat.slug}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
                <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="checkbox" name="isActive" id="isActive" defaultChecked={category ? category.isActive : true} value="true" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                    <label htmlFor="isActive" className="admin-label" style={{ marginBottom: 0, cursor: "pointer" }}>Hoạt động (Hiển thị ra ngoài)</label>
                </div>
                <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="checkbox" name="isMenu" id="isMenu" defaultChecked={category ? category.isMenu : false} value="true" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                    <label htmlFor="isMenu" className="admin-label" style={{ marginBottom: 0, cursor: "pointer" }}>Hiển thị làm Menu trên Header</label>
                </div>
            </div>

            <h3 style={{ marginTop: "20px", marginBottom: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>Bản Dịch Tên Danh Mục</h3>

            <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "30px", gap: "10px", flexWrap: "wrap" }}>
                {languages.map(lang => (
                    <button
                        type="button"
                        key={lang.code}
                        onClick={() => setActiveLang(lang.code)}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            backgroundColor: "transparent",
                            borderBottom: activeLang === lang.code ? "2px solid #3b82f6" : "2px solid transparent",
                            color: activeLang === lang.code ? "#3b82f6" : "#64748b",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginBottom: "-2px",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <i className="ph ph-translate" style={{ fontSize: "1.2rem" }}></i>
                        {lang.name} {lang.isDefault && <span style={{ fontSize: "0.8rem", color: "#8cc63f" }}>(Gốc)</span>}
                    </button>
                ))}
            </div>

            <div className="admin-tab-content">
                {languages.map(lang => (
                    <div key={lang.code} style={{ display: activeLang === lang.code ? "block" : "none" }}>
                        <FormInput
                            label={`Tên Danh mục (${lang.name})`}
                            type="text"
                            name={`title_${lang.code}`}
                            defaultValue={getTranslation(category?.translations, lang.code, 'title')}
                            required={lang.isDefault}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                <button type="submit" className="admin-btn btn-primary" style={{ padding: "12px 24px", fontSize: "1rem" }}>
                    <i className="ph ph-floppy-disk"></i> {category ? "Cập nhật Danh mục" : "Tạo Danh mục mới"}
                </button>
            </div>
        </form>
    );
}
