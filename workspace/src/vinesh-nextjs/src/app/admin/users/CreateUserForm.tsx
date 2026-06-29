"use client";

import { useState } from "react";
import { createUser } from "../actions";

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
                <div>
                    <label className="admin-label">Email đăng nhập</label>
                    <input type="email" name="email" className="admin-input" required placeholder="vidu@vinesh.com" />
                </div>
                <div>
                    <label className="admin-label">Tên hiển thị</label>
                    <input type="text" name="name" className="admin-input" required placeholder="Nguyễn Văn A" />
                </div>
                <div>
                    <label className="admin-label">Mật khẩu</label>
                    <input type="password" name="password" className="admin-input" required placeholder="********" minLength={6} />
                </div>
                <div>
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
