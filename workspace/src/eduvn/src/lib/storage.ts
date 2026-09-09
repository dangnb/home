// EduVN — Storage Utilities
// LocalStorage helpers for auth, progress, notes, and enrollment

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
  joinedAt: string;
}

export type Theme = 'dark' | 'light';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('eduvn-theme') as Theme) || 'dark';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvn-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// ========== AUTH ==========
export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('eduvn-user');
  return data ? JSON.parse(data) : null;
}

export function setStoredUser(user: StoredUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvn-user', JSON.stringify(user));
  }
}

export function removeStoredUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eduvn-user');
  }
}

export function isLoggedIn(): boolean {
  return getStoredUser() !== null;
}

export function isAdmin(): boolean {
  const user = getStoredUser();
  return user?.role === 'admin';
}

// ========== ENROLLMENT ==========
export function getEnrolledCourses(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('eduvn-enrolled');
  return data ? JSON.parse(data) : [];
}

export function enrollCourse(courseId: string): void {
  const enrolled = getEnrolledCourses();
  if (!enrolled.includes(courseId)) {
    enrolled.push(courseId);
    localStorage.setItem('eduvn-enrolled', JSON.stringify(enrolled));
  }
}

export function isEnrolled(courseId: string): boolean {
  return getEnrolledCourses().includes(courseId);
}

export function unenrollCourse(courseId: string): void {
  const enrolled = getEnrolledCourses().filter((id) => id !== courseId);
  localStorage.setItem('eduvn-enrolled', JSON.stringify(enrolled));
}

// ========== LESSON PROGRESS ==========
export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('eduvn-completed-lessons');
  return data ? JSON.parse(data) : [];
}

export function markLessonComplete(lessonId: string): void {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem('eduvn-completed-lessons', JSON.stringify(completed));
  }
}

export function markLessonIncomplete(lessonId: string): void {
  const completed = getCompletedLessons().filter((id) => id !== lessonId);
  localStorage.setItem('eduvn-completed-lessons', JSON.stringify(completed));
}

export function isLessonCompleted(lessonId: string): boolean {
  return getCompletedLessons().includes(lessonId);
}

export function getCourseProgress(courseId: string, totalLessons: { id: string }[]): number {
  const completed = getCompletedLessons();
  const lessonIds = totalLessons.map((l) => l.id);
  const completedInCourse = lessonIds.filter((id) => completed.includes(id)).length;
  return totalLessons.length > 0 ? Math.round((completedInCourse / totalLessons.length) * 100) : 0;
}

// ========== NOTES ==========
export function getLessonNotes(lessonId: string): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(`eduvn-notes-${lessonId}`) || '';
}

export function saveLessonNotes(lessonId: string, notes: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`eduvn-notes-${lessonId}`, notes);
  }
}

// ========== VIDEO UPLOAD (Simulated) ==========
export interface UploadedVideo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  courseId?: string;
  lessonId?: string;
}

export function getUploadedVideos(): UploadedVideo[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('eduvn-uploaded-videos');
  return data ? JSON.parse(data) : [];
}

export function addUploadedVideo(video: UploadedVideo): void {
  const videos = getUploadedVideos();
  videos.push(video);
  localStorage.setItem('eduvn-uploaded-videos', JSON.stringify(videos));
}

export function removeUploadedVideo(id: string): void {
  const videos = getUploadedVideos().filter((v) => v.id !== id);
  localStorage.setItem('eduvn-uploaded-videos', JSON.stringify(videos));
}

// ========== GENERAL STORAGE OPTIMIZATION ==========
export function getStorageUsage(): { used: number; keys: number } {
  if (typeof window === 'undefined') return { used: 0, keys: 0 };
  let total = 0;
  let keys = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('eduvn-')) {
      const value = localStorage.getItem(key) || '';
      total += key.length + value.length;
      keys++;
    }
  }
  return { used: total * 2, keys }; // UTF-16 = 2 bytes per char
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('eduvn-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

// ========== DEMO ACCOUNTS ==========
export const demoAccounts = {
  student: {
    id: 'user-demo-1',
    name: 'Nguyễn Văn A',
    email: 'student@eduvn.com',
    role: 'student' as const,
    avatar: '/avatars/demo-student.jpg',
    joinedAt: '2025-09-01',
    status: 'active' as const,
  },
  admin: {
    id: 'user-admin-1',
    name: 'Admin EduVN',
    email: 'admin@eduvn.com',
    role: 'admin' as const,
    avatar: '/avatars/demo-admin.jpg',
    joinedAt: '2025-01-01',
    status: 'active' as const,
  },
};

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  joinedAt: string;
  status: 'active' | 'blocked';
}

