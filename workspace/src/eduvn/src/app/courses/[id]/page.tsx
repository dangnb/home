'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { getCourseById, getAllLessons, formatPrice, type Course } from '@/lib/data';
import { enrollCourse, isEnrolled, isLoggedIn } from '@/lib/storage';
import {
  Star,
  Clock,
  Users,
  BookOpen,
  PlayCircle,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Award,
  BarChart3,
} from 'lucide-react';
import styles from './page.module.css';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLocale(getStoredLocale());
    const c = getCourseById(id);
    if (c) {
      setCourse(c);
      setEnrolled(isEnrolled(id));
      // Expand first module by default
      if (c.modules.length > 0) {
        setExpandedModules(new Set([c.modules[0].id]));
      }
    }
  }, [id]);

  const handleEnroll = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    enrollCourse(id);
    setEnrolled(true);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (!course) {
    return (
      <div className={styles.notFound}>
        <p>{locale === 'vi' ? 'Khóa học không tồn tại' : 'Course not found'}</p>
        <Link href="/courses" className="btn btn-primary">
          <ArrowLeft size={16} />
          {t('featured.viewAll', locale)}
        </Link>
      </div>
    );
  }

  const title = locale === 'vi' ? course.title : course.titleEn;
  const desc = locale === 'vi' ? course.description : course.descriptionEn;
  const allLessons = getAllLessons(course);
  const freeLessons = allLessons.filter((l) => l.isFree).length;

  const levelMap: Record<string, string> = {
    beginner: locale === 'vi' ? 'Cơ bản' : 'Beginner',
    intermediate: locale === 'vi' ? 'Trung cấp' : 'Intermediate',
    advanced: locale === 'vi' ? 'Nâng cao' : 'Advanced',
  };

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.banner}>
        <div className={`glow-orb glow-orb-purple ${styles.bannerOrb1}`} />
        <div className={`glow-orb glow-orb-cyan ${styles.bannerOrb2}`} />

        <div className={`container ${styles.bannerContent}`}>
          <Link href="/courses" className={styles.backLink}>
            <ArrowLeft size={16} />
            {locale === 'vi' ? 'Quay lại' : 'Back'}
          </Link>

          <div className={styles.bannerMeta}>
            <span className={styles.bannerCategory}>{course.category}</span>
            <span className={`badge ${course.isFree ? 'badge-free' : 'badge-premium'}`}>
              {course.isFree ? t('course.free', locale) : t('course.premium', locale)}
            </span>
            {course.isNew && <span className="badge badge-new">{t('general.new', locale)}</span>}
          </div>

          <h1 className="heading-lg">{title}</h1>
          <p className={styles.bannerDesc}>{desc}</p>

          <div className={styles.bannerStats}>
            <div className={styles.bannerStat}>
              <Star size={16} fill="var(--accent-tertiary)" color="var(--accent-tertiary)" />
              <strong>{course.rating}</strong>
              <span>({course.reviews.length} {t('course.reviews', locale)})</span>
            </div>
            <div className={styles.bannerStat}>
              <Users size={16} />
              <span>{course.totalStudents.toLocaleString()} {t('course.students', locale)}</span>
            </div>
            <div className={styles.bannerStat}>
              <Clock size={16} />
              <span>{course.totalHours} {t('course.hours', locale)}</span>
            </div>
            <div className={styles.bannerStat}>
              <BookOpen size={16} />
              <span>{course.totalLessons} {t('course.lessons', locale)}</span>
            </div>
          </div>

          <div className={styles.instructorInfo}>
            <div className={styles.instructorAvatar}>{course.instructor.name.charAt(0)}</div>
            <div>
              <span className={styles.instructorLabel}>{t('course.instructor', locale)}</span>
              <strong>{course.instructor.name}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={`container ${styles.main}`}>
        {/* Left Content */}
        <div className={styles.content}>
          {/* What You'll Learn */}
          <div className={styles.section}>
            <h2 className="heading-md">{t('course.whatYouLearn', locale)}</h2>
            <div className={styles.learnGrid}>
              {(locale === 'vi' ? course.whatYouLearn : course.whatYouLearnEn).map((item, i) => (
                <div key={i} className={styles.learnItem}>
                  <CheckCircle size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className={styles.section}>
            <h2 className="heading-md">{t('course.curriculum', locale)}</h2>
            <p className={styles.curriculumMeta}>
              {course.modules.length} {locale === 'vi' ? 'chương' : 'modules'} •{' '}
              {allLessons.length} {t('course.lessons', locale)} •{' '}
              {freeLessons} {locale === 'vi' ? 'bài miễn phí' : 'free lessons'}
            </p>

            <div className={styles.modules}>
              {course.modules.map((mod) => (
                <div key={mod.id} className={styles.module}>
                  <button
                    className={styles.moduleHeader}
                    onClick={() => toggleModule(mod.id)}
                  >
                    <div className={styles.moduleTitle}>
                      <h3>{locale === 'vi' ? mod.title : mod.titleEn}</h3>
                      <span className={styles.moduleCount}>
                        {mod.lessons.length} {t('course.lessons', locale)}
                      </span>
                    </div>
                    {expandedModules.has(mod.id) ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {expandedModules.has(mod.id) && (
                    <div className={styles.lessons}>
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.id} className={styles.lesson}>
                          <div className={styles.lessonLeft}>
                            {lesson.isFree || enrolled ? (
                              <PlayCircle size={16} className={styles.playIcon} />
                            ) : (
                              <Lock size={16} className={styles.lockIcon} />
                            )}
                            <span className={styles.lessonTitle}>
                              {locale === 'vi' ? lesson.title : lesson.titleEn}
                            </span>
                            {lesson.isFree && (
                              <span className={styles.freeTag}>
                                {t('course.free', locale)}
                              </span>
                            )}
                          </div>
                          <span className={styles.lessonDuration}>{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className={styles.section}>
            <h2 className="heading-md">{t('course.reviews', locale)}</h2>
            <div className={styles.reviewsList}>
              {course.reviews.map((review) => (
                <div key={review.id} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>{review.userName.charAt(0)}</div>
                    <div>
                      <strong>{review.userName}</strong>
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <div className={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="var(--accent-tertiary)" color="var(--accent-tertiary)" />
                    ))}
                  </div>
                  <p>{locale === 'vi' ? review.comment : review.commentEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.price}>
              {formatPrice(course.price, locale)}
            </div>

            {enrolled ? (
              <Link
                href={`/learn/${course.id}/${allLessons[0]?.id}`}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <PlayCircle size={18} />
                {t('course.continue', locale)}
              </Link>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handleEnroll}
              >
                {t('course.enroll', locale)}
              </button>
            )}

            <div className={styles.sidebarInfo}>
              <div className={styles.infoItem}>
                <Clock size={16} />
                <span>{course.totalHours} {t('course.hours', locale)}</span>
              </div>
              <div className={styles.infoItem}>
                <BookOpen size={16} />
                <span>{course.totalLessons} {t('course.lessons', locale)}</span>
              </div>
              <div className={styles.infoItem}>
                <BarChart3 size={16} />
                <span>{levelMap[course.level]}</span>
              </div>
              <div className={styles.infoItem}>
                <Award size={16} />
                <span>{locale === 'vi' ? 'Chứng chỉ hoàn thành' : 'Certificate of completion'}</span>
              </div>
            </div>

            {/* Tags */}
            <div className={styles.tags}>
              {course.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
