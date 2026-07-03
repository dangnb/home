"use client";

import { signOut } from "next-auth/react";
import { confirmAction } from "@/lib/swalTheme";

export default function LogoutButton() {
    const handleLogout = async () => {
        const result = await confirmAction(
            "Đăng xuất?",
            "Bạn có chắc chắn muốn thoát phiên làm việc?",
            "Đúng, Thoát"
        );

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
