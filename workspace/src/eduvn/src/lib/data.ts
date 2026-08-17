// EduVN — Mock Data
// 8 programming courses with lessons, instructors, and reviews

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  courses: number;
  students: number;
}

export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  duration: string; // e.g. "12:30"
  isFree: boolean;
  videoUrl: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  titleEn: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  commentEn: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  price: number; // VND, 0 if free
  priceUsd: number;
  instructor: Instructor;
  rating: number;
  totalStudents: number;
  totalHours: number;
  totalLessons: number;
  modules: Module[];
  reviews: Review[];
  whatYouLearn: string[];
  whatYouLearnEn: string[];
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  avatar: string;
  content: string;
  contentEn: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin';
  enrolledCourses: string[];
  completedLessons: string[];
  joinedAt: string;
}

// ==================== INSTRUCTORS ====================
const instructors: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Nguyễn Văn Minh',
    avatar: '/avatars/instructor1.jpg',
    title: 'Senior Frontend Developer',
    bio: '10+ năm kinh nghiệm phát triển web, đã làm việc tại các công ty công nghệ lớn.',
    courses: 3,
    students: 5200,
  },
  {
    id: 'inst-2',
    name: 'Trần Thị Hương',
    avatar: '/avatars/instructor2.jpg',
    title: 'Full-Stack Developer',
    bio: 'Chuyên gia Node.js và React, đam mê chia sẻ kiến thức lập trình.',
    courses: 2,
    students: 3800,
  },
  {
    id: 'inst-3',
    name: 'Lê Hoàng Nam',
    avatar: '/avatars/instructor3.jpg',
    title: 'Mobile Developer',
    bio: 'Phát triển ứng dụng Flutter cho các startup hàng đầu Đông Nam Á.',
    courses: 1,
    students: 2100,
  },
  {
    id: 'inst-4',
    name: 'Phạm Đức Anh',
    avatar: '/avatars/instructor4.jpg',
    title: 'DevOps Engineer',
    bio: 'AWS Certified Solutions Architect, chuyên gia về CI/CD và containerization.',
    courses: 2,
    students: 1500,
  },
];

