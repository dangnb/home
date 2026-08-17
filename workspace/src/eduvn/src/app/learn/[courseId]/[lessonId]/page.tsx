'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { getCourseById, getAllLessons, type Course, type Lesson } from '@/lib/data';
import {
  markLessonComplete,
  isLessonCompleted,
  getCourseProgress,
  getLessonNotes,
  saveLessonNotes,
  isEnrolled,
  isLoggedIn,
} from '@/lib/storage';
import {
  PlayCircle,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Save,
  ArrowLeft,
} from 'lucide-react';
import styles from './page.module.css';

export default function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = use(params);
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setLocale(getStoredLocale());
    const c = getCourseById(courseId);
    if (!c) return;

    setCourse(c);
    const lessons = getAllLessons(c);
    setAllLessons(lessons);

    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      setCompleted(isLessonCompleted(lesson.id));
      setNotes(getLessonNotes(lesson.id));
      setProgress(getCourseProgress(courseId, lessons));
    }
  }, [courseId, lessonId]);

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    markLessonComplete(currentLesson.id);
    setCompleted(true);
    if (course) {
      setProgress(getCourseProgress(courseId, allLessons));
    }
  };

  const handleSaveNotes = () => {
    if (!currentLesson) return;
    saveLessonNotes(currentLesson.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.isFree || isEnrolled(courseId) || !isLoggedIn();
  };

  if (!course || !currentLesson) {
    return (
      <div className={styles.notFound}>
        <p>{locale === 'vi' ? 'Bài học không tồn tại' : 'Lesson not found'}</p>
        <Link href="/courses" className="btn btn-primary">
          <ArrowLeft size={16} />
          {locale === 'vi' ? 'Quay lại' : 'Back'}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href={`/courses/${courseId}`} className={styles.backLink}>
          <ArrowLeft size={16} />
          <span className={styles.courseTitle}>
            {locale === 'vi' ? course.title : course.titleEn}
          </span>
        </Link>

        <div className={styles.progressSection}>
          <span className={styles.progressText}>
            {t('player.courseProgress', locale)}: {progress}%
          </span>
          <div className="progress-bar" style={{ width: 200 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          className={styles.sidebarToggle}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>
      </div>

      <div className={styles.mainContent}>
        {/* Video Area */}
        <div className={styles.videoArea}>
          {/* Video Player */}
          <div className={styles.videoPlayer}>
            <div className={styles.videoPlaceholder}>
              <PlayCircle size={64} />
              <p>{locale === 'vi' ? currentLesson.title : currentLesson.titleEn}</p>
              <span>{locale === 'vi' ? 'Video demo — chưa có file video' : 'Demo video — no file available'}</span>
            </div>
          </div>

          {/* Lesson info & Controls */}
          <div className={styles.lessonInfo}>
            <div className={styles.lessonHeader}>
              <h2>{locale === 'vi' ? currentLesson.title : currentLesson.titleEn}</h2>
              <span className={styles.lessonDuration}>⏱️ {currentLesson.duration}</span>
            </div>

            <div className={styles.lessonActions}>
              <button
                className={`btn ${completed ? 'btn-ghost' : 'btn-primary'}`}
                onClick={handleMarkComplete}
                disabled={completed}
              >
                <CheckCircle size={16} />
                {completed ? t('player.completed', locale) : t('player.markComplete', locale)}
              </button>

              <div className={styles.navBtns}>
                {prevLesson && (
                  <Link
                    href={`/learn/${courseId}/${prevLesson.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronLeft size={16} />
                    {t('player.prev', locale)}
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/learn/${courseId}/${nextLesson.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    {t('player.next', locale)}
                    <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.notesSection}>
            <h3>
              <FileText size={18} />
              {t('player.notes', locale)}
            </h3>
            <textarea
              className={styles.notesTextarea}
              placeholder={t('player.notesPlaceholder', locale)}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
            <button className="btn btn-secondary btn-sm" onClick={handleSaveNotes}>
              <Save size={14} />
              {notesSaved
                ? '✓ ' + (locale === 'vi' ? 'Đã lưu!' : 'Saved!')
                : t('player.saveNotes', locale)}
            </button>
          </div>
        </div>

        {/* Sidebar — Lesson List */}
        {showSidebar && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>{t('course.curriculum', locale)}</h3>
              <span className={styles.lessonCount}>
                {allLessons.filter((l) => isLessonCompleted(l.id)).length}/{allLessons.length}
              </span>
            </div>

            <div className={styles.lessonList}>
              {course.modules.map((mod) => (
                <div key={mod.id} className={styles.moduleGroup}>
                  <div className={styles.moduleLabel}>
                    {locale === 'vi' ? mod.title : mod.titleEn}
                  </div>
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === lessonId;
                    const isDone = isLessonCompleted(lesson.id);
                    const canAccess = canAccessLesson(lesson);

                    return (
                      <Link
                        key={lesson.id}
                        href={canAccess ? `/learn/${courseId}/${lesson.id}` : '#'}
                        className={`${styles.lessonItem} ${isActive ? styles.activeLesson : ''} ${
                          !canAccess ? styles.lockedLesson : ''
                        }`}
                      >
                        <div className={styles.lessonIcon}>
                          {isDone ? (
                            <CheckCircle size={16} className={styles.doneIcon} />
                          ) : canAccess ? (
                            <PlayCircle size={16} />
                          ) : (
                            <Lock size={16} />
                          )}
                        </div>
                        <div className={styles.lessonMeta}>
                          <span className={styles.lessonName}>
                            {locale === 'vi' ? lesson.title : lesson.titleEn}
                          </span>
                          <span className={styles.lessonTime}>{lesson.duration}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
