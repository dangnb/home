"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Sai thông tin đăng nhập!");
            setLoading(false);
        } else {
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", textAlign: "center", marginBottom: "30px", color: "#1e293b" }}>
                    Đăng nhập hệ thống
                </h1>

                {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: "bold", color: "#475569" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "5px" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: "bold", color: "#475569" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "12px", border: "1px solid #cbd5e1", borderRadius: "5px" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: "10px",
                            padding: "12px",
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "bold",
                            fontSize: "1.1rem"
                        }}
                    >
                        {loading
                            ? <><span className="btn-spinner"></span> Đang xử lý...</>
                            : "Đăng nhập ngay"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}
