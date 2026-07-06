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
  const [focused, setFocused] = useState<string | null>(null);

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
      {/* Background decorations */}
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow} />

      {/* Corner decorations */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      <div className={styles.card}>
        {/* Decorative top line */}
        <div className={styles.topAccent} />

        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoLabel}>ADMIN PORTAL</div>
          <h1 className={styles.logo}>Suli Salon</h1>
          <p className={styles.tagline}>Luxury Nail Gallery in Prague</p>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerIcon}>✦</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.field} ${focused === "email" ? styles.fieldFocused : ""}`}>
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="admin@sulisalon.com"
              required
              autoFocus
            />
          </div>

          <div className={`${styles.field} ${focused === "password" ? styles.fieldFocused : ""}`}>
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? (
              <span className={styles.btnLoading}>
                <span className={styles.spinner} />
                Signing in...
              </span>
            ) : (
              <span className={styles.btnContent}>
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* Hint */}
        <p className={styles.hint}>
          Default credentials for development only
        </p>
      </div>
    </div>
  );
}
