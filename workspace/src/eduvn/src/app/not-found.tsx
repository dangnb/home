import Link from 'next/link';
import { Compass, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
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
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          <Compass size={36} />
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff' }}>404</h1>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
          Trang Bạn Tìm Kiếm Không Tồn Tại
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
          Đường dẫn này có thể đã bị thay đổi hoặc không tồn tại trên hệ thống EduVN.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} /> Về trang chủ
          </Link>
          <Link href="/courses" className="btn btn-secondary">
            <BookOpen size={16} /> Xem khóa học
          </Link>
        </div>
      </div>
    </div>
  );
}
