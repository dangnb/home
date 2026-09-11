'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { getStoredUser, type StoredUser } from '@/lib/storage';
import {
  Trophy,
  Crown,
  Zap,
  Flame,
  Award,
  Sparkles,
  Medal,
  CheckCircle2,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import styles from './page.module.css';

interface RankedStudent {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  xp: number;
  coursesCompleted: number;
  streak: number;
  badge: string;
}

const initialLeaderboard: RankedStudent[] = [
  {
    rank: 1,
    id: 'user-top-1',
    name: 'Sơn Đặng',
    avatar: '/avatars/instructor-1.jpg',
    xp: 14850,
    coursesCompleted: 8,
    streak: 42,
    badge: 'Legendary Coder',
  },
  {
    rank: 2,
    id: 'user-top-2',
    name: 'Trần Hoàng Nam',
    avatar: '/avatars/demo-student.jpg',
    xp: 11200,
    coursesCompleted: 6,
    streak: 28,
    badge: 'Master Dev',
  },
  {
    rank: 3,
    id: 'user-top-3',
    name: 'Lê Thị Bích',
    avatar: '/avatars/demo-student.jpg',
    xp: 9450,
    coursesCompleted: 5,
    streak: 19,
    badge: 'Pro Hacker',
  },
  {
    rank: 4,
    id: 'user-top-4',
    name: 'Phạm Minh Đức',
    avatar: '/avatars/demo-admin.jpg',
    xp: 8200,
    coursesCompleted: 4,
    streak: 15,
    badge: 'Cloud Guru',
  },
  {
    rank: 5,
    id: 'user-top-5',
    name: 'Nguyễn Văn A',
    avatar: '/avatars/demo-student.jpg',
    xp: 6750,
    coursesCompleted: 3,
    streak: 7,
    badge: 'Rising Star',
  },
  {
    rank: 6,
    id: 'user-top-6',
    name: 'Vũ Quốc Khánh',
    avatar: '/avatars/demo-student.jpg',
    xp: 5900,
    coursesCompleted: 3,
    streak: 12,
    badge: 'Frontend Hero',
  },
  {
    rank: 7,
    id: 'user-top-7',
    name: 'Đặng Mai Phương',
    avatar: '/avatars/demo-student.jpg',
    xp: 5100,
    coursesCompleted: 2,
    streak: 8,
    badge: 'Code Ninja',
  },
  {
    rank: 8,
    id: 'user-top-8',
    name: 'Hoàng Anh Tuấn',
    avatar: '/avatars/demo-student.jpg',
    xp: 4300,
    coursesCompleted: 2,
    streak: 5,
    badge: 'App Builder',
  },
];

const achievementBadges = [
  { icon: '⚡', title: 'Master Coder', desc: 'Đạt trên 10,000 XP', unlocked: true },
  { icon: '🔥', title: 'Streak Master', desc: 'Duy trì chuỗi học 14 ngày', unlocked: true },
  { icon: '🏆', title: 'Quiz Champion', desc: 'Đạt 100% câu hỏi trắc nghiệm', unlocked: true },
  { icon: '🎓', title: 'Graduate Dev', desc: 'Hoàn thành 5 khóa học', unlocked: true },
  { icon: '🚀', title: 'Speed Demon', desc: 'Hoàn thành 3 bài học/ngày', unlocked: false },
  { icon: '⭐', title: 'Community Star', desc: 'Được 50 lượt thích bài viết', unlocked: false },
];

export default function LeaderboardPage() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [user, setUser] = useState<StoredUser | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'alltime'>('alltime');

  useEffect(() => {
    setLocale(getStoredLocale());
    setUser(getStoredUser());
  }, []);

  const top1 = initialLeaderboard[0];
  const top2 = initialLeaderboard[1];
  const top3 = initialLeaderboard[2];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            <Trophy size={36} style={{ color: '#f59e0b' }} />
            {t('leaderboard.title', locale)}
          </h1>
          <p className={styles.headerSubtitle}>
            {t('leaderboard.subtitle', locale)}
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className={styles.podium}>
          {/* Rank 2 */}
          <div className={`${styles.podiumCard} ${styles.rank2}`}>
            <Medal size={28} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
            <div className={styles.avatarLarge}>{top2.name.charAt(0)}</div>
            <div className={styles.podiumName}>{top2.name}</div>
            <div className={styles.podiumXP}>{top2.xp.toLocaleString()} XP</div>
            <span className="badge badge-purple" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
              #2 • {top2.badge}
            </span>
          </div>

          {/* Rank 1 */}
          <div className={`${styles.podiumCard} ${styles.rank1}`}>
            <Crown size={32} className={styles.crown} />
            <div className={styles.avatarLarge} style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
              {top1.name.charAt(0)}
            </div>
            <div className={styles.podiumName}>{top1.name}</div>
            <div className={styles.podiumXP}>{top1.xp.toLocaleString()} XP</div>
            <span className="badge badge-yellow" style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
              👑 #1 • {top1.badge}
            </span>
          </div>

          {/* Rank 3 */}
          <div className={`${styles.podiumCard} ${styles.rank3}`}>
            <Medal size={28} style={{ color: '#d97706', marginBottom: '0.5rem' }} />
            <div className={styles.avatarLarge}>{top3.name.charAt(0)}</div>
            <div className={styles.podiumName}>{top3.name}</div>
            <div className={styles.podiumXP}>{top3.xp.toLocaleString()} XP</div>
            <span className="badge badge-purple" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
              #3 • {top3.badge}
            </span>
          </div>
        </div>

        {/* Tabs for Period Toggle */}
        <div className={styles.tabs}>
          <button
            className={`btn ${period === 'alltime' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setPeriod('alltime')}
          >
            <Sparkles size={16} /> {t('leaderboard.allTime', locale)}
          </button>
          <button
            className={`btn ${period === 'weekly' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setPeriod('weekly')}
          >
            <Flame size={16} /> {t('leaderboard.weekly', locale)}
          </button>
        </div>

        {/* Main Grid: Table + Badges */}
        <div className={styles.layout}>
          {/* Ranking Table */}
          <div className={styles.card}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} style={{ color: '#c084fc' }} /> {t('leaderboard.tableTitle', locale)}
            </h2>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Học Viên</th>
                  <th>Danh Hiệu</th>
                  <th>Chuỗi Học</th>
                  <th>Tổng XP</th>
                </tr>
              </thead>
              <tbody>
                {initialLeaderboard.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <strong style={{ color: student.rank <= 3 ? '#f59e0b' : '#94a3b8' }}>
                        #{student.rank}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{student.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        {student.badge}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#fb923c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Flame size={14} /> {student.streak} ngày
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#c084fc' }}>{student.xp.toLocaleString()} XP</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Badges Section */}
          <div className={styles.card}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: '#38bdf8' }} /> Huy Hiệu Thành Tích
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Các huy hiệu được tự động trao khi bạn hoàn thành bài tập & chuỗi ngày học
            </p>

            <div className={styles.badgesGrid}>
              {achievementBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className={styles.badgeCard}
                  style={{ opacity: badge.unlocked ? 1 : 0.45 }}
                >
                  <span className={styles.badgeIcon}>{badge.icon}</span>
                  <div className={styles.badgeTitle}>{badge.title}</div>
                  <div className={styles.badgeDesc}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
