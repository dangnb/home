"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.css";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("moc_admin_email");
      const savedPassword = localStorage.getItem("moc_admin_password");
      const savedRemember = localStorage.getItem("moc_admin_remember");
      if (savedRemember === "true" && savedEmail) {
        setEmail(savedEmail);
        if (savedPassword) {
          setPassword(savedPassword);
        }
        setRememberMe(true);
      }
    } catch {
      // Browser storage access might fail in restricted environments
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      try {
        if (rememberMe) {
          localStorage.setItem("moc_admin_email", email.trim());
          localStorage.setItem("moc_admin_password", password);
          localStorage.setItem("moc_admin_remember", "true");
        } else {
          localStorage.removeItem("moc_admin_email");
          localStorage.removeItem("moc_admin_password");
          localStorage.removeItem("moc_admin_remember");
        }
      } catch {
        // ignore storage errors
      }
      router.push("/admin");
      router.refresh();
    } else {
      const err = res?.error;
      if (!err || err === "CredentialsSignin") {
        setError("Mật khẩu không chính xác hoặc tài khoản không tồn tại. Vui lòng kiểm tra lại!");
      } else if (err === "AccessDenied") {
        setError("Tài khoản của bạn không có quyền truy cập vào cổng quản trị.");
      } else {
        setError(err);
      }
    }
    setLoading(false);
  }

  const isPasswordError = Boolean(error && (error.toLowerCase().includes("mật khẩu") || error.toLowerCase().includes("tài khoản")));
  const isEmailError = Boolean(error && (error.toLowerCase().includes("email") || error.toLowerCase().includes("tài khoản")));

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
          <div className={styles.logoLabel}>CỔNG QUẢN TRỊ</div>
          <BrandLogo className={styles.logo} />
          <p className={styles.tagline}>Nghệ thuật móng tinh tế</p>
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
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="admin@example.com"
              required
              autoComplete="username"
              autoFocus
              className={isEmailError ? styles.inputError : ""}
            />
          </div>

          <div className={`${styles.field} ${focused === "password" ? styles.fieldFocused : ""}`}>
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Mật khẩu
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className={`${styles.passwordInput} ${isPasswordError ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Ghi nhớ tài khoản & mật khẩu */}
          <div className={styles.rememberSection}>
            <label className={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className={styles.rememberCheckbox}
              />
              <span className={`${styles.customCheckmark} ${rememberMe ? styles.customCheckmarkChecked : ""}`}>
                {rememberMe && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className={styles.rememberText}>Ghi nhớ tài khoản & mật khẩu</span>
            </label>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              <svg className={styles.errorIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? (
              <span className={styles.btnLoading}>
                <span className={styles.spinner} />
                Đang đăng nhập...
              </span>
            ) : (
              <span className={styles.btnContent}>
                Đăng nhập
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