// ==================== COURSES ====================
export const courses: Course[] = [
  // === COURSE 1: React (FREE) ===
  {
    id: 'course-1',
    title: 'React.js Từ Zero Đến Hero',
    titleEn: 'React.js From Zero to Hero',
    slug: 'reactjs-zero-to-hero',
    description: 'Khóa học React.js toàn diện cho người mới bắt đầu. Từ JSX, Components, Hooks đến Redux và triển khai ứng dụng thực tế.',
    descriptionEn: 'Comprehensive React.js course for beginners. From JSX, Components, Hooks to Redux and deploying real applications.',
    thumbnail: '/thumbnails/react.jpg',
    category: 'frontend',
    level: 'beginner',
    isFree: true,
    price: 0,
    priceUsd: 0,
    instructor: instructors[0],
    rating: 4.8,
    totalStudents: 3200,
    totalHours: 24,
    totalLessons: 8,
    isNew: false,
    isFeatured: true,
    createdAt: '2025-06-15',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    whatYouLearn: [
      'Hiểu rõ React từ cơ bản đến nâng cao',
      'Xây dựng SPA với React Router',
      'Quản lý state với Hooks và Context API',
      'Tích hợp API và xử lý dữ liệu',
      'Deploy ứng dụng lên Vercel',
    ],
    whatYouLearnEn: [
      'Understand React from basics to advanced',
      'Build SPA with React Router',
      'Manage state with Hooks and Context API',
      'Integrate APIs and handle data',
      'Deploy applications to Vercel',
    ],
    modules: [
      {
        id: 'm1-1',
        title: 'Giới thiệu React',
        titleEn: 'Introduction to React',
        lessons: [
          { id: 'l1-1', title: 'React là gì?', titleEn: 'What is React?', duration: '15:20', isFree: true, videoUrl: '', order: 1 },
          { id: 'l1-2', title: 'Cài đặt môi trường', titleEn: 'Setting up environment', duration: '12:45', isFree: true, videoUrl: '', order: 2 },
          { id: 'l1-3', title: 'JSX cơ bản', titleEn: 'Basic JSX', duration: '18:10', isFree: true, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm1-2',
        title: 'Components & Props',
        titleEn: 'Components & Props',
        lessons: [
          { id: 'l1-4', title: 'Functional Components', titleEn: 'Functional Components', duration: '20:00', isFree: true, videoUrl: '', order: 4 },
          { id: 'l1-5', title: 'Props và truyền dữ liệu', titleEn: 'Props and data passing', duration: '16:30', isFree: true, videoUrl: '', order: 5 },
        ],
      },
      {
        id: 'm1-3',
        title: 'Hooks & State',
        titleEn: 'Hooks & State',
        lessons: [
          { id: 'l1-6', title: 'useState Hook', titleEn: 'useState Hook', duration: '22:15', isFree: true, videoUrl: '', order: 6 },
          { id: 'l1-7', title: 'useEffect Hook', titleEn: 'useEffect Hook', duration: '19:40', isFree: true, videoUrl: '', order: 7 },
          { id: 'l1-8', title: 'Custom Hooks', titleEn: 'Custom Hooks', duration: '25:00', isFree: true, videoUrl: '', order: 8 },
        ],
      },
    ],
    reviews: [
      { id: 'r1-1', userName: 'Minh Tuấn', avatar: '/avatars/user1.jpg', rating: 5, comment: 'Khóa học rất dễ hiểu, giảng viên giải thích rất rõ ràng!', commentEn: 'Very easy to understand, instructor explains very clearly!', date: '2025-11-20' },
      { id: 'r1-2', userName: 'Lan Phương', avatar: '/avatars/user2.jpg', rating: 5, comment: 'Tuyệt vời! Sau khóa học tôi đã tự tin build được ứng dụng React.', commentEn: 'Amazing! After the course I can confidently build React apps.', date: '2025-12-05' },
      { id: 'r1-3', userName: 'Hoàng Long', avatar: '/avatars/user3.jpg', rating: 4, comment: 'Nội dung tốt, mong có thêm phần nâng cao.', commentEn: 'Good content, hope for more advanced sections.', date: '2026-01-10' },
    ],
  },

  // === COURSE 2: Node.js (PREMIUM) ===
  {
    id: 'course-2',
    title: 'Node.js & Express — Backend Chuyên Sâu',
    titleEn: 'Node.js & Express — Advanced Backend',
    slug: 'nodejs-express-backend',
    description: 'Xây dựng REST API chuyên nghiệp với Node.js, Express, MongoDB. Bao gồm authentication, authorization, và deployment.',
    descriptionEn: 'Build professional REST APIs with Node.js, Express, MongoDB. Includes authentication, authorization, and deployment.',
    thumbnail: '/thumbnails/nodejs.jpg',
    category: 'backend',
    level: 'intermediate',
    isFree: false,
    price: 599000,
    priceUsd: 24.99,
    instructor: instructors[1],
    rating: 4.7,
    totalStudents: 2100,
    totalHours: 32,
    totalLessons: 7,
    isNew: false,
    isFeatured: true,
    createdAt: '2025-08-20',
    tags: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    whatYouLearn: [
      'Xây dựng REST API với Express',
      'Kết nối và thao tác MongoDB',
      'Authentication với JWT',
      'Upload file và quản lý media',
      'Deploy lên cloud server',
    ],
    whatYouLearnEn: [
      'Build REST APIs with Express',
      'Connect and operate MongoDB',
      'Authentication with JWT',
      'File upload and media management',
      'Deploy to cloud server',
    ],
    modules: [
      {
        id: 'm2-1',
        title: 'Node.js Cơ Bản',
        titleEn: 'Node.js Basics',
        lessons: [
          { id: 'l2-1', title: 'Giới thiệu Node.js', titleEn: 'Introduction to Node.js', duration: '14:20', isFree: true, videoUrl: '', order: 1 },
          { id: 'l2-2', title: 'Modules & NPM', titleEn: 'Modules & NPM', duration: '18:00', isFree: true, videoUrl: '', order: 2 },
        ],
      },
      {
        id: 'm2-2',
        title: 'Express Framework',
        titleEn: 'Express Framework',
        lessons: [
          { id: 'l2-3', title: 'Routing & Middleware', titleEn: 'Routing & Middleware', duration: '22:30', isFree: false, videoUrl: '', order: 3 },
          { id: 'l2-4', title: 'RESTful API Design', titleEn: 'RESTful API Design', duration: '25:15', isFree: false, videoUrl: '', order: 4 },
          { id: 'l2-5', title: 'Error Handling', titleEn: 'Error Handling', duration: '16:40', isFree: false, videoUrl: '', order: 5 },
        ],
      },
      {
        id: 'm2-3',
        title: 'Database & Auth',
        titleEn: 'Database & Auth',
        lessons: [
          { id: 'l2-6', title: 'MongoDB với Mongoose', titleEn: 'MongoDB with Mongoose', duration: '28:00', isFree: false, videoUrl: '', order: 6 },
          { id: 'l2-7', title: 'JWT Authentication', titleEn: 'JWT Authentication', duration: '30:20', isFree: false, videoUrl: '', order: 7 },
        ],
      },
    ],
    reviews: [
      { id: 'r2-1', userName: 'Đức Huy', avatar: '/avatars/user4.jpg', rating: 5, comment: 'Backend course tốt nhất tôi từng học!', commentEn: 'Best backend course I ever took!', date: '2025-12-15' },
      { id: 'r2-2', userName: 'Thanh Tùng', avatar: '/avatars/user5.jpg', rating: 4, comment: 'Nội dung rất thực tế, áp dụng được ngay.', commentEn: 'Very practical content, immediately applicable.', date: '2026-01-22' },
    ],
  },

  // === COURSE 3: Python (FREE) ===
  {
    id: 'course-3',
    title: 'Python Cho Người Mới Bắt Đầu',
    titleEn: 'Python for Beginners',
    slug: 'python-beginners',
    description: 'Học Python từ số 0 — ngôn ngữ lập trình dễ học nhất và phổ biến nhất thế giới. Bao gồm cú pháp, OOP, và các dự án thực hành.',
    descriptionEn: 'Learn Python from scratch — the easiest and most popular programming language. Includes syntax, OOP, and hands-on projects.',
    thumbnail: '/thumbnails/python.jpg',
    category: 'language',
    level: 'beginner',
    isFree: true,
    price: 0,
    priceUsd: 0,
    instructor: instructors[1],
    rating: 4.9,
    totalStudents: 4500,
    totalHours: 20,
    totalLessons: 7,
    isNew: false,
    isFeatured: true,
    createdAt: '2025-04-10',
    tags: ['Python', 'Programming', 'OOP', 'Beginner'],
    whatYouLearn: [
      'Cú pháp Python cơ bản',
      'Làm việc với List, Dict, Set, Tuple',
      'Lập trình hướng đối tượng (OOP)',
      'Đọc/ghi file và xử lý dữ liệu',
      'Xây dựng 3 mini project thực tế',
    ],
    whatYouLearnEn: [
      'Basic Python syntax',
      'Work with Lists, Dicts, Sets, Tuples',
      'Object-Oriented Programming (OOP)',
      'File I/O and data processing',
      'Build 3 real mini projects',
    ],
    modules: [
      {
        id: 'm3-1',
        title: 'Python Cơ Bản',
        titleEn: 'Python Basics',
        lessons: [
          { id: 'l3-1', title: 'Cài đặt Python', titleEn: 'Install Python', duration: '10:00', isFree: true, videoUrl: '', order: 1 },
          { id: 'l3-2', title: 'Biến và kiểu dữ liệu', titleEn: 'Variables and data types', duration: '16:30', isFree: true, videoUrl: '', order: 2 },
          { id: 'l3-3', title: 'Cấu trúc điều khiển', titleEn: 'Control structures', duration: '20:15', isFree: true, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm3-2',
        title: 'Cấu trúc dữ liệu',
        titleEn: 'Data Structures',
        lessons: [
          { id: 'l3-4', title: 'List & Tuple', titleEn: 'List & Tuple', duration: '18:45', isFree: true, videoUrl: '', order: 4 },
          { id: 'l3-5', title: 'Dictionary & Set', titleEn: 'Dictionary & Set', duration: '15:20', isFree: true, videoUrl: '', order: 5 },
        ],
      },
      {
        id: 'm3-3',
        title: 'OOP & Project',
        titleEn: 'OOP & Project',
        lessons: [
          { id: 'l3-6', title: 'Class & Object', titleEn: 'Class & Object', duration: '25:00', isFree: true, videoUrl: '', order: 6 },
          { id: 'l3-7', title: 'Mini Project: Todo App', titleEn: 'Mini Project: Todo App', duration: '35:00', isFree: true, videoUrl: '', order: 7 },
        ],
      },
    ],
    reviews: [
      { id: 'r3-1', userName: 'Hải Yến', avatar: '/avatars/user6.jpg', rating: 5, comment: 'Khóa học miễn phí tuyệt vời! Rất cảm ơn EduVN.', commentEn: 'Amazing free course! Thank you EduVN.', date: '2025-10-08' },
      { id: 'r3-2', userName: 'Quang Vinh', avatar: '/avatars/user7.jpg', rating: 5, comment: 'Cách giảng dạy rất dễ hiểu cho người chưa biết gì về lập trình.', commentEn: 'Teaching method very easy to understand for complete beginners.', date: '2025-11-30' },
    ],
  },

  // === COURSE 4: Flutter (PREMIUM) ===
  {
    id: 'course-4',
    title: 'Flutter & Dart — Lập Trình Mobile Cross-Platform',
    titleEn: 'Flutter & Dart — Cross-Platform Mobile Development',
    slug: 'flutter-dart-mobile',
    description: 'Xây dựng ứng dụng iOS & Android chỉ với một codebase. Từ UI cơ bản đến tích hợp Firebase và publish lên Store.',
    descriptionEn: 'Build iOS & Android apps with a single codebase. From basic UI to Firebase integration and Store publishing.',
    thumbnail: '/thumbnails/flutter.jpg',
    category: 'mobile',
    level: 'intermediate',
    isFree: false,
    price: 799000,
    priceUsd: 32.99,
    instructor: instructors[2],
    rating: 4.6,
    totalStudents: 1800,
    totalHours: 28,
    totalLessons: 6,
    isNew: true,
    isFeatured: true,
    createdAt: '2026-05-01',
    tags: ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android'],
    whatYouLearn: [
      'Dart programming language',
      'Flutter widgets & layouts',
      'State management với Provider/Riverpod',
      'Tích hợp Firebase',
      'Publish app lên Google Play & App Store',
    ],
    whatYouLearnEn: [
      'Dart programming language',
      'Flutter widgets & layouts',
      'State management with Provider/Riverpod',
      'Firebase integration',
      'Publish app to Google Play & App Store',
    ],
    modules: [
      {
        id: 'm4-1',
        title: 'Dart & Flutter Cơ Bản',
        titleEn: 'Dart & Flutter Basics',
        lessons: [
          { id: 'l4-1', title: 'Giới thiệu Flutter', titleEn: 'Introduction to Flutter', duration: '12:00', isFree: true, videoUrl: '', order: 1 },
          { id: 'l4-2', title: 'Dart Language Tour', titleEn: 'Dart Language Tour', duration: '25:30', isFree: true, videoUrl: '', order: 2 },
          { id: 'l4-3', title: 'Widget cơ bản', titleEn: 'Basic Widgets', duration: '20:00', isFree: false, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm4-2',
        title: 'UI & Navigation',
        titleEn: 'UI & Navigation',
        lessons: [
          { id: 'l4-4', title: 'Layout Widgets', titleEn: 'Layout Widgets', duration: '22:15', isFree: false, videoUrl: '', order: 4 },
          { id: 'l4-5', title: 'Navigation & Routing', titleEn: 'Navigation & Routing', duration: '18:40', isFree: false, videoUrl: '', order: 5 },
          { id: 'l4-6', title: 'State Management', titleEn: 'State Management', duration: '30:00', isFree: false, videoUrl: '', order: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'r4-1', userName: 'Thành Đạt', avatar: '/avatars/user8.jpg', rating: 5, comment: 'Build được app đầu tiên sau 2 tuần học!', commentEn: 'Built my first app after 2 weeks!', date: '2026-06-20' },
    ],
  },

  // === COURSE 5: Docker & DevOps (PREMIUM) ===
  {
    id: 'course-5',
    title: 'Docker & Kubernetes — DevOps Thực Chiến',
    titleEn: 'Docker & Kubernetes — Practical DevOps',
    slug: 'docker-kubernetes-devops',
    description: 'Làm chủ containerization và orchestration. Tự động hóa CI/CD pipeline và triển khai microservices trên cloud.',
    descriptionEn: 'Master containerization and orchestration. Automate CI/CD pipelines and deploy microservices on cloud.',
    thumbnail: '/thumbnails/docker.jpg',
    category: 'devops',
    level: 'advanced',
    isFree: false,
    price: 899000,
    priceUsd: 36.99,
    instructor: instructors[3],
    rating: 4.8,
    totalStudents: 950,
    totalHours: 35,
    totalLessons: 6,
    isNew: false,
    isFeatured: false,
    createdAt: '2025-10-15',
    tags: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Cloud'],
    whatYouLearn: [
      'Docker containers & images',
      'Docker Compose cho multi-container apps',
      'Kubernetes basics: Pods, Services, Deployments',
      'CI/CD với GitHub Actions',
      'Deploy lên AWS/GCP',
    ],
    whatYouLearnEn: [
      'Docker containers & images',
      'Docker Compose for multi-container apps',
      'Kubernetes basics: Pods, Services, Deployments',
      'CI/CD with GitHub Actions',
      'Deploy to AWS/GCP',
    ],
    modules: [
      {
        id: 'm5-1',
        title: 'Docker Fundamentals',
        titleEn: 'Docker Fundamentals',
        lessons: [
          { id: 'l5-1', title: 'Container là gì?', titleEn: 'What are Containers?', duration: '15:00', isFree: true, videoUrl: '', order: 1 },
          { id: 'l5-2', title: 'Dockerfile & Images', titleEn: 'Dockerfile & Images', duration: '22:30', isFree: false, videoUrl: '', order: 2 },
          { id: 'l5-3', title: 'Docker Compose', titleEn: 'Docker Compose', duration: '25:00', isFree: false, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm5-2',
        title: 'Kubernetes & CI/CD',
        titleEn: 'Kubernetes & CI/CD',
        lessons: [
          { id: 'l5-4', title: 'Kubernetes Architecture', titleEn: 'Kubernetes Architecture', duration: '28:00', isFree: false, videoUrl: '', order: 4 },
          { id: 'l5-5', title: 'Deployments & Services', titleEn: 'Deployments & Services', duration: '30:00', isFree: false, videoUrl: '', order: 5 },
          { id: 'l5-6', title: 'CI/CD Pipeline', titleEn: 'CI/CD Pipeline', duration: '35:20', isFree: false, videoUrl: '', order: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'r5-1', userName: 'Bảo Khánh', avatar: '/avatars/user9.jpg', rating: 5, comment: 'Nội dung cập nhật, thực tế. Giảng viên rất pro!', commentEn: 'Updated, practical content. Instructor is very pro!', date: '2026-02-14' },
    ],
  },

  // === COURSE 6: Git (FREE) ===
  {
    id: 'course-6',
    title: 'Git & GitHub — Quản Lý Code Chuyên Nghiệp',
    titleEn: 'Git & GitHub — Professional Code Management',
    slug: 'git-github-professional',
    description: 'Thành thạo Git từ cơ bản đến nâng cao. Branching strategy, conflict resolution, và workflow chuẩn doanh nghiệp.',
    descriptionEn: 'Master Git from basics to advanced. Branching strategy, conflict resolution, and enterprise-level workflows.',
    thumbnail: '/thumbnails/git.jpg',
    category: 'tools',
    level: 'beginner',
    isFree: true,
    price: 0,
    priceUsd: 0,
    instructor: instructors[3],
    rating: 4.7,
    totalStudents: 5800,
    totalHours: 12,
    totalLessons: 6,
    isNew: false,
    isFeatured: false,
    createdAt: '2025-03-01',
    tags: ['Git', 'GitHub', 'Version Control', 'Tools'],
    whatYouLearn: [
      'Git cơ bản: init, add, commit, push',
      'Branching & Merging',
      'Giải quyết conflict',
      'GitHub workflow (PR, Issues, Actions)',
      'Git flow cho team',
    ],
    whatYouLearnEn: [
      'Git basics: init, add, commit, push',
      'Branching & Merging',
      'Resolving conflicts',
      'GitHub workflow (PR, Issues, Actions)',
      'Git flow for teams',
    ],
    modules: [
      {
        id: 'm6-1',
        title: 'Git Cơ Bản',
        titleEn: 'Git Basics',
        lessons: [
          { id: 'l6-1', title: 'Git là gì? Cài đặt', titleEn: 'What is Git? Installation', duration: '10:00', isFree: true, videoUrl: '', order: 1 },
          { id: 'l6-2', title: 'Init, Add, Commit', titleEn: 'Init, Add, Commit', duration: '15:30', isFree: true, videoUrl: '', order: 2 },
          { id: 'l6-3', title: 'Remote & Push', titleEn: 'Remote & Push', duration: '12:20', isFree: true, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm6-2',
        title: 'Git Nâng Cao',
        titleEn: 'Advanced Git',
        lessons: [
          { id: 'l6-4', title: 'Branching Strategy', titleEn: 'Branching Strategy', duration: '18:00', isFree: true, videoUrl: '', order: 4 },
          { id: 'l6-5', title: 'Merge & Rebase', titleEn: 'Merge & Rebase', duration: '20:30', isFree: true, videoUrl: '', order: 5 },
          { id: 'l6-6', title: 'GitHub Workflow', titleEn: 'GitHub Workflow', duration: '22:00', isFree: true, videoUrl: '', order: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'r6-1', userName: 'Thu Trang', avatar: '/avatars/user10.jpg', rating: 5, comment: 'Rất hữu ích cho sinh viên IT!', commentEn: 'Very useful for IT students!', date: '2025-09-12' },
    ],
  },

  // === COURSE 7: SQL (PREMIUM) ===
  {
    id: 'course-7',
    title: 'SQL & PostgreSQL — Quản Trị Cơ Sở Dữ Liệu',
    titleEn: 'SQL & PostgreSQL — Database Administration',
    slug: 'sql-postgresql-database',
    description: 'Từ truy vấn cơ bản đến tối ưu hiệu suất. Thiết kế schema, indexing, và quản trị PostgreSQL cho ứng dụng production.',
    descriptionEn: 'From basic queries to performance optimization. Schema design, indexing, and PostgreSQL administration for production apps.',
    thumbnail: '/thumbnails/sql.jpg',
    category: 'database',
    level: 'intermediate',
    isFree: false,
    price: 499000,
    priceUsd: 19.99,
    instructor: instructors[0],
    rating: 4.5,
    totalStudents: 1600,
    totalHours: 18,
    totalLessons: 6,
    isNew: false,
    isFeatured: false,
    createdAt: '2025-07-20',
    tags: ['SQL', 'PostgreSQL', 'Database', 'Backend'],
    whatYouLearn: [
      'SQL cơ bản: SELECT, INSERT, UPDATE, DELETE',
      'JOINs và subqueries',
      'Thiết kế database schema',
      'Indexing và query optimization',
      'PostgreSQL administration',
    ],
    whatYouLearnEn: [
      'Basic SQL: SELECT, INSERT, UPDATE, DELETE',
      'JOINs and subqueries',
      'Database schema design',
      'Indexing and query optimization',
      'PostgreSQL administration',
    ],
    modules: [
      {
        id: 'm7-1',
        title: 'SQL Cơ Bản',
        titleEn: 'SQL Basics',
        lessons: [
          { id: 'l7-1', title: 'Giới thiệu SQL', titleEn: 'Introduction to SQL', duration: '12:00', isFree: true, videoUrl: '', order: 1 },
          { id: 'l7-2', title: 'SELECT & WHERE', titleEn: 'SELECT & WHERE', duration: '18:30', isFree: true, videoUrl: '', order: 2 },
          { id: 'l7-3', title: 'JOINs', titleEn: 'JOINs', duration: '22:00', isFree: false, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm7-2',
        title: 'PostgreSQL Nâng Cao',
        titleEn: 'Advanced PostgreSQL',
        lessons: [
          { id: 'l7-4', title: 'Schema Design', titleEn: 'Schema Design', duration: '25:00', isFree: false, videoUrl: '', order: 4 },
          { id: 'l7-5', title: 'Indexing & Performance', titleEn: 'Indexing & Performance', duration: '28:15', isFree: false, videoUrl: '', order: 5 },
          { id: 'l7-6', title: 'Backup & Recovery', titleEn: 'Backup & Recovery', duration: '20:00', isFree: false, videoUrl: '', order: 6 },
        ],
      },
    ],
    reviews: [
      { id: 'r7-1', userName: 'Anh Khoa', avatar: '/avatars/user11.jpg', rating: 4, comment: 'Nội dung tốt nhưng mong có thêm bài tập.', commentEn: 'Good content but hope for more exercises.', date: '2026-03-05' },
    ],
  },

  // === COURSE 8: TypeScript (PREMIUM) ===
  {
    id: 'course-8',
    title: 'TypeScript Mastery — Lập Trình Type-Safe',
    titleEn: 'TypeScript Mastery — Type-Safe Programming',
    slug: 'typescript-mastery',
    description: 'Nắm vững TypeScript để viết code an toàn, dễ bảo trì. Từ types cơ bản đến Generics, Decorators, và tích hợp với React/Node.',
    descriptionEn: 'Master TypeScript for safe, maintainable code. From basic types to Generics, Decorators, and React/Node integration.',
    thumbnail: '/thumbnails/typescript.jpg',
    category: 'language',
    level: 'intermediate',
    isFree: false,
    price: 699000,
    priceUsd: 28.99,
    instructor: instructors[0],
    rating: 4.9,
    totalStudents: 2800,
    totalHours: 22,
    totalLessons: 7,
    isNew: true,
    isFeatured: true,
    createdAt: '2026-06-01',
    tags: ['TypeScript', 'JavaScript', 'Frontend', 'Backend'],
    whatYouLearn: [
      'Type system cơ bản & nâng cao',
      'Interfaces & Type Aliases',
      'Generics',
      'TypeScript với React',
      'TypeScript với Node.js/Express',
    ],
    whatYouLearnEn: [
      'Basic & advanced type system',
      'Interfaces & Type Aliases',
      'Generics',
      'TypeScript with React',
      'TypeScript with Node.js/Express',
    ],
    modules: [
      {
        id: 'm8-1',
        title: 'TypeScript Cơ Bản',
        titleEn: 'TypeScript Basics',
        lessons: [
          { id: 'l8-1', title: 'Tại sao TypeScript?', titleEn: 'Why TypeScript?', duration: '10:30', isFree: true, videoUrl: '', order: 1 },
          { id: 'l8-2', title: 'Types & Interfaces', titleEn: 'Types & Interfaces', duration: '20:00', isFree: true, videoUrl: '', order: 2 },
          { id: 'l8-3', title: 'Union & Intersection Types', titleEn: 'Union & Intersection Types', duration: '16:45', isFree: false, videoUrl: '', order: 3 },
        ],
      },
      {
        id: 'm8-2',
        title: 'TypeScript Nâng Cao',
        titleEn: 'Advanced TypeScript',
        lessons: [
          { id: 'l8-4', title: 'Generics', titleEn: 'Generics', duration: '25:00', isFree: false, videoUrl: '', order: 4 },
          { id: 'l8-5', title: 'Decorators', titleEn: 'Decorators', duration: '18:30', isFree: false, videoUrl: '', order: 5 },
          { id: 'l8-6', title: 'TypeScript + React', titleEn: 'TypeScript + React', duration: '30:00', isFree: false, videoUrl: '', order: 6 },
          { id: 'l8-7', title: 'TypeScript + Node', titleEn: 'TypeScript + Node', duration: '28:00', isFree: false, videoUrl: '', order: 7 },
        ],
      },
    ],
    reviews: [
      { id: 'r8-1', userName: 'Phương Anh', avatar: '/avatars/user12.jpg', rating: 5, comment: 'Giải thích TypeScript rất dễ hiểu, code sạch hơn rất nhiều!', commentEn: 'TypeScript explained very clearly, code is much cleaner!', date: '2026-07-10' },
      { id: 'r8-2', userName: 'Trung Kiên', avatar: '/avatars/user13.jpg', rating: 5, comment: 'Khóa học cập nhật nhất về TypeScript, rất recommend!', commentEn: 'Most updated TypeScript course, highly recommend!', date: '2026-07-25' },
    ],
  },
];

// ==================== TESTIMONIALS ====================
export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Nguyễn Thị Mai',
    role: 'Frontend Developer tại TechVN',
    roleEn: 'Frontend Developer at TechVN',
    avatar: '/avatars/test1.jpg',
    content: 'EduVN đã giúp tôi chuyển nghề từ kế toán sang lập trình chỉ trong 6 tháng. Các khóa học rất chất lượng và dễ hiểu!',
    contentEn: 'EduVN helped me switch careers from accounting to programming in just 6 months. The courses are high quality and easy to understand!',
    rating: 5,
  },
  {
    id: 't-2',
    name: 'Trần Văn Hùng',
    role: 'Sinh viên CNTT năm 3',
    roleEn: 'CS Student, 3rd year',
    avatar: '/avatars/test2.jpg',
    content: 'Khóa học miễn phí trên EduVN giúp tôi bổ sung rất nhiều kiến thức ngoài trường đại học. Cảm ơn EduVN!',
    contentEn: 'Free courses on EduVN helped me supplement a lot of knowledge outside university. Thank you EduVN!',
    rating: 5,
  },
  {
    id: 't-3',
    name: 'Lê Minh Châu',
    role: 'Full-Stack Developer tại StartupX',
    roleEn: 'Full-Stack Developer at StartupX',
    avatar: '/avatars/test3.jpg',
    content: 'Từ một người không biết gì về Docker, giờ tôi đã tự tin deploy microservices nhờ khóa học DevOps trên EduVN.',
    contentEn: 'From knowing nothing about Docker, now I can confidently deploy microservices thanks to the DevOps course on EduVN.',
    rating: 5,
  },
  {
    id: 't-4',
    name: 'Phạm Quốc Bảo',
    role: 'Junior Developer',
    roleEn: 'Junior Developer',
    avatar: '/avatars/test4.jpg',
    content: 'Video chất lượng cao, giảng viên nhiệt tình. Đặc biệt thích cách giải thích từng bước một, rất phù hợp cho newbie.',
    contentEn: 'High quality videos, enthusiastic instructors. Especially love the step-by-step explanations, perfect for beginners.',
    rating: 4,
  },
];

// ==================== HELPER FUNCTIONS ====================
export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getFeaturedCourses(): Course[] {
  return courses.filter((c) => c.isFeatured);
}

export function getFreeCourses(): Course[] {
  return courses.filter((c) => c.isFree);
}

export function getCoursesByCategory(category: string): Course[] {
  if (category === 'all') return courses;
  return courses.filter((c) => c.category === category);
}

export function searchCourses(query: string): Course[] {
  const q = query.toLowerCase();
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.titleEn.toLowerCase().includes(q) ||
      c.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q)
  );
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function formatPrice(price: number, locale: 'vi' | 'en'): string {
  if (price === 0) return locale === 'vi' ? 'Miễn phí' : 'Free';
  if (locale === 'vi') {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  }
  return '$' + (price / 24000).toFixed(2);
}

export function formatDuration(duration: string): string {
  return duration;
}

export const categories = [
  { id: 'all', label: 'Tất cả', labelEn: 'All', icon: '📚' },
  { id: 'frontend', label: 'Frontend', labelEn: 'Frontend', icon: '🎨' },
  { id: 'backend', label: 'Backend', labelEn: 'Backend', icon: '⚙️' },
  { id: 'mobile', label: 'Di động', labelEn: 'Mobile', icon: '📱' },
  { id: 'devops', label: 'DevOps', labelEn: 'DevOps', icon: '🚀' },
  { id: 'database', label: 'Database', labelEn: 'Database', icon: '🗄️' },
  { id: 'tools', label: 'Công cụ', labelEn: 'Tools', icon: '🔧' },
  { id: 'language', label: 'Ngôn ngữ', labelEn: 'Language', icon: '💻' },
];
