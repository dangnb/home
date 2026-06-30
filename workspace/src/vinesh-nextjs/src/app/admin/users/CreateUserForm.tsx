"use client";

import { useState } from "react";
import { createUser } from "../actions";
import FormInput from "@/components/ui/FormInput";

export default function CreateUserForm() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const fd = new FormData(e.currentTarget);
        const res = await createUser(fd);

        if (res?.error) {
            setError(res.error);
        } else {
            setOpen(false);
            (e.target as HTMLFormElement).reset();
        }
        setLoading(false);
    }

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="admin-btn btn-primary" style={{ marginBottom: "20px" }}>
                <i className="ph ph-plus"></i> Thêm Người Dùng Mới
            </button>
        );
    }

    return (
        <div className="admin-card" style={{ marginBottom: "30px", borderLeft: "4px solid #3b82f6" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "1.1rem" }}>Tạo Tài khoản mới</h3>
            {error && <div style={{ color: "#ef4444", marginBottom: "15px", fontWeight: "bold" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <FormInput
                    label="Email đăng nhập"
                    type="email"
                    name="email"
                    required
                    placeholder="vidu@vinesh.com"
                />

                <FormInput
                    label="Tên hiển thị"
                    type="text"
                    name="name"
                    required
                    placeholder="Nguyễn Văn A"
                />

                <FormInput
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    required
                    placeholder="********"
                    minLength={6}
                />

                <div className="admin-form-group">
                    <label className="admin-label">Quyền hạn (Role)</label>
                    <select name="role" className="admin-input" defaultValue="USER">
                        <option value="USER">USER (Chỉ xem)</option>
                        <option value="EDITOR">EDITOR (Biên tập bài viết)</option>
                        <option value="ADMIN">ADMIN (Quản trị toàn quyền)</option>
                    </select>
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button type="submit" className="admin-btn btn-primary" disabled={loading}>
                        {loading ? "Đang tạo..." : "Xác nhận Tạo"}
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="admin-btn btn-outline">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
