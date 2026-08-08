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
  },
  admin: {
    id: 'user-admin-1',
    name: 'Admin EduVN',
    email: 'admin@eduvn.com',
    role: 'admin' as const,
    avatar: '/avatars/demo-admin.jpg',
    joinedAt: '2025-01-01',
  },
};
