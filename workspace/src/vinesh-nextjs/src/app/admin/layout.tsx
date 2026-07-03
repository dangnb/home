import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./admin.css"; // The professional styles
import "@/app/globals.css";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any)?.role || "USER";

    return (
        <div className="admin-wrapper">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <i className="ph ph-shield-check" style={{ fontSize: "28px", color: "#38bdf8" }}></i>
                    <h2>VINESH {role}</h2>
                </div>

                <nav className="admin-nav">
                    <Link href="/admin" className="admin-nav-item">
                        <i className="ph ph-squares-four" style={{ fontSize: "20px" }}></i> Dashboard
                    </Link>

                    <Link href="/admin/services" className="admin-nav-item">
                        <i className="ph ph-briefcase" style={{ fontSize: "20px" }}></i> Quản lý Bài viết / Dịch vụ
                    </Link>
                    <Link href="/admin/categories" className="admin-nav-item">
                        <i className="ph ph-list-dashes" style={{ fontSize: "20px" }}></i> Quản lý Danh mục
                    </Link>
                    <Link href="/admin/slides" className="admin-nav-item">
                        <i className="ph ph-images" style={{ fontSize: "20px" }}></i> Quản lý Slider / Băng rôn
                    </Link>

                    {/* Visible to Both ADMIN and EDITOR */}
                    {(role === "ADMIN" || role === "EDITOR") && (
                        <Link href="/admin/settings" className="admin-nav-item">
                            <i className="ph ph-gear" style={{ fontSize: "20px" }}></i> Cấu hình Website
                        </Link>
                    )}

                    {role === "ADMIN" && (
                        <>
                            <Link href="/admin/languages" className="admin-nav-item">
                                <i className="ph ph-translate" style={{ fontSize: "20px" }}></i> Quản lý Ngôn ngữ
                            </Link>
                            <Link href="/admin/users" className="admin-nav-item">
                                <i className="ph ph-users" style={{ fontSize: "20px" }}></i> Quản lý Người dùng
                            </Link>
                        </>
                    )}

                    <div style={{ flex: 1 }}></div>

                    <Link href="/" className="admin-nav-item" target="_blank">
                        <i className="ph ph-arrow-square-out" style={{ fontSize: "20px" }}></i> Xem Website
                    </Link>

                    <LogoutButton />
                </nav>
            </aside>

            {/* Main Area */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: role === "ADMIN" ? "#ef4444" : "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                            {role === "ADMIN" ? "AD" : "ED"}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem", color: "#0f172a" }}>{session.user?.name || "Member"}</p>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>{session.user?.email || "Unknown"}</p>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
