'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t, getStoredLocale, setStoredLocale, type Locale } from '@/lib/i18n';
import { getStoredUser, removeStoredUser, isAdmin, type StoredUser } from '@/lib/storage';
import {
  Menu,
  X,
  GraduationCap,
  Globe,
  LogOut,
  User,
  LayoutDashboard,
  Shield,
  ChevronDown,
} from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>('vi');
  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
    setUser(getStoredUser());

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Listen for storage events (login/logout from other components)
    const handleStorage = () => {
      setUser(getStoredUser());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleStorage);
    };
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    setLocale(newLocale);
    setStoredLocale(newLocale);
    window.location.reload();
  };

  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  const navLinks = [
    { href: '/', label: t('nav.home', locale) },
    { href: '/courses', label: t('nav.courses', locale) },
  ];

  if (user) {
    navLinks.push({ href: '/dashboard', label: t('nav.dashboard', locale) });
  }
  if (user && isAdmin()) {
    navLinks.push({ href: '/admin', label: t('nav.admin', locale) });
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContent}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <GraduationCap size={28} />
          <span className={styles.logoText}>
            Edu<span className={styles.logoHighlight}>VN</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className={styles.navActions}>
          {/* Language Toggle */}
          <button
            className={styles.langToggle}
            onClick={toggleLocale}
            title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe size={18} />
            <span>{locale === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {user ? (
            /* User Menu */
            <div className={styles.userMenu}>
              <button
                className={styles.userBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user.name}</span>
                <ChevronDown size={16} className={userMenuOpen ? styles.rotated : ''} />
              </button>

              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <Link
                    href="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    {t('nav.dashboard', locale)}
                  </Link>
                  {isAdmin() && (
                    <Link
                      href="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Shield size={16} />
                      {t('nav.admin', locale)}
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    {t('nav.myAccount', locale)}
                  </Link>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <LogOut size={16} />
                    {t('nav.logout', locale)}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons */
            <div className={styles.authBtns}>
              <Link href="/login" className="btn btn-ghost btn-sm">
                {t('nav.login', locale)}
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                {t('nav.register', locale)}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className={styles.mobileAuth}>
              <Link
                href="/login"
                className="btn btn-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.login', locale)}
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.register', locale)}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
