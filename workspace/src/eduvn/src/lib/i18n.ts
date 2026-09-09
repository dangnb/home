// EduVN — Internationalization (i18n) System
// Supports Complete Bilingual Coverage for Vietnamese (VI) and English (EN)

export type Locale = 'vi' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { vi: 'Trang chủ', en: 'Home' },
  'nav.courses': { vi: 'Khóa học', en: 'Courses' },
  'nav.feeds': { vi: 'Bản tin', en: 'Feeds' },
  'nav.compiler': { vi: 'Thực hành Code', en: 'Code Compiler' },
  'nav.leaderboard': { vi: 'Bảng xếp hạng', en: 'Leaderboard' },
  'nav.dashboard': { vi: 'Bảng điều khiển', en: 'Dashboard' },
  'nav.admin': { vi: 'Quản trị', en: 'Admin' },
  'nav.login': { vi: 'Đăng nhập', en: 'Login' },
  'nav.register': { vi: 'Đăng ký', en: 'Register' },
  'nav.logout': { vi: 'Đăng xuất', en: 'Logout' },
  'nav.myAccount': { vi: 'Tài khoản & Cài đặt', en: 'My Account & Settings' },

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

  // Compiler Page
  'compiler.title': { vi: 'Trình Biên Dịch & Luyện Code Thực Chiến', en: 'Interactive Code Compiler & Playground' },
  'compiler.subtitle': { vi: 'Soạn thảo, thực thi mã nguồn JavaScript & HTML trực tiếp và tự động chấm điểm bài tập', en: 'Edit and run JavaScript & HTML code directly with automated test evaluation' },
  'compiler.runCode': { vi: 'Chạy Code', en: 'Run Code' },
  'compiler.resetCode': { vi: 'Đặt lại', en: 'Reset Code' },
  'compiler.exercises': { vi: 'Danh Sách Bài Tập', en: 'Coding Exercises' },
  'compiler.console': { vi: 'CỬA SỔ CONSOLE & TEST CASES', en: 'CONSOLE & TEST CASES' },
  'compiler.hint': { vi: 'Gợi ý giải thuật:', en: 'Solution Hint:' },

  // Leaderboard Page
  'leaderboard.title': { vi: 'Bảng Xếp Hạng & Thành Tích Học Viên', en: 'Leaderboard & Achievements' },
  'leaderboard.subtitle': { vi: 'Tích lũy điểm kinh nghiệm (XP), thăng hạng danh hiệu và mở khóa các huy hiệu quý giá', en: 'Accumulate XP, climb rank titles, and unlock prestigious badges' },
  'leaderboard.allTime': { vi: 'Toàn Thời Gian', en: 'All-Time' },
  'leaderboard.weekly': { vi: 'Hàng Tuần', en: 'Weekly' },
  'leaderboard.badgesTitle': { vi: 'Huy Hiệu Thành Tích', en: 'Achievement Badges' },
  'leaderboard.tableTitle': { vi: 'Bảng Thống Kê Học Viên', en: 'Student Ranking Table' },

  // Profile Page
  'profile.title': { vi: 'Hồ Sơ Cá Nhân & Cài Đặt Tài Khoản', en: 'User Profile & Account Settings' },
  'profile.subtitle': { vi: 'Quản lý thông tin cá nhân, danh mục kỹ năng lập trình và cài đặt bảo mật tài khoản EduVN', en: 'Manage profile info, programming skill tags, and account security' },
  'profile.infoTab': { vi: 'Thông Tin Cá Nhân', en: 'Personal Info' },
  'profile.skillsTab': { vi: 'Kỹ Năng Lập Trình', en: 'Programming Skills' },
  'profile.securityTab': { vi: 'Bảo Mật & Mật Khẩu', en: 'Security & Password' },
  'profile.fullName': { vi: 'Họ và Tên', en: 'Full Name' },
  'profile.bio': { vi: 'Giới thiệu bản thân (Bio)', en: 'Bio & Introduction' },
  'profile.changePassword': { vi: 'Đổi Mật Khẩu', en: 'Change Password' },
  'profile.saveChanges': { vi: 'Lưu Thay Đổi', en: 'Save Changes' },

  // Feeds Page
  'feeds.title': { vi: 'Bản Tin Cộng Đồng Dev', en: 'Dev Community Feeds' },
  'feeds.subtitle': { vi: 'Chia sẻ kiến thức, mẹo lập trình và thảo luận cùng cộng đồng EduVN', en: 'Share tech insights, coding tips, and discuss with the EduVN community' },
  'feeds.forYou': { vi: 'Dành cho bạn', en: 'For You' },
  'feeds.featured': { vi: 'Nổi bật', en: 'Featured' },
  'feeds.latest': { vi: 'Mới nhất', en: 'Latest' },
  'feeds.createPost': { vi: 'Viết bài mới', en: 'Create Post' },

  // Admin
  'admin.title': { vi: 'Quản Trị Hệ Thống', en: 'Admin Panel' },
  'admin.overview': { vi: 'Tổng quan', en: 'Overview' },
  'admin.manageCourses': { vi: 'Quản lý khóa học', en: 'Manage Courses' },
  'admin.uploadVideo': { vi: 'Upload Video', en: 'Upload Video' },
  'admin.manageUsers': { vi: 'Quản lý người dùng', en: 'Manage Users' },

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
