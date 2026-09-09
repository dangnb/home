'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getCourseById, courses, type Course } from '@/lib/data';
import { getStoredUser, type StoredUser } from '@/lib/storage';
import {
  GraduationCap,
  Award,
  Printer,
  Share2,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import styles from './page.module.css';

export default function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());
    const c = getCourseById(id) || courses[0];
    setCourse(c);
  }, [id]);

  if (!mounted || !course) return null;

  const recipientName = user ? user.name : 'Nguyễn Văn A';
  const certCode = `EDUVN-2026-${course.id.toUpperCase()}-8821`;
  const issueDate = new Date().toLocaleDateString('vi-VN');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Chứng chỉ EduVN — ${course.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép đường dẫn chứng chỉ vào bộ nhớ tạm!');
    }
  };

  return (
    <div className={styles.page}>
      {/* Actions Toolbar */}
      <div className={styles.actionsBar}>
        <Link href="/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Quay lại Bảng điều khiển
        </Link>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} /> In / Tải Chứng Chỉ (PDF)
        </button>
        <button className="btn btn-ghost" onClick={handleShare}>
          <Share2 size={16} /> Chia sẻ chứng chỉ
        </button>
      </div>

      {/* Printable Certificate Frame */}
      <div className={styles.certFrame}>
        {/* Certificate Header */}
        <div className={styles.certHeader}>
          <div className={styles.brandLogo}>
            <GraduationCap size={36} style={{ color: '#6366f1' }} />
            <span>
              Edu<span className={styles.brandHighlight}>VN</span>
            </span>
          </div>

          <span className={styles.certBadge}>
            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Gold Edition Certificate
          </span>
        </div>

        {/* Certificate Title & Recipient */}
        <h1 className={styles.certTitle}>CHỨNG NHẬN HOÀN THÀNH KHIẾU NĂNG</h1>
        <p className={styles.certSub}>Chứng nhận chính thức được cấp bởi Nền tảng Học Lập Trình EduVN</p>

        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#475569' }}>
          Chứng nhận học viên:
        </p>

        <h2 className={styles.recipientName}>{recipientName}</h2>

        <p style={{ textAlign: 'center', fontSize: '1.05rem', color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Đã xuất sắc hoàn thành toàn bộ chương trình học và các bài kiểm tra thực hành của khóa học:
        </p>

        <h3 className={styles.courseName}>✨ {course.title} ✨</h3>

        {/* Certificate Footer */}
        <div className={styles.certFooter}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>MÃ XÁC THỰC CÔNG KHAI</div>
            <div className={styles.verifyCode}>{certCode}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Ngày cấp: {issueDate}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <QrCode size={48} style={{ color: '#4c1d95', margin: '0 auto 0.2rem' }} />
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Scan to Verify</div>
          </div>

          <div className={styles.signatureBox}>
            <div className={styles.signatureText}>Sơn Đặng</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>
              Sơn Đặng (Founder @ EduVN)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Đại diện Ban Giảng Vấn</div>
          </div>
        </div>
      </div>
    </div>
  );
}
