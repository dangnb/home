'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { setStoredUser, demoAccounts } from '@/lib/storage';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(locale === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(locale === 'vi' ? 'Mật khẩu phải ít nhất 6 ký tự' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setStoredUser({
        id: `user-${Date.now()}`,
        name: name,
        email: email,
        role: 'student',
        avatar: '',
        joinedAt: new Date().toISOString().split('T')[0],
      });
      window.dispatchEvent(new Event('auth-change'));
      router.push('/dashboard');
      setLoading(false);
    }, 800);
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

        <h1 className="heading-md">{t('auth.registerTitle', locale)}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className="input-label">{t('auth.fullName', locale)}</label>
            <div className={styles.inputWrap}>
              <User size={16} />
              <input
                type="text"
                placeholder={locale === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className="input-label">{t('auth.email', locale)}</label>
            <div className={styles.inputWrap}>
              <Mail size={16} />
              <input
                type="email"
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

          <div className={styles.field}>
            <label className="input-label">{t('auth.confirmPassword', locale)}</label>
            <div className={styles.inputWrap}>
              <Lock size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading
              ? (locale === 'vi' ? 'Đang tạo tài khoản...' : 'Creating account...')
              : t('auth.registerBtn', locale)}
          </button>
        </form>

        <p className={styles.switchAuth}>
          {t('auth.hasAccount', locale)}{' '}
          <Link href="/login">{t('auth.loginBtn', locale)}</Link>
        </p>
      </div>
    </div>
  );
}
