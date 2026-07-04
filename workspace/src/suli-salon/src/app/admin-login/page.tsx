"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(
    process.env.NODE_ENV === "development" ? "admin@duthuyensonghan.vn" : ""
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png" alt="Logo" />
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.sub}>Du Thuyền Sông Hàn – 2Da Tickets</p>
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
          Default: admin@duthuyensonghan.vn / admin123456 – Đổi trong <code>.env</code>
        </p>
      </div>
    </div>
  );
}
