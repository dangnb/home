// EduVN — Internationalization (i18n) System
// Supports Vietnamese and English

export type Locale = 'vi' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { vi: 'Trang chủ', en: 'Home' },
  'nav.courses': { vi: 'Khóa học', en: 'Courses' },
  'nav.dashboard': { vi: 'Bảng điều khiển', en: 'Dashboard' },
  'nav.admin': { vi: 'Quản trị', en: 'Admin' },
  'nav.login': { vi: 'Đăng nhập', en: 'Login' },
  'nav.register': { vi: 'Đăng ký', en: 'Register' },
  'nav.logout': { vi: 'Đăng xuất', en: 'Logout' },
  'nav.myAccount': { vi: 'Tài khoản', en: 'My Account' },

  // Hero Section
  'hero.title': { vi: 'Học Lập Trình', en: 'Learn Programming' },
  'hero.titleHighlight': { vi: 'Cùng EduVN', en: 'With EduVN' },
  'hero.subtitle': {
    vi: 'Nền tảng học lập trình hàng đầu Việt Nam với hàng trăm bài học chất lượng từ các chuyên gia công nghệ.',
    en: 'Vietnam\'s leading programming learning platform with hundreds of quality lessons from tech experts.',
  },
  'hero.cta': { vi: 'Bắt đầu học ngay', en: 'Start Learning Now' },
  'hero.ctaSecondary': { vi: 'Khám phá khóa học', en: 'Explore Courses' },
  'hero.freeBadge': { vi: 'Có khóa học MIỄN PHÍ', en: 'FREE courses available' },

  // Stats
  'stats.courses': { vi: 'Khóa học', en: 'Courses' },
  'stats.students': { vi: 'Học viên', en: 'Students' },
  'stats.instructors': { vi: 'Giảng viên', en: 'Instructors' },
  'stats.hours': { vi: 'Giờ video', en: 'Video Hours' },

  // Featured
  'featured.title': { vi: 'Khóa Học Nổi Bật', en: 'Featured Courses' },
  'featured.subtitle': {
    vi: 'Những khóa học được yêu thích nhất trên EduVN',
    en: 'The most popular courses on EduVN',
  },
  'featured.viewAll': { vi: 'Xem tất cả', en: 'View All' },

  // Testimonials
  'testimonials.title': { vi: 'Học Viên Nói Gì?', en: 'What Students Say?' },
  'testimonials.subtitle': {
    vi: 'Phản hồi từ cộng đồng học viên EduVN',
    en: 'Feedback from the EduVN student community',
  },

  // CTA
  'cta.title': { vi: 'Sẵn Sàng Bắt Đầu?', en: 'Ready to Start?' },
  'cta.subtitle': {
    vi: 'Tham gia cùng hàng ngàn học viên và bắt đầu hành trình lập trình của bạn ngay hôm nay.',
    en: 'Join thousands of students and start your programming journey today.',
  },
  'cta.button': { vi: 'Đăng ký miễn phí', en: 'Register for Free' },

  // Course Card
  'course.free': { vi: 'Miễn phí', en: 'Free' },
  'course.premium': { vi: 'Trả phí', en: 'Premium' },
  'course.lessons': { vi: 'bài học', en: 'lessons' },
  'course.students': { vi: 'học viên', en: 'students' },
  'course.hours': { vi: 'giờ', en: 'hours' },
  'course.level': { vi: 'Cấp độ', en: 'Level' },
  'course.beginner': { vi: 'Cơ bản', en: 'Beginner' },
  'course.intermediate': { vi: 'Trung cấp', en: 'Intermediate' },
  'course.advanced': { vi: 'Nâng cao', en: 'Advanced' },
  'course.enroll': { vi: 'Đăng ký học', en: 'Enroll Now' },
  'course.continue': { vi: 'Tiếp tục học', en: 'Continue Learning' },
  'course.enrolled': { vi: 'Đã đăng ký', en: 'Enrolled' },
  'course.viewDetails': { vi: 'Xem chi tiết', en: 'View Details' },
  'course.curriculum': { vi: 'Nội dung khóa học', en: 'Curriculum' },
  'course.reviews': { vi: 'Đánh giá', en: 'Reviews' },
  'course.instructor': { vi: 'Giảng viên', en: 'Instructor' },
  'course.description': { vi: 'Mô tả', en: 'Description' },
  'course.whatYouLearn': { vi: 'Bạn sẽ học được gì', en: 'What You\'ll Learn' },

  // Courses Page
  'courses.title': { vi: 'Tất Cả Khóa Học', en: 'All Courses' },
  'courses.subtitle': {
    vi: 'Khám phá các khóa học lập trình chất lượng cao',
    en: 'Discover high-quality programming courses',
  },
  'courses.search': { vi: 'Tìm kiếm khóa học...', en: 'Search courses...' },
  'courses.filterAll': { vi: 'Tất cả', en: 'All' },
  'courses.filterFree': { vi: 'Miễn phí', en: 'Free' },
  'courses.filterPremium': { vi: 'Trả phí', en: 'Premium' },
  'courses.noResults': { vi: 'Không tìm thấy khóa học nào', en: 'No courses found' },
  'courses.loadMore': { vi: 'Xem thêm', en: 'Load More' },

  // Categories
  'category.all': { vi: 'Tất cả', en: 'All' },
  'category.frontend': { vi: 'Frontend', en: 'Frontend' },
  'category.backend': { vi: 'Backend', en: 'Backend' },
  'category.mobile': { vi: 'Di động', en: 'Mobile' },
  'category.devops': { vi: 'DevOps', en: 'DevOps' },
  'category.database': { vi: 'Database', en: 'Database' },
  'category.tools': { vi: 'Công cụ', en: 'Tools' },
  'category.language': { vi: 'Ngôn ngữ', en: 'Language' },

  // Auth
  'auth.loginTitle': { vi: 'Đăng Nhập', en: 'Login' },
  'auth.registerTitle': { vi: 'Tạo Tài Khoản', en: 'Create Account' },
  'auth.email': { vi: 'Email', en: 'Email' },
  'auth.password': { vi: 'Mật khẩu', en: 'Password' },
  'auth.confirmPassword': { vi: 'Xác nhận mật khẩu', en: 'Confirm Password' },
  'auth.fullName': { vi: 'Họ và tên', en: 'Full Name' },
  'auth.loginBtn': { vi: 'Đăng nhập', en: 'Login' },
  'auth.registerBtn': { vi: 'Đăng ký', en: 'Register' },
  'auth.orLoginWith': { vi: 'Hoặc đăng nhập với', en: 'Or login with' },
  'auth.noAccount': { vi: 'Chưa có tài khoản?', en: 'Don\'t have an account?' },
  'auth.hasAccount': { vi: 'Đã có tài khoản?', en: 'Already have an account?' },
  'auth.forgotPassword': { vi: 'Quên mật khẩu?', en: 'Forgot password?' },

  // Dashboard
  'dashboard.title': { vi: 'Bảng Điều Khiển', en: 'Dashboard' },
  'dashboard.welcome': { vi: 'Chào mừng trở lại', en: 'Welcome back' },
  'dashboard.myCourses': { vi: 'Khóa học của tôi', en: 'My Courses' },
  'dashboard.totalCourses': { vi: 'Tổng khóa học', en: 'Total Courses' },
  'dashboard.totalHours': { vi: 'Tổng giờ học', en: 'Total Hours' },
  'dashboard.streak': { vi: 'Chuỗi ngày học', en: 'Day Streak' },
  'dashboard.completed': { vi: 'Hoàn thành', en: 'Completed' },
  'dashboard.continueLearning': { vi: 'Tiếp tục học', en: 'Continue Learning' },
  'dashboard.progress': { vi: 'Tiến độ', en: 'Progress' },
  'dashboard.certificates': { vi: 'Chứng chỉ', en: 'Certificates' },
  'dashboard.noCourses': {
    vi: 'Bạn chưa đăng ký khóa học nào',
    en: 'You haven\'t enrolled in any courses yet',
  },

  // Admin
  'admin.title': { vi: 'Quản Trị Hệ Thống', en: 'Admin Panel' },
  'admin.overview': { vi: 'Tổng quan', en: 'Overview' },
  'admin.manageCourses': { vi: 'Quản lý khóa học', en: 'Manage Courses' },
  'admin.uploadVideo': { vi: 'Upload Video', en: 'Upload Video' },
  'admin.manageUsers': { vi: 'Quản lý người dùng', en: 'Manage Users' },
  'admin.totalUsers': { vi: 'Tổng người dùng', en: 'Total Users' },
  'admin.totalViews': { vi: 'Tổng lượt xem', en: 'Total Views' },
  'admin.revenue': { vi: 'Doanh thu', en: 'Revenue' },
  'admin.dragDrop': {
    vi: 'Kéo thả video vào đây hoặc nhấn để chọn',
    en: 'Drag & drop video here or click to select',
  },
  'admin.supportedFormats': {
    vi: 'Hỗ trợ: MP4, WebM (tối đa 500MB)',
    en: 'Supported: MP4, WebM (max 500MB)',
  },
  'admin.uploading': { vi: 'Đang upload...', en: 'Uploading...' },
  'admin.uploadSuccess': { vi: 'Upload thành công!', en: 'Upload successful!' },

  // Video Player
  'player.notes': { vi: 'Ghi chú', en: 'Notes' },
  'player.notesPlaceholder': {
    vi: 'Viết ghi chú cho bài học này...',
    en: 'Write notes for this lesson...',
  },
  'player.saveNotes': { vi: 'Lưu ghi chú', en: 'Save Notes' },
  'player.markComplete': { vi: 'Hoàn thành bài học', en: 'Mark as Complete' },
  'player.completed': { vi: 'Đã hoàn thành', en: 'Completed' },
  'player.next': { vi: 'Bài tiếp theo', en: 'Next Lesson' },
  'player.prev': { vi: 'Bài trước', en: 'Previous Lesson' },
  'player.courseProgress': { vi: 'Tiến độ khóa học', en: 'Course Progress' },
  'player.locked': { vi: 'Bài học Premium — Đăng ký để mở khóa', en: 'Premium Lesson — Enroll to unlock' },

  // Footer
  'footer.about': { vi: 'Về EduVN', en: 'About EduVN' },
  'footer.aboutText': {
    vi: 'EduVN là nền tảng học lập trình hàng đầu Việt Nam, cung cấp các khóa học chất lượng cao từ các chuyên gia.',
    en: 'EduVN is Vietnam\'s leading programming learning platform, providing high-quality courses from experts.',
  },
  'footer.quickLinks': { vi: 'Liên kết nhanh', en: 'Quick Links' },
  'footer.support': { vi: 'Hỗ trợ', en: 'Support' },
  'footer.contact': { vi: 'Liên hệ', en: 'Contact' },
  'footer.faq': { vi: 'Câu hỏi thường gặp', en: 'FAQ' },
  'footer.privacy': { vi: 'Chính sách bảo mật', en: 'Privacy Policy' },
  'footer.terms': { vi: 'Điều khoản sử dụng', en: 'Terms of Use' },
  'footer.copyright': {
    vi: '© 2026 EduVN. Tất cả quyền được bảo lưu.',
    en: '© 2026 EduVN. All rights reserved.',
  },

  // General
  'general.loading': { vi: 'Đang tải...', en: 'Loading...' },
  'general.error': { vi: 'Có lỗi xảy ra', en: 'An error occurred' },
  'general.save': { vi: 'Lưu', en: 'Save' },
  'general.cancel': { vi: 'Hủy', en: 'Cancel' },
  'general.delete': { vi: 'Xóa', en: 'Delete' },
  'general.edit': { vi: 'Sửa', en: 'Edit' },
  'general.new': { vi: 'MỚI', en: 'NEW' },
};

export function t(key: string, locale: Locale): string {
  return translations[key]?.[locale] || key;
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  return (localStorage.getItem('eduvn-locale') as Locale) || 'vi';
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvn-locale', locale);
  }
}
