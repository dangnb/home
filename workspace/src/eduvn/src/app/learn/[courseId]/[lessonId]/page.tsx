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
  HelpCircle,
  Award,
} from 'lucide-react';
import styles from './page.module.css';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const mockQuizzes: QuizQuestion[] = [
  {
    question: 'Trong ReactJS, Hook nào được sử dụng để quản lý state cục bộ trong Functional Component?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctIndex: 1,
    explanation: 'useState là Hook cơ bản nhất giúp lưu trữ và cập nhật trạng thái (state) bên trong Functional Component.',
  },
  {
    question: 'Toán tử nào được dùng để truyền thuộc tính (props) hoặc sao chép mảng/object trong ES6 JavaScript?',
    options: ['Spread operator (...)', 'Rest operator', 'Ternary operator', 'Optional chaining (?.)'],
    correctIndex: 0,
    explanation: 'Spread operator (...) giúp giải nén các phần tử mảng hoặc thuộc tính của object.',
  },
  {
    question: 'Next.js App Router sử dụng thư mục nào để định nghĩa các tuyến đường (routes)?',
    options: ['pages/', 'src/app/', 'public/', 'components/'],
    correctIndex: 1,
    explanation: 'Từ phiên bản Next.js 13+, App Router sử dụng thư mục app/ để định nghĩa các tuyến đường theo file-system.',
  },
];

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

  // Quiz state
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz'>('notes');
  const [quizQuestions] = useState<QuizQuestion[]>(mockQuizzes);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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

          {/* Interactive Quiz & Notes Tabs */}
          <div className={styles.notesSection} style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => setActiveTab('notes')}
              >
                <FileText size={16} />
                {t('player.notes', locale)}
              </button>
              <button
                className={`btn ${activeTab === 'quiz' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => setActiveTab('quiz')}
              >
                <HelpCircle size={16} />
                Kiểm Tra Trắc Nghiệm ({quizQuestions.length} câu)
              </button>
            </div>

            {activeTab === 'notes' ? (
              <>
                <textarea
                  className={styles.notesTextarea}
                  placeholder={t('player.notesPlaceholder', locale)}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
                <button className="btn btn-secondary btn-sm" onClick={handleSaveNotes} style={{ marginTop: '0.75rem' }}>
                  <Save size={14} />
                  {notesSaved
                    ? '✓ ' + (locale === 'vi' ? 'Đã lưu!' : 'Saved!')
                    : t('player.saveNotes', locale)}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {quizQuestions.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[qIdx];
                  const isSubmitted = quizSubmitted;
                  return (
                    <div
                      key={qIdx}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                      }}
                    >
                      <h4 style={{ color: '#ffffff', fontSize: '0.975rem', marginBottom: '0.75rem' }}>
                        Câu {qIdx + 1}: {q.question}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedOpt === oIdx;
                          const isCorrect = oIdx === q.correctIndex;
                          let btnStyle = 'rgba(255,255,255,0.04)';
                          let borderColor = 'rgba(255,255,255,0.08)';

                          if (isSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'rgba(34, 197, 94, 0.2)';
                              borderColor = 'rgba(34, 197, 94, 0.5)';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'rgba(239, 68, 68, 0.2)';
                              borderColor = 'rgba(239, 68, 68, 0.5)';
                            }
                          } else if (isSelected) {
                            btnStyle = 'rgba(168, 85, 247, 0.2)';
                            borderColor = 'rgba(168, 85, 247, 0.5)';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => !isSubmitted && setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                              style={{
                                textAlign: 'left',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                background: btnStyle,
                                border: `1px solid ${borderColor}`,
                                color: '#ffffff',
                                fontSize: '0.875rem',
                                cursor: isSubmitted ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div
                          style={{
                            marginTop: '0.75rem',
                            fontSize: '0.8125rem',
                            color: selectedOpt === q.correctIndex ? '#4ade80' : '#fca5a5',
                            fontWeight: 600,
                          }}
                        >
                          {selectedOpt === q.correctIndex
                            ? '✅ Đúng! ' + q.explanation
                            : `❌ Chưa đúng! Đáp án chuẩn là: ${String.fromCharCode(65 + q.correctIndex)}. ${q.explanation}`}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {quizSubmitted ? (
                    <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={20} /> Kết quả: {quizScore}/{quizQuestions.length} câu đúng (+{quizScore * 20} XP)
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        let score = 0;
                        quizQuestions.forEach((q, idx) => {
                          if (quizAnswers[idx] === q.correctIndex) score++;
                        });
                        setQuizScore(score);
                        setQuizSubmitted(true);
                      }}
                    >
                      Nộp Bài Trắc Nghiệm
                    </button>
                  )}
                </div>
              </div>
            )}
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
