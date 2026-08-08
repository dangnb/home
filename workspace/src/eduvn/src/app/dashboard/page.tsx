'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { courses, getAllLessons, formatPrice, type Course } from '@/lib/data';
import {
  getStoredUser,
  getEnrolledCourses,
  getCourseProgress,
  getCompletedLessons,
  isLoggedIn,
  type StoredUser,
} from '@/lib/storage';
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  PlayCircle,
  Award,
  ArrowRight,
} from 'lucide-react';
import styles from './page.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [user, setUser] = useState<StoredUser | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    setLocale(getStoredLocale());

    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    setUser(getStoredUser());
    const enrolledIds = getEnrolledCourses();
    const enrolled = courses.filter((c) => enrolledIds.includes(c.id));
    setEnrolledCourses(enrolled);
    setTotalCompleted(getCompletedLessons().length);
  }, [router]);

  if (!user) return null;

  const totalHours = enrolledCourses.reduce((sum, c) => sum + c.totalHours, 0);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Welcome */}
        <div className={styles.welcome}>
          <div className={styles.welcomeAvatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="heading-md">
              {t('dashboard.welcome', locale)}, {user.name}! 👋
            </h1>
            <p className={styles.welcomeSub}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <BookOpen size={24} className={styles.statIconBlue} />
            <div>
              <span className={styles.statValue}>{enrolledCourses.length}</span>
              <span className={styles.statLabel}>{t('dashboard.totalCourses', locale)}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Clock size={24} className={styles.statIconCyan} />
            <div>
              <span className={styles.statValue}>{totalHours}h</span>
              <span className={styles.statLabel}>{t('dashboard.totalHours', locale)}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Trophy size={24} className={styles.statIconGreen} />
            <div>
              <span className={styles.statValue}>{totalCompleted}</span>
              <span className={styles.statLabel}>{t('dashboard.completed', locale)}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Flame size={24} className={styles.statIconOrange} />
            <div>
              <span className={styles.statValue}>3</span>
              <span className={styles.statLabel}>{t('dashboard.streak', locale)}</span>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <section className={styles.section}>
          <h2 className="heading-md">{t('dashboard.myCourses', locale)}</h2>

          {enrolledCourses.length > 0 ? (
            <div className={styles.courseList}>
              {enrolledCourses.map((course) => {
                const lessons = getAllLessons(course);
                const progress = getCourseProgress(course.id, lessons);

                return (
                  <div key={course.id} className={styles.courseItem}>
                    <div className={styles.courseThumbnail}>
                      <span>{course.tags[0]?.charAt(0) || '📚'}</span>
                    </div>
                    <div className={styles.courseInfo}>
                      <h3>{locale === 'vi' ? course.title : course.titleEn}</h3>
                      <p>{course.instructor.name}</p>
                      <div className={styles.progressRow}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={styles.progressPercent}>{progress}%</span>
                      </div>
                    </div>
                    <Link
                      href={`/learn/${course.id}/${lessons[0]?.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <PlayCircle size={14} />
                      {t('course.continue', locale)}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.empty}>
              <BookOpen size={48} />
              <p>{t('dashboard.noCourses', locale)}</p>
              <Link href="/courses" className="btn btn-primary">
                {locale === 'vi' ? 'Khám phá khóa học' : 'Explore Courses'}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Certificates Placeholder */}
        <section className={styles.section}>
          <h2 className="heading-md">{t('dashboard.certificates', locale)}</h2>
          <div className={styles.certPlaceholder}>
            <Award size={40} />
            <p>
              {locale === 'vi'
                ? 'Hoàn thành khóa học để nhận chứng chỉ'
                : 'Complete courses to earn certificates'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
