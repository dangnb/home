"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(
    process.env.NODE_ENV === "development" ? "admin@sulisalon.com" : ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV === "development" ? "admin123456" : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res?.error ?? "Đăng nhập thất bại");
    }
    setLoading(false);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1 style={{ color: "#C2A979", fontStyle: "italic", fontFamily: "serif", fontSize: "2rem", marginBottom: "1rem" }}>
            Suli Salon
          </h1>
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.sub}>Luxury Nail Gallery in Prague</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email đăng nhập</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className={styles.error}>⚠️ {error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <p className={styles.hint}>
          Default: admin@sulisalon.com / admin123456 – Đổi trong <code>.env</code>
        </p>
      </div>
    </div>
  );
}
