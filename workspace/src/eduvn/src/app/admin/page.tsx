'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { courses as initialCourses, formatPrice, type Course, type Lesson, type Module } from '@/lib/data';
import {
  getStoredUser,
  isLoggedIn,
  isAdmin,
  getUploadedVideos,
  addUploadedVideo,
  removeUploadedVideo,
  getStorageUsage,
  getAdminUsers,
  saveAdminUsers,
  type UploadedVideo,
  type AdminUserItem,
} from '@/lib/storage';
import { validateVideoFile, sanitizeInput, checkRateLimit } from '@/lib/security';
import {
  LayoutDashboard,
  Upload,
  BookOpen,
  Users,
  Video,
  HardDrive,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  CheckCircle2,
  FileVideo,
  Sparkles,
  PlayCircle,
  FolderPlus,
} from 'lucide-react';
import styles from './page.module.css';

type TabType = 'overview' | 'videos' | 'courses' | 'users';

export default function AdminPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mounted, setMounted] = useState(false);

  // Stats & Data state
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, keys: 0 });
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal state for Add/Edit course
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // User state
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Upload simulation state for Tab 2
  const [targetCourseId, setTargetCourseId] = useState<string>(initialCourses[0]?.id || '');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10:00');
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lesson Direct Video Upload in Modal state
  const lessonFileInputRef = useRef<HTMLInputElement>(null);
  const [activeLessonIdForUpload, setActiveLessonIdForUpload] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    if (!isLoggedIn() || !isAdmin()) {
      router.push(isLoggedIn() ? '/dashboard' : '/login');
      return;
    }

    setUploadedVideos(getUploadedVideos());
    setStorageInfo(getStorageUsage());
    setUsersList(getAdminUsers());
  }, [router]);

  if (!mounted || !isAdmin()) return null;

  // ========== TAB 2: UPLOAD VIDEO HANDLERS ==========
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUploadVideo(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUploadVideo(e.dataTransfer.files[0]);
    }
  };

  const simulateUploadVideo = (file: File) => {
    // Security check: validate file type and size
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      alert(`⚠️ Không thể tải file lên: ${validation.error}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccessMsg('');

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          const videoUrl = `/videos/${file.name || 'sample-lesson.mp4'}`;
          const newVideo: UploadedVideo = {
            id: `vid-${Date.now()}`,
            name: file.name,
            size: file.size || Math.floor(Math.random() * 50000000) + 10000000,
            type: file.type || 'video/mp4',
            url: videoUrl,
            uploadedAt: new Date().toLocaleDateString('vi-VN'),
            courseId: targetCourseId,
          };
          addUploadedVideo(newVideo);
          setUploadedVideos(getUploadedVideos());
          setStorageInfo(getStorageUsage());

          // If target course selected, append new lesson directly into that course!
          if (targetCourseId) {
            const courseToUpdate = courseList.find((c) => c.id === targetCourseId);
            if (courseToUpdate) {
              const newLesson: Lesson = {
                id: `les-${Date.now()}`,
                title: lessonTitle.trim() || `Bài học: ${file.name.replace(/\.[^/.]+$/, '')}`,
                titleEn: lessonTitle.trim() || `Lesson: ${file.name.replace(/\.[^/.]+$/, '')}`,
                duration: lessonDuration || '12:00',
                isFree: lessonIsFree,
                videoUrl: videoUrl,
                order: (courseToUpdate.totalLessons || 0) + 1,
              };

              const updatedModules = [...courseToUpdate.modules];
              if (updatedModules.length === 0) {
                updatedModules.push({
                  id: `mod-${Date.now()}`,
                  title: 'Chương 1: Bài học mới',
                  titleEn: 'Chapter 1: New Lessons',
                  lessons: [newLesson],
                });
              } else {
                updatedModules[0] = {
                  ...updatedModules[0],
                  lessons: [...updatedModules[0].lessons, newLesson],
                };
              }

              const updatedCourses = courseList.map((c) =>
                c.id === targetCourseId
                  ? {
                      ...c,
                      totalLessons: c.totalLessons + 1,
                      modules: updatedModules,
                    }
                  : c
              );
              setCourseList(updatedCourses);
              setUploadSuccessMsg(
                `Đã tải lên video "${file.name}" và gán thành công vào khóa học "${courseToUpdate.title}"!`
              );
            }
          } else {
            setUploadSuccessMsg(`Tải lên video "${file.name}" thành công!`);
          }

          setIsUploading(false);
          setLessonTitle('');
        }, 400);
      }
      setUploadProgress(current);
    }, 200);
  };

  const handleDeleteVideo = (id: string) => {
    removeUploadedVideo(id);
    setUploadedVideos(getUploadedVideos());
    setStorageInfo(getStorageUsage());
  };

  // ========== COURSE MODAL LESSON HANDLERS ==========
  const handleAddEmptyLessonToModal = () => {
    if (!editingCourse) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `Bài ${((editingCourse.modules?.[0]?.lessons?.length || 0) + 1)}: Tên bài học mới`,
      titleEn: `Lesson ${((editingCourse.modules?.[0]?.lessons?.length || 0) + 1)}: New Lesson Title`,
      duration: '10:00',
      isFree: false,
      videoUrl: '/videos/sample-lesson.mp4',
      order: (editingCourse.modules?.[0]?.lessons?.length || 0) + 1,
    };

    const modules = [...(editingCourse.modules || [])];
    if (modules.length === 0) {
      modules.push({
        id: `mod-${Date.now()}`,
        title: 'Chương 1: Nội dung chính',
        titleEn: 'Chapter 1: Main Content',
        lessons: [newLesson],
      });
    } else {
      modules[0] = {
        ...modules[0],
        lessons: [...modules[0].lessons, newLesson],
      };
    }

    setEditingCourse({
      ...editingCourse,
      totalLessons: (editingCourse.totalLessons || 0) + 1,
      modules,
    });
  };

  const handleLessonVideoUploadSelect = (lessonId: string) => {
    setActiveLessonIdForUpload(lessonId);
    lessonFileInputRef.current?.click();
  };

  const handleLessonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeLessonIdForUpload || !editingCourse) return;

    const file = files[0];
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      alert(`⚠️ Không thể tải file lên: ${validation.error}`);
      return;
    }

    const videoUrl = `/videos/${file.name}`;

    // Add to storage
    const newVideo: UploadedVideo = {
      id: `vid-${Date.now()}`,
      name: file.name,
      size: file.size || 25000000,
      type: file.type || 'video/mp4',
      url: videoUrl,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
      courseId: editingCourse.id,
      lessonId: activeLessonIdForUpload,
    };
    addUploadedVideo(newVideo);
    setUploadedVideos(getUploadedVideos());
    setStorageInfo(getStorageUsage());

    // Update lesson's videoUrl in state
    const modules = (editingCourse.modules || []).map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((les) =>
        les.id === activeLessonIdForUpload
          ? { ...les, videoUrl: videoUrl, title: les.title || file.name.replace(/\.[^/.]+$/, '') }
          : les
      ),
    }));

    setEditingCourse({
      ...editingCourse,
      modules,
    });

    setActiveLessonIdForUpload(null);
    if (lessonFileInputRef.current) lessonFileInputRef.current.value = '';
    alert(`Đã tải lên và gán video "${file.name}" cho bài học!`);
  };

  // ========== COURSE MANAGEMENT HANDLERS ==========
  const handleOpenAddCourse = () => {
    setEditingCourse({
      id: `course-${Date.now()}`,
      title: '',
      titleEn: '',
      category: 'frontend',
      level: 'beginner',
      price: 0,
      isFree: true,
      description: '',
      descriptionEn: '',
      instructor: {
        id: 'inst-1',
        name: 'Sơn Đặng',
        avatar: '/avatars/instructor-1.jpg',
        title: 'Senior Developer',
        bio: '',
        courses: 5,
        students: 12000,
      },
      totalHours: 10,
      totalLessons: 1,
      rating: 5.0,
      totalStudents: 0,
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Chương 1: Giới thiệu & Căn bản',
          titleEn: 'Chapter 1: Introduction & Basics',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: 'Bài 1: Giới thiệu khóa học',
              titleEn: 'Lesson 1: Course Introduction',
              duration: '08:30',
              isFree: true,
              videoUrl: '/videos/sample-lesson.mp4',
              order: 1,
            },
          ],
        },
      ],
      reviews: [],
      tags: ['Mới'],
    });
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(JSON.parse(JSON.stringify(course))); // deep copy
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title) return;

    const exists = courseList.some((c) => c.id === editingCourse.id);
    let updated: Course[];

    if (exists) {
      updated = courseList.map((c) =>
        c.id === editingCourse.id ? ({ ...c, ...editingCourse } as Course) : c
      );
    } else {
      updated = [editingCourse as Course, ...courseList];
    }

    setCourseList(updated);
    setShowCourseModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm(locale === 'vi' ? 'Bạn có chắc chắn muốn xóa khóa học này?' : 'Are you sure you want to delete this course?')) {
      setCourseList(courseList.filter((c) => c.id !== id));
    }
  };

  // ========== USER MANAGEMENT HANDLERS ==========
  const handleToggleUserRole = (userId: string) => {
    const updated = usersList.map((u) => {
      if (u.id === userId) {
        const nextRole: 'student' | 'admin' = u.role === 'admin' ? 'student' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    });
    setUsersList(updated);
    saveAdminUsers(updated);
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = usersList.map((u) => {
      if (u.id === userId) {
        const nextStatus: 'active' | 'blocked' = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsersList(updated);
    saveAdminUsers(updated);
  };

  // Filtered lists
  const filteredCourses = courseList.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Storage byte formatted
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.page}>
      <div className={`glow-orb glow-orb-purple ${styles.orb1}`} />
      <div className={`glow-orb glow-orb-cyan ${styles.orb2}`} />

      {/* Hidden file input for lesson direct upload */}
      <input
        type="file"
        accept="video/*"
        ref={lessonFileInputRef}
        style={{ display: 'none' }}
        onChange={handleLessonFileChange}
      />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              <LayoutDashboard size={30} style={{ color: '#c084fc' }} />
              {t('admin.title', locale)}
            </h1>
            <p className={styles.headerSubtitle}>
              {locale === 'vi'
                ? 'Quản lý khóa học, upload video bài học & học viên hệ thống EduVN'
                : 'Manage courses, upload lesson videos & system students'}
            </p>
          </div>
          <span className={styles.badgeAdmin}>
            <ShieldCheck size={16} /> Admin Mode
          </span>
        </div>

        {/* Layout Grid */}
        <div className={styles.layout}>
          {/* Sidebar Nav */}
          <aside className={styles.sidebar}>
            <button
              className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className={styles.navIcon}><TrendingUp size={18} /></span>
              {t('admin.overview', locale)}
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'videos' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <span className={styles.navIcon}><Upload size={18} /></span>
              {t('admin.uploadVideo', locale)}
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'courses' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className={styles.navIcon}><BookOpen size={18} /></span>
              {t('admin.manageCourses', locale)}
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'users' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className={styles.navIcon}><Users size={18} /></span>
              {t('admin.manageUsers', locale)}
            </button>
          </aside>

          {/* Main Area */}
          <main className={styles.main}>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.iconPurple}`}>
                      <Users size={24} />
                    </div>
                    <div>
                      <span className={styles.statValue}>1,248</span>
                      <span className={styles.statLabel}>{t('admin.totalUsers', locale)}</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.iconGreen}`}>
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <span className={styles.statValue}>145.500.000đ</span>
                      <span className={styles.statLabel}>{t('admin.revenue', locale)}</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.iconCyan}`}>
                      <Eye size={24} />
                    </div>
                    <div>
                      <span className={styles.statValue}>45,210</span>
                      <span className={styles.statLabel}>{t('admin.totalViews', locale)}</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIconWrap} ${styles.iconOrange}`}>
                      <HardDrive size={24} />
                    </div>
                    <div>
                      <span className={styles.statValue}>{formatBytes(storageInfo.used)}</span>
                      <span className={styles.statLabel}>Storage Usage</span>
                    </div>
                  </div>
                </div>

                {/* Storage usage bar */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <HardDrive size={20} style={{ color: '#a855f7' }} />
                      Hạ Tầng Lưu Trữ Video (Local Storage Cache)
                    </h2>
                    <span className={styles.videoMeta}>{storageInfo.keys} key(s) stored</span>
                  </div>
                  <div className={styles.storageInfo}>
                    <div className={styles.storageHeader}>
                      <span>Đã dùng: {formatBytes(storageInfo.used)} / 10MB Limit</span>
                      <span>{Math.min(100, Math.round((storageInfo.used / (10 * 1024 * 1024)) * 100))}%</span>
                    </div>
                    <div className={styles.storageBar}>
                      <div
                        className={styles.storageFill}
                        style={{
                          width: `${Math.min(100, Math.max(5, Math.round((storageInfo.used / (10 * 1024 * 1024)) * 100)))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chart Activity Simulated */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <Sparkles size={20} style={{ color: '#38bdf8' }} />
                      {locale === 'vi' ? 'Biểu Đồ Tăng Trưởng Học Viên 2026' : 'Student Growth Chart 2026'}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '140px', paddingTop: '1rem' }}>
                    {[
                      { month: 'T1', val: 40 },
                      { month: 'T2', val: 55 },
                      { month: 'T3', val: 70 },
                      { month: 'T4', val: 65 },
                      { month: 'T5', val: 85 },
                      { month: 'T6', val: 100 },
                      { month: 'T7', val: 90 },
                      { month: 'T8', val: 120 },
                    ].map((item, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${item.val}px`,
                            background: 'linear-gradient(180deg, #a855f7, #6366f1)',
                            borderRadius: '6px',
                            transition: 'height 0.4s ease',
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: UPLOAD VIDEO KHÓA HỌC */}
            {activeTab === 'videos' && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <Video size={20} style={{ color: '#c084fc' }} />
                    Tải Lên Video & Gán Vào Khóa Học
                  </h2>
                </div>

                {/* Attach to course controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <label className="input-label">Chọn khóa học đích:</label>
                    <select
                      className="input-field"
                      value={targetCourseId}
                      onChange={(e) => setTargetCourseId(e.target.value)}
                    >
                      {courseList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.totalLessons} bài)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Tên bài học (tùy chọn):</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ví dụ: Bài 5: Xử lý State với Hooks"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Thời lượng (phút:giây):</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="12:30"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <input
                      type="checkbox"
                      id="freeCheck"
                      checked={lessonIsFree}
                      onChange={(e) => setLessonIsFree(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="freeCheck" style={{ fontSize: '0.9rem', color: '#e2e8f0', cursor: 'pointer' }}>
                      Cho phép xem thử miễn phí
                    </label>
                  </div>
                </div>

                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                <div
                  className={styles.dropzone}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={styles.dropzoneIcon}>
                    <Upload size={28} />
                  </div>
                  <p className={styles.dropzoneText}>Nhấn vào đây hoặc Kéo thả video vào để tải lên</p>
                  <p className={styles.dropzoneSub}>Hỗ trợ MP4, WebM, AVI (Tự động gán vào khóa học đã chọn)</p>
                </div>

                {/* Progress */}
                {isUploading && (
                  <div className={styles.uploadProgress}>
                    <div className={styles.uploadInfo}>
                      <span>Đang tải lên video bài học...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Success alert */}
                {uploadSuccessMsg && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    {uploadSuccessMsg}
                  </div>
                )}

                {/* Uploaded List */}
                <h3 style={{ marginTop: '2rem', fontSize: '1.05rem', fontWeight: 600 }}>
                  Danh Sách Video Khóa Học Đã Upload ({uploadedVideos.length})
                </h3>

                <div className={styles.videoGrid}>
                  {uploadedVideos.length > 0 ? (
                    uploadedVideos.map((vid) => {
                      const linkedCourse = courseList.find((c) => c.id === vid.courseId);
                      return (
                        <div key={vid.id} className={styles.videoItem}>
                          <div>
                            <div className={styles.videoTitle}>
                              <FileVideo size={20} style={{ color: '#38bdf8' }} />
                              {vid.name}
                            </div>
                            {linkedCourse && (
                              <div style={{ fontSize: '0.78rem', color: '#c084fc', marginTop: '0.2rem' }}>
                                📚 Khóa học: {linkedCourse.title}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className={styles.videoMeta}>{formatBytes(vid.size)}</span>
                            <span className={styles.videoMeta}>{vid.uploadedAt}</span>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteVideo(vid.id)}
                              style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Chưa có video nào được upload.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: COURSE MANAGEMENT */}
            {activeTab === 'courses' && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <BookOpen size={20} style={{ color: '#a855f7' }} />
                    Quản Lý Khóa Học & Video ({courseList.length})
                  </h2>
                  <button className="btn btn-primary btn-sm" onClick={handleOpenAddCourse}>
                    <Plus size={16} /> Thêm khóa học mới
                  </button>
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                  <div className={styles.searchInput}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('courses.search', locale)}
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="input-field"
                    style={{ width: '180px' }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Mobile</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>

                {/* Courses Table */}
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Khóa Học</th>
                        <th>Danh Mục</th>
                        <th>Giảng Viên</th>
                        <th>Giá</th>
                        <th>Số Bài Học</th>
                        <th>Thao Tác Quản Lý</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <strong style={{ color: '#ffffff' }}>
                              {locale === 'vi' ? course.title : course.titleEn}
                            </strong>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Cấp độ: {course.level}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-purple">{course.category}</span>
                          </td>
                          <td>{course.instructor.name}</td>
                          <td>
                            {course.isFree ? (
                              <span style={{ color: '#4ade80', fontWeight: 600 }}>Miễn phí</span>
                            ) : (
                              formatPrice(course.price, locale)
                            )}
                          </td>
                          <td>{course.totalLessons} bài</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenEditCourse(course)}
                                title="Sửa thông tin & Upload video bài học"
                              >
                                <Edit2 size={14} /> Sửa & Video
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteCourse(course.id)}
                                style={{ color: '#ef4444' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <Users size={20} style={{ color: '#38bdf8' }} />
                    Quản Lý Người Dùng ({usersList.length})
                  </h2>
                </div>

                <div className={styles.toolbar}>
                  <div className={styles.searchInput}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Học Viên</th>
                        <th>Email</th>
                        <th>Vai Trò</th>
                        <th>Ngày Tham Gia</th>
                        <th>Trạng Thái</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong style={{ color: '#ffffff' }}>{u.name}</strong>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span
                              className={`${styles.badgeRole} ${
                                u.role === 'admin' ? styles.roleAdmin : styles.roleStudent
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>{u.joinedAt}</td>
                          <td>
                            <span
                              className={`${styles.badgeStatus} ${
                                u.status === 'active' ? styles.statusActive : styles.statusBlocked
                              }`}
                            >
                              {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                title="Đổi quyền Admin / Student"
                                onClick={() => handleToggleUserRole(u.id)}
                              >
                                <UserCheck size={14} />
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                title="Khóa / Mở tài khoản"
                                onClick={() => handleToggleUserStatus(u.id)}
                                style={{ color: u.status === 'active' ? '#ef4444' : '#4ade80' }}
                              >
                                <UserX size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* EDIT / CREATE COURSE & LESSON VIDEO MODAL */}
      {showCourseModal && editingCourse && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal} style={{ maxWidth: '780px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {courseList.some((c) => c.id === editingCourse.id)
                  ? 'Chỉnh Sửa Khóa Học & Video Bài Học'
                  : 'Thêm Khóa Học Mới & Upload Video'}
              </h3>
              <button className={styles.closeBtn} onClick={() => setShowCourseModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <label className="input-label">Tên khóa học (Tiếng Việt)</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.fullWidth}>
                <label className="input-label">Tên khóa học (Tiếng Anh)</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingCourse.titleEn || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, titleEn: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Danh mục</label>
                <select
                  className="input-field"
                  value={editingCourse.category || 'frontend'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="mobile">Mobile</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>

              <div>
                <label className="input-label">Cấp độ</label>
                <select
                  className="input-field"
                  value={editingCourse.level || 'beginner'}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                    })
                  }
                >
                  <option value="beginner">Cơ bản (Beginner)</option>
                  <option value="intermediate">Trung cấp (Intermediate)</option>
                  <option value="advanced">Nâng cao (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Tên giảng viên</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingCourse.instructor?.name || ''}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      instructor: { ...editingCourse.instructor!, name: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="input-label">Giá (VND)</label>
                <input
                  type="number"
                  className="input-field"
                  value={editingCourse.price || 0}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setEditingCourse({
                      ...editingCourse,
                      price,
                      isFree: price === 0,
                    });
                  }}
                />
              </div>

              {/* LESSON & VIDEO UPLOAD SECTION IN MODAL */}
              <div className={styles.fullWidth} style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ color: '#c084fc', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={18} /> Danh Sách Bài Học & Upload Video
                  </h4>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddEmptyLessonToModal}
                  >
                    <Plus size={14} /> Thêm bài học mới
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {editingCourse.modules?.flatMap((m) => m.lessons).map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {idx + 1}. {lesson.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Thời lượng: {lesson.duration} | {lesson.isFree ? 'Miễn phí' : 'Trả phí'} | Video: {lesson.videoUrl}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleLessonVideoUploadSelect(lesson.id)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <Upload size={14} /> Upload Video
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCourseModal(false)}
                >
                  {t('general.cancel', locale)}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('general.save', locale)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
