This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technologies Used (Công nghệ sử dụng)

*   **Framework:** [Next.js](https://nextjs.org/) (App Router) with React
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Media Storage:** [Cloudinary](https://cloudinary.com/)
*   **Rich Text Editor:** react-quill-new
*   **Alerts/Popups:** SweetAlert2
*   **UI/UX:** nextjs-toploader

## Setup & Configuration (Cài đặt & Cấu hình dự án)

### 1. Database & Lưu trữ (Database & Storage)
*   **Database:** Dự án sử dụng **PostgreSQL** (cụ thể đang kết nối với Supabase thông qua Prisma ORM).
*   **Lưu trữ file/hình ảnh:** Dự án sử dụng **Cloudinary** để upload và lưu trữ hình ảnh (ví dụ như bài đăng, slide, service).

### 2. Các biến môi trường cần cấu hình (Environment Variables)
Tạo một file `.env` tại thư mục root của dự án và cấu hình các thông số sau:

```env
# URL kết nối Database (PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?pgbouncer=true"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Configuration (để lưu trữ ảnh)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Hướng dẫn chạy dự án (How to run locally)

1. Cài đặt các dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

3. Push schema lên Database (nếu là Db mới):
   ```bash
   npx prisma db push
   ```

4. Chạy chế độ development:
   ```bash
   npm run dev
   ```

Dự án sẽ khởi chạy tại [http://localhost:3000](http://localhost:3000).

---

## Project Structure (Cấu trúc thư mục)

```
vinesh-nextjs/
├── prisma/                 # Prisma schema & seed data
│   ├── schema.prisma       # Database models
│   └── seed.ts             # Dữ liệu mẫu (admin, settings, services)
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── [lang]/         # Trang công khai, hỗ trợ đa ngôn ngữ (i18n)
│   │   │   ├── category/   # Trang danh mục
│   │   │   └── lien-he/    # Trang liên hệ
│   │   ├── admin/          # Trang quản trị (CMS)
│   │   │   ├── categories/ # Quản lý danh mục
│   │   │   ├── services/   # Quản lý dịch vụ
│   │   │   ├── slides/     # Quản lý slide banner
│   │   │   ├── pages/      # Quản lý trang nội dung
│   │   │   ├── users/      # Quản lý người dùng
│   │   │   ├── settings/   # Cài đặt hệ thống
│   │   │   └── languages/  # Quản lý ngôn ngữ
│   │   ├── api/            # API Routes
│   │   │   ├── auth/       # NextAuth.js authentication
│   │   │   ├── contact/    # API liên hệ
│   │   │   ├── seed/       # API seed data
│   │   │   └── setup/      # API setup ban đầu
│   │   └── login/          # Trang đăng nhập
│   ├── components/         # Shared React components
│   └── lib/                # Utilities, Prisma client, helpers
├── .env                    # Biến môi trường (không commit lên git)
└── package.json
```

## Features (Tính năng chính)

*   🔐 **Xác thực & Phân quyền:** Đăng nhập bảo mật với NextAuth.js, phân quyền Admin/User.
*   📝 **Quản lý nội dung (CMS):** Admin dashboard quản lý dịch vụ, danh mục, slide, trang nội dung.
*   🌐 **Đa ngôn ngữ (i18n):** Hỗ trợ nhiều ngôn ngữ cho nội dung trang công khai.
*   🖼️ **Upload ảnh lên Cloudinary:** Tích hợp upload ảnh trực tiếp lên Cloudinary.
*   ✏️ **Rich Text Editor:** Soạn thảo nội dung phong phú với react-quill-new (hỗ trợ chèn ảnh, định dạng văn bản).
*   📬 **Form liên hệ:** Khách hàng gửi liên hệ trực tiếp từ website.
*   ⚙️ **Cài đặt hệ thống:** Tuỳ chỉnh tên site, số điện thoại, hero section...

## Seed Data (Dữ liệu mẫu)

Sau khi cấu hình Database, bạn có thể chạy seed để tạo dữ liệu mẫu (admin user, settings, services):

```bash
npx ts-node prisma/seed.ts
```

## Default Admin Account (Tài khoản Admin mặc định)

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@example.com`  |
| Password | `password123`        |

> ⚠️ **Lưu ý:** Hãy đổi mật khẩu admin ngay sau khi deploy lên production!

## Deploy on Vercel

Cách đơn giản nhất để deploy dự án là sử dụng [Vercel](https://vercel.com).

### Hướng dẫn Cấu hình Biến môi trường (Environment Variables) trên Vercel:
Để tránh lỗi `NO_SECRET` do thiếu cấu hình bảo mật `NEXTAUTH_SECRET` khi deploy, bạn cần làm theo các bước sau:

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard).
2. Chọn project của bạn -> Chuyển sang tab **Settings** -> **Environment Variables**.
3. Thêm TẤT CẢ các biến từ file `.env` local của bạn lên đây. Các biến quan trọng nhất cần chú ý:
   - `NEXTAUTH_SECRET`: Nhập `super-secret-vinesh-nextjs-key` (hoặc tạo một chuỗi ngẫu nhiên bảo mật).
   - `NEXTAUTH_URL`: Phải là domain production của bạn trên Vercel (ví dụ: `https://home-theta-blue.vercel.app`), tuyệt đối **KHÔNG** dùng `http://localhost:3000`.
   - `DATABASE_URL`: Trỏ đến PostgreSQL server thực tế của bạn.
   - `CLOUDINARY_...`: Các biến kết nối thư viện ảnh.
4. Sau khi Add đầy đủ, chuyển sang tab **Deployments** -> Bấm dấu 3 chấm -> Chọn **Redeploy** để Vercel nhận cấu hình mới.

Xem thêm: [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).