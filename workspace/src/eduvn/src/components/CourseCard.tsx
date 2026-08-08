'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { type Course, formatPrice } from '@/lib/data';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import styles from './CourseCard.module.css';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [locale, setLocale] = useState<Locale>('vi');

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const title = locale === 'vi' ? course.title : course.titleEn;
  const desc = locale === 'vi' ? course.description : course.descriptionEn;
  const levelText = t(`course.${course.level}`, locale);

  // Generate a gradient based on course category
  const gradientMap: Record<string, string> = {
    frontend: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    backend: 'linear-gradient(135deg, #10b981, #06b6d4)',
    mobile: 'linear-gradient(135deg, #6366f1, #ec4899)',
    devops: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    database: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    tools: 'linear-gradient(135deg, #f97316, #f59e0b)',
    language: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  };

  return (
    <Link href={`/courses/${course.id}`} className={styles.card}>
      {/* Thumbnail */}
      <div
        className={styles.thumbnail}
        style={{ background: gradientMap[course.category] || gradientMap.frontend }}
      >
        <div className={styles.thumbContent}>
          <span className={styles.thumbIcon}>
            {course.tags[0]?.charAt(0) || '📚'}
          </span>
          <span className={styles.thumbTitle}>{course.tags[0] || 'Course'}</span>
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {course.isFree && (
            <span className="badge badge-free">{t('course.free', locale)}</span>
          )}
          {!course.isFree && (
            <span className="badge badge-premium">{t('course.premium', locale)}</span>
          )}
          {course.isNew && (
            <span className="badge badge-new">{t('general.new', locale)}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{course.category}</span>
          <span className={styles.level}>{levelText}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{desc}</p>

        {/* Instructor */}
        <div className={styles.instructor}>
          <div className={styles.instructorAvatar}>
            {course.instructor.name.charAt(0)}
          </div>
          <span>{course.instructor.name}</span>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Star size={14} />
            <span>{course.rating}</span>
          </div>
          <div className={styles.stat}>
            <Users size={14} />
            <span>{course.totalStudents.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <Clock size={14} />
            <span>{course.totalHours}h</span>
          </div>
          <div className={styles.stat}>
            <BookOpen size={14} />
            <span>{course.totalLessons} {t('course.lessons', locale)}</span>
          </div>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {formatPrice(course.price, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
