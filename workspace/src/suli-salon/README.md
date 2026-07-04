# 🚢 Hệ thống CMS & Website Đặt Vé Du Thuyền Sông Hàn Đà Nẵng (2Da Tickets)

Đây là mã nguồn hệ thống Website và nền tảng Quản trị (Admin CMS) được thiết kế và phát triển tối ưu dành riêng cho hệ thống phân phối vé **Du Thuyền Sông Hàn - 2Da Tickets**. Dự án được xây dựng dựa trên kiến trúc **Vercel - Next.js App Router** hiện đại nhất, chú trọng vào cả Tốc Độ, Bảo Mật, SEO và Trải Nghiệm CRO (Tối Ưu Hoá Tỷ Lệ Chuyển Đổi).

## 🚀 Công Nghệ Cốt Lõi (Tech Stack)

*   **Framework Frontend & Core:** [Next.js (App Router)](https://nextjs.org/) + React
*   **Ngôn ngữ lập trình:** [TypeScript](https://www.typescriptlang.org/)
*   **Database & ORM:** PostgreSQL + [Prisma](https://www.prisma.io/)
*   **Xác thực bảo mật:** [NextAuth.js](https://next-auth.js.org/) (Triển khai Server-side ở Layout thay thế Middleware)
*   **Storage (Lưu trữ Hình ảnh):** [Cloudinary](https://cloudinary.com/) API
*   **Soạn thảo văn bản (CMS):** `react-quill-new` (Tích hợp vệ sinh HTML mã độc qua `isomorphic-dompurify`)
*   **UI/UX Framework:** Vanilla CSS Modules + `framer-motion` + `sweetalert2` + `nextjs-toploader`

---

## ⚡ Các Tính Năng Độ Tối Ưu (Đã cấu hình & Tối ưu)

### 1. 🥇 Tối ưu chuẩn SEO & CRO (Sales)
*   **JSON-LD Schema Máy Đọc:**
    *   Tự động nhúng cấu trúc **Product Schema** vào trang bài viết Du thuyền (Google tự động show Đánh giá 5 sao, Giá Vé VND và nút InStock ngoài trang Tìm Kiếm).
    *   Nhúng cấu trúc **Article Schema** vào bài Blog/Tin tức (Thân thiện thẻ Google News/Discover).
*   **Sitemap & Robots.txt tự động hóa:** Website tự động trích xuất các bài viết (với chuẩn thời gian `lastModified`) và tạo Sitemap XML trỏ API không qua xử lý file tĩnh.
*   **Cấu trúc OpenGraph đầy đủ:** `metadataBase` quy chiếu link Zalo/Facebook preview hoàn hảo.

### 2. ⚡ Hiệu năng (Performance - Web Vitals)
*   **Hút Code Tĩnh (Static Rendering - ISR):** Tất cả truy xuất Database (Prisma) ở giao diện người dùng được Next.js nén 100% thành HTML Cache. Được cấu hình tự động Reset (`revalidate = 300`) mỗi 5 phút/lần giúp web load trong chưa tới **~50ms**, loại bỏ rủi ro đứng server DB. Tại `/admin` thì được set `force-dynamic` (hiển thị lập tức).
*   **Tối Ưu Hoá Ảnh (Image Optimization):** Component siêu việt `<Image>` kết hợp kịch bản Cấu hình RemotePatterns qua `next.config.ts` nhằm Auto convert ảnh từ Cloudinary sang tệp `WebP/AVIF`, Resize động theo màn hình khách và cơ chế (Viewport Lazy Load).

### 3. 🔒 Bảo Mật & Hệ Thống Core CMS
*   **Reusable Form Components:** Form CMS được xây dựng nguyên tắc *DRY (Don't Repeat Yourself)* trên UI gốc `/components/Admin/FormComponents.tsx`. Code quản trị SIÊU SẠCH và chống trùng lặp.
*   **Chặn Clickjacking & XSS Headers:** Thiết lập trực tiếp HTTP Headers trong `next.config.ts`.
*   **Rate Limiting Bot/Spam:** Các API điền Form Book Vé và Liên Hệ được thiết lập chặn Spam Bot gửi vượt quá định mức 5 lượt / 15 phút từ chung IP.

---

## 📦 Cài Đặt (Getting Started)

1. **Cấu hình môi trường (`.env`):**
Cần có các biến định tuyến và thông tin CSDL tại file `.env` trước khi khởi chạy dự án.
```env
DATABASE_URL="postgres://..."
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="..."
```

2. **Cài đặt thư viện:**
```bash
npm install
```

3. **Cập nhật Schema Database (Prisma Generate):**
```bash
npx prisma generate
```
*(Nếu là lần đầu hoặc DB trống, chạy: `npx prisma db push`)*

4. **Khởi chạy môi trường Dev:**
```bash
npm run dev
```

5. **Lệnh tạo Bản Build Siêu Hoà Mạng (Production Build):**
```bash
npm run build
npm run start
```
Check Terminal sẽ xuất hiện dấu tròn xanh `○  (Static)` ở phần lớn Route cho thấy bộ nhớ đã mã hoá Cache HTML thành công nhờ ISR!

## 📂 Cấu Trúc Dự Án (Folder Structure)

Kiến trúc thư mục được tuân thủ nghiêm ngặt theo chuẩn Modular và hệ sinh thái **App Router** của Next.js:

```text
duthuyensonghan/
├── prisma/                 # Nơi chứa Schema và Migration của CSDL PostgreSQL
├── public/                 # File tĩnh: hình ảnh (images), fonts, SEO fallbacks...
├── src/                    # 🚀 MÃ NGUỒN CHÍNH
│   ├── app/                # Next.js App Router (Hệ thống điều hướng & API)
│   │   ├── admin/          # Khu vực Admin Dashboard (Đã cấu hình Force Dynamic)
│   │   ├── api/            # Hệ thống API Routes (Cruises, Posts, Settings, Cloudinary)
│   │   ├── bai-viet/       # Trang danh sách & Chi tiết bài viết / blog
│   │   ├── du-thuyen/      # Trang chi tiết dịch vụ Du Thuyền
│   │   ├── gia-ve/         # Trang Bảng giá vé
│   │   ├── lien-he/        # Trang liên hệ gốc
│   │   ├── layout.tsx      # Root Layout: Gói bọc Header, Footer, Cấu trúc ISR 300s
│   │   ├── page.tsx        # Trang chủ website
│   │   ├── robots.ts       # Sinh API file robots.txt động cho Bot SEO
│   │   └── sitemap.ts      # Sinh API file sitemap.xml động, auto update link bài mới
│   │
│   ├── components/         # Giao diện UI có thể tái sử dụng (React Components)
│   │   ├── Admin/          # Các Component của Admin: Reusable Forms, Bảng...
│   │   ├── UI/             # Element dùng chung: Hero, Navbar, Footer, RichEditor, CruiseCard
│   │   └── ...             
│   │
│   └── lib/                # Thư viện & Cấu hình Core
│       ├── auth.ts         # Cấu hình NextAuth bảo mật đăng nhập
│       ├── cloudinary.ts   # Tích hợp hàm đẩy ảnh Cloudinary
│       ├── db.ts           # Wrapper Prisma, Controller truy xuất Database
│       └── rate-limit.ts   # Cơ chế chặn chống DDOS / Spam Submit Form
│
├── .env                    # Thông tin môi trường độc lập (Secured credentials)
├── next.config.ts          # Core cấu hình build web, headers bảo mật, Remote Pattern (CDN Image)
└── package.json            # Thông tin Node.js, thư viện và scripts start/build
```

---

## 🚀 Mở Rộng Sau Này
- Core hiện tại đã đạt độ ổn định và kiến trúc tối giản bậc cao cho doanh nghiệp SME.
- Sẵn sàng tích hợp VNPAY / Momo ở module `/api/bookings` nếu yêu cầu.
- Sẵn sàng đẩy sang Cấu hình i18n Đa ngôn ngữ (Anh/Hàn).
