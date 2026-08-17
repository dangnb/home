'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { GraduationCap, Code2, ExternalLink, Globe2, Mail, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const [locale, setLocale] = useState<Locale>('vi');

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <GraduationCap size={24} />
            <span>
              Edu<span className={styles.logoHighlight}>VN</span>
            </span>
          </Link>
          <p className={styles.brandDesc}>{t('footer.aboutText', locale)}</p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink} aria-label="GitHub"><Code2 size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Twitter"><ExternalLink size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="YouTube"><Globe2 size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h4>{t('footer.quickLinks', locale)}</h4>
          <Link href="/">{t('nav.home', locale)}</Link>
          <Link href="/courses">{t('nav.courses', locale)}</Link>
          <Link href="/dashboard">{t('nav.dashboard', locale)}</Link>
        </div>

        {/* Support */}
        <div className={styles.column}>
          <h4>{t('footer.support', locale)}</h4>
          <Link href="#">{t('footer.faq', locale)}</Link>
          <Link href="#">{t('footer.contact', locale)}</Link>
          <Link href="#">{t('footer.privacy', locale)}</Link>
          <Link href="#">{t('footer.terms', locale)}</Link>
        </div>

        {/* Contact */}
        <div className={styles.column}>
          <h4>{t('footer.contact', locale)}</h4>
          <p>contact@eduvn.com</p>
          <p>Ho Chi Minh City, Vietnam</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>
            {t('footer.copyright', locale)} Made with{' '}
            <Heart size={14} className={styles.heart} /> by EduVN Team
          </p>
        </div>
      </div>
    </footer>
  );
}
