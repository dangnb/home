'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { setStoredUser, demoAccounts } from '@/lib/storage';
import { GraduationCap, Mail, Lock, Code2, Eye, EyeOff } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'admin@eduvn.com') {
        setStoredUser(demoAccounts.admin);
      } else {
        setStoredUser({
          ...demoAccounts.student,
          email: email || demoAccounts.student.email,
          name: email.split('@')[0] || demoAccounts.student.name,
        });
      }
      window.dispatchEvent(new Event('auth-change'));
      router.push('/dashboard');
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (role: 'student' | 'admin') => {
    setStoredUser(demoAccounts[role]);
    window.dispatchEvent(new Event('auth-change'));
    router.push(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={`glow-orb glow-orb-purple ${styles.orb1}`} />
      <div className={`glow-orb glow-orb-cyan ${styles.orb2}`} />

      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <GraduationCap size={28} />
          <span>
            Edu<span className={styles.logoHighlight}>VN</span>
          </span>
        </Link>

        <h1 className="heading-md">{t('auth.loginTitle', locale)}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className="input-label">{t('auth.email', locale)}</label>
            <div className={styles.inputWrap}>
              <Mail size={16} />
              <input
                type="email"
                className="input-field"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className="input-label">{t('auth.password', locale)}</label>
            <div className={styles.inputWrap}>
              <Lock size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="#" className={styles.forgotLink}>
              {t('auth.forgotPassword', locale)}
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading
              ? (locale === 'vi' ? 'Đang đăng nhập...' : 'Logging in...')
              : t('auth.loginBtn', locale)}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t('auth.orLoginWith', locale)}</span>
        </div>

        <div className={styles.socialBtns}>
          <button className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className={styles.socialBtn}>
            <Code2 size={18} />
            GitHub
          </button>
        </div>

        <div className={styles.demoSection}>
          <p className={styles.demoTitle}>
            {locale === 'vi' ? '🔑 Tài khoản demo:' : '🔑 Demo accounts:'}
          </p>
          <div className={styles.demoBtns}>
            <button className={styles.demoBtn} onClick={() => handleDemoLogin('student')}>
              👨‍🎓 Student
            </button>
            <button className={styles.demoBtn} onClick={() => handleDemoLogin('admin')}>
              🛡️ Admin
            </button>
          </div>
        </div>

        <p className={styles.switchAuth}>
          {t('auth.noAccount', locale)}{' '}
          <Link href="/register">{t('auth.registerBtn', locale)}</Link>
        </p>
      </div>
    </div>
  );
}
