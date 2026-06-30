"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { savePage } from "../../actions";

export default function NewPageForm() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        fd.append("content", content); // Add the Rich Text HTML

        try {
            await savePage("new", fd);
        } catch (error: any) {
            alert(error.message || "Đã xảy ra lỗi");
            setLoading(false);
        }
    }

    return (
        <div className="admin-card">
            <h2 className="admin-page-title"><i className="ph ph-file-text"></i> Tạo Trang Web Động</h2>

            <form onSubmit={handleSubmit}>
                <div className="admin-stat-grid" style={{ marginBottom: "0", gridTemplateColumns: "1fr 1fr" }}>
                    <FormInput
                        label="Tên Trang (Tiêu đề)"
                        type="text"
                        name="title"
                        required
                        placeholder="Ví dụ: Giới thiệu chung"
                    />

                    <FormInput
                        label="Đường dẫn (Slug URL)"
                        type="text"
                        name="slug"
                        required
                        placeholder="Ví dụ: gioi-thieu-chung"
                    />
                </div>

                <div className="admin-form-group">
                    <label className="admin-label">Trạng thái</label>
                    <select name="isActive" className="admin-input" defaultValue="true">
                        <option value="true">Công khai (Hiển thị ngay)</option>
                        <option value="false">Nháp (Ẩn)</option>
                    </select>
                </div>

                {/* RICH TEXT EDITOR */}
                <RichTextEditor
                    label="Nội dung Trang (Rich Text)"
                    value={content}
                    onChange={setContent}
                    placeholder="Bắt đầu soạn thảo với giao diện trực quan..."
                />

                <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                    <button type="submit" className="admin-btn btn-primary" disabled={loading}>
                        {loading ? "Đang lưu..." : <><i className="ph ph-floppy-disk"></i> Lưu Trang mới</>}
                    </button>
                    <button type="button" onClick={() => window.history.back()} className="admin-btn btn-outline" disabled={loading}>
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
}
