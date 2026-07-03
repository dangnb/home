"use client";

import { useState } from "react";
import { updateUserRole, deleteUser } from "../actions";
import { useRouter } from "next/navigation";
import { confirmDelete, toastSuccess } from "@/lib/swalTheme";

interface User {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
}

export default function UserTableAction({ users }: { users: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleRoleChange = async (userId: string, newRole: string) => {
        setLoadingId(userId);
        await updateUserRole(userId, newRole);
        setLoadingId(null);
        toastSuccess("Cập nhật phân quyền thành công!");
        router.refresh();
    };

    const handleDelete = async (userId: string) => {
        const result = await confirmDelete(
            "Khóa / Xóa Tài Khoản?",
            "Xóa xong là mất tích luôn không cứu được đâu nha!"
        );

        if (result.isConfirmed) {
            setLoadingId(userId);
            await deleteUser(userId);
            setLoadingId(null);
            toastSuccess("Thành viên này đã bị trục xuất khỏi máy chủ.");
            router.refresh();
        }
    };

    return (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Tên User</th>
                        <th>Quyền (Role)</th>
                        <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td style={{ fontWeight: 600 }}>{u.email}</td>
                            <td>{u.name || "Chưa cập nhật"}</td>
                            <td>
                                <select
                                    disabled={loadingId === u.id}
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    className="admin-input"
                                    style={{ width: "150px", padding: "6px 12px", background: u.role === "ADMIN" ? "#ef444415" : "#f1f5f9", fontWeight: "bold", color: u.role === "ADMIN" ? "#ef4444" : "#475569" }}
                                >
                                    <option value="USER">USER (Đọc)</option>
                                    <option value="EDITOR">EDITOR (Biên tập)</option>
                                    <option value="ADMIN">ADMIN (Quản trị)</option>
                                </select>
                            </td>
                            <td style={{ textAlign: "right" }}>
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    disabled={loadingId === u.id}
                                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "20px" }}
                                    title="Xóa User"
                                >
                                    {loadingId === u.id
                                        ? <span className="btn-spinner" style={{ borderTopColor: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}></span>
                                        : <i className="ph ph-trash"></i>
                                    }
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Chưa có người dùng nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
