'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error('EduVN Application Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
          Đã Xảy Ra Lỗi Hệ Thống
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
          Rất tiếc, có trục trặc nhỏ ngoài ý muốn khi tải trang này. Hệ thống bảo vệ EduVN đã tự động cô lập lỗi để bảo vệ dữ liệu của bạn.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => reset()}>
            <RefreshCw size={16} /> Thử lại
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={16} /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
