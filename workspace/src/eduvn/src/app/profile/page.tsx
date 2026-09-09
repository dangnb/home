'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStoredUser, isLoggedIn, type StoredUser } from '@/lib/storage';
import { sanitizeInput } from '@/lib/security';
import {
  User,
  ShieldCheck,
  Code2,
  Award,
  Save,
  Key,
  Globe,
  Github,
  Linkedin,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import styles from './page.module.css';

const availableSkills = ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'Docker', 'SQL', 'Git'];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'skills'>('info');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('Đang trên hành trình trở thành Fullstack Developer xuất sắc!');
  const [githubUrl, setGithubUrl] = useState('https://github.com');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com');
  const [userSkills, setUserSkills] = useState<string[]>(['React.js', 'TypeScript', 'Node.js']);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    const u = getStoredUser();
    if (u) {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
    }
  }, [router]);

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(name);
    const cleanBio = sanitizeInput(bio);

    const updatedUser = { ...user, name: cleanName };
    localStorage.setItem('eduvn_user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setSuccessMsg('Đã cập nhật thông tin cá nhân thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMsg('Đã đổi mật khẩu tài khoản thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleSkill = (skill: string) => {
    setUserSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            <User size={32} style={{ color: '#c084fc' }} />
            Hồ Sơ Cá Nhân & Cài Đặt Tài Khoản
          </h1>
          <p className={styles.headerSubtitle}>
            Quản lý thông tin cá nhân, danh mục kỹ năng lập trình và cài đặt bảo mật tài khoản EduVN
          </p>
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Sidebar User Card */}
          <aside className={styles.profileCard}>
            <div className={styles.avatarBox}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
              <span className="badge badge-purple" style={{ marginTop: '0.4rem' }}>
                {user.role === 'admin' ? '🔥 System Administrator' : '🎓 Student Member'}
              </span>
            </div>

            {/* Quick Stats */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>14,850</div>
                <div className={styles.statLabel}>Tổng XP</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue} style={{ color: '#fb923c', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Flame size={14} /> 42
                </div>
                <div className={styles.statLabel}>Chuỗi ngày</div>
              </div>
            </div>
          </aside>

          {/* Main Card */}
          <main className={styles.mainCard}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'info' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <User size={16} /> Thông Tin Cá Nhân
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'skills' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                <Code2 size={16} /> Kỹ Năng Lập Trình ({userSkills.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'security' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <ShieldCheck size={16} /> Bảo Mật & Mật Khẩu
              </button>
            </div>

            {/* Success Message Alert */}
            {successMsg && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#4ade80',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={18} /> {successMsg}
              </div>
            )}

            {/* Tab 1: Info */}
            {activeTab === 'info' && (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Họ và Tên</label>
                    <input
                      type="text"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email tài khoản</label>
                    <input type="email" className="input-field" value={email} disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Giới thiệu bản thân (Bio)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="input-field"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="input-field"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Lưu Thay Đổi
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Skills */}
            {activeTab === 'skills' && (
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  Chọn các Kỹ Năng & Ngôn Ngữ Bạn Đang Học Hoặc Sử Dụng:
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Nhấp vào thẻ để bật/tắt kỹ năng trên trang hồ sơ cá nhân của bạn
                </p>

                <div className={styles.skillsWrap}>
                  {availableSkills.map((skill) => {
                    const isSelected = userSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        className={`tag-pill ${isSelected ? 'tag-pill-active' : ''}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {isSelected ? '✓ ' : '+ '} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Security */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="input-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className="input-group">
                    <label className="input-label">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Ít nhất 6 ký tự"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <Key size={16} /> Đổi Mật Khẩu
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
