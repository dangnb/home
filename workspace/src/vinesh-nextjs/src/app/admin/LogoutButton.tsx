"use client";

import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

export default function LogoutButton() {
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Đăng xuất?',
            text: "Bạn có chắc chắn muốn thoát phiên làm việc?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Đúng, Thoát',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            await signOut({ callbackUrl: "/login" });
        }
    };

    return (
        <button onClick={handleLogout} className="admin-nav-item danger" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
            <i className="ph ph-sign-out" style={{ fontSize: "20px" }}></i> Đăng xuất
        </button>
    );
}