export function getAdminUsers(): AdminUserItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('eduvn-admin-users');
  if (data) return JSON.parse(data);

  // Default initial users
  const defaultUsers: AdminUserItem[] = [
    { ...demoAccounts.admin, status: 'active' },
    { ...demoAccounts.student, status: 'active' },
    {
      id: 'user-demo-3',
      name: 'Lê Thị Bích',
      email: 'bich.le@gmail.com',
      role: 'student',
      joinedAt: '2025-10-12',
      status: 'active',
    },
    {
      id: 'user-demo-4',
      name: 'Trần Hoàng Nam',
      email: 'nam.tran@tech.vn',
      role: 'student',
      joinedAt: '2025-11-05',
      status: 'active',
    },
    {
      id: 'user-demo-5',
      name: 'Phạm Minh Đức',
      email: 'duc.pham@dev.io',
      role: 'student',
      joinedAt: '2025-12-20',
      status: 'blocked',
    },
  ];
  return defaultUsers;
}

export function saveAdminUsers(users: AdminUserItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvn-admin-users', JSON.stringify(users));
  }
}

// ========== FEEDS / BẢN TIN ==========
export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string; // e.g. 'Pro', 'Instructor', 'Top Contributor'
    role?: string;
  };
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string; // e.g. "5 phút đọc"
  createdAt: string; // e.g. "2 giờ trước"
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  featured?: boolean;
}

const initialPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Sơn Đặng',
      avatar: '/avatars/instructor-1.jpg',
      badge: 'Instructor',
      role: 'Founder @ EduVN',
    },
    title: 'Lộ Trình Học Lập Trình Web Fullstack Từ Zero Đến Có Việc Làm 2026',
    excerpt: 'Tổng hợp lộ trình chi tiết từng bước học HTML/CSS, JavaScript, React.js, Next.js và Node.js chuyên sâu dành cho người mới bắt đầu.',
    content: 'Để trở thành một Fullstack Developer giỏi năm 2026, bạn cần nắm vững nền tảng JavaScript ES6+, tư duy lập trình và các framework hiện đại như Next.js 16 và TailwindCSS...',
    tags: ['web', 'fullstack', 'reactjs', 'roadmap'],
    readTime: '6 phút đọc',
    createdAt: '3 giờ trước',
    likes: 342,
    commentsCount: 48,
    featured: true,
  },
  {
    id: 'post-2',
    author: {
      name: 'Trần Hoàng Nam',
      avatar: '/avatars/demo-student.jpg',
      badge: 'Top Contributor',
      role: 'Fullstack Dev',
    },
    title: 'Top 10 Mẹo Tối Ưu Hiệu Năng ReactJS và Next.js Bạn Cần Biết',
    excerpt: 'Chia sẻ các kỹ thuật useMemo, useCallback, Dynamic Imports và Server Components giúp ứng dụng chạy siêu mượt với Lighthouse 100 điểm.',
    content: 'Tối ưu hiệu năng ứng dụng React chưa bao giờ là công việc đơn giản. Hãy cùng khám phá 10 mẹo hữu ích từ kinh nghiệm thực chiến...',
    tags: ['reactjs', 'nextjs', 'performance', 'frontend'],
    readTime: '4 phút đọc',
    createdAt: '5 giờ trước',
    likes: 189,
    commentsCount: 23,
    featured: false,
  },
  {
    id: 'post-3',
    author: {
      name: 'Lê Thị Bích',
      avatar: '/avatars/demo-student.jpg',
      badge: 'Pro',
      role: 'UI/UX & Frontend Developer',
    },
    title: 'Tại Sao Glassmorphic UI Đang Trở Thành Xu Hướng Thiết Kế Website 2026?',
    excerpt: 'Tìm hiểu về phong cách thiết kế hiệu ứng kính làm mờ (glassmorphism), kết hợp với neon glows để tạo ấn tượng cho sản phẩm web hiện đại.',
    content: 'Hiệu ứng Glassmorphism giúp giao diện có chiều sâu, tạo cảm giác sang trọng và huyền ảo. Bài viết này hướng dẫn cách viết CSS backdrop-filter chuẩn...',
    tags: ['css', 'ui-ux', 'design', 'frontend'],
    readTime: '5 phút đọc',
    createdAt: '1 ngày trước',
    likes: 215,
    commentsCount: 31,
    featured: true,
  },
  {
    id: 'post-4',
    author: {
      name: 'Phạm Minh Đức',
      avatar: '/avatars/demo-admin.jpg',
      badge: 'DevOps Lead',
      role: 'Cloud Architect',
    },
    title: 'Hướng Dẫn Deploy App Next.js 16 Lên Vercel & Docker Chi Tiết A-Z',
    excerpt: 'Quy trình CI/CD tự động hóa kiểm thử và đóng gói ứng dụng Next.js sản phẩm chạy trên môi trường Production.',
    content: 'Dockerization ứng dụng Next.js giúp chuẩn hóa môi trường phát triển và triển khai nhanh chóng trên bất kỳ hạ tầng đám mây nào...',
    tags: ['devops', 'docker', 'nextjs', 'deployment'],
    readTime: '8 phút đọc',
    createdAt: '2 ngày trước',
    likes: 156,
    commentsCount: 19,
    featured: false,
  },
];

export function getStoredPosts(): FeedPost[] {
  if (typeof window === 'undefined') return initialPosts;
  const data = localStorage.getItem('eduvn-feed-posts');
  if (data) return JSON.parse(data);
  return initialPosts;
}

export function saveStoredPosts(posts: FeedPost[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvn-feed-posts', JSON.stringify(posts));
  }
}


