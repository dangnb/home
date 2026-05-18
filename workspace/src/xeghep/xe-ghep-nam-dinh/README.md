# Xe Ghép Nam Định - Website Clone

Website dịch vụ xe ghép Nam Định - Hà Nội, xây dựng bằng Next.js với đầy đủ backend quản lý.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM, SQLite
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **SEO:** Schema.org, Open Graph, Twitter Cards
- **Tracking:** Google Analytics, Facebook Pixel, TikTok Pixel (cấu hình qua admin)

## Tính năng

### Frontend (Public)
- ✅ Landing page với animation mượt mà (Framer Motion)
- ✅ Hero section với hiệu ứng parallax
- ✅ Bảng giá dịch vụ
- ✅ Section dịch vụ, thanh toán, lý do chọn
- ✅ Blog/tin tức với SEO tối ưu
- ✅ Responsive mobile-first
- ✅ Floating buttons (Zalo + Gọi điện)
- ✅ Schema.org LocalBusiness structured data
- ✅ Tích hợp sẵn Google, Facebook, TikTok Pixel

### Backend (Admin Panel - /admin)
- ✅ Đăng nhập bảo mật (JWT)
- ✅ Dashboard tổng quan
- ✅ Quản lý bài viết (CRUD + SEO fields)
- ✅ Quản lý dịch vụ
- ✅ Quản lý bảng giá
- ✅ Cấu hình website (hotline, địa chỉ, pixel IDs...)

## Cài đặt

```bash
# Clone project
cd xe-ghep-nam-dinh

# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Seed data mẫu
npx tsx prisma/seed.ts

# Chạy dev server
npm run dev
```

## Tài khoản Admin mặc định

- **Email:** admin@xeghepnamdinh.vn
- **Password:** admin123
- **URL:** http://localhost:3000/admin

## Cấu hình Pixel Tracking

Vào Admin Panel → Cấu hình → Điền các ID:
- **Facebook Pixel ID** - Lấy từ Facebook Business Manager
- **Google Analytics ID** - Dạng G-XXXXXXXXXX
- **Google Ads ID** - Cho conversion tracking
- **TikTok Pixel ID** - Lấy từ TikTok Ads Manager

## Cấu trúc thư mục

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes (posts, config, services, prices, auth)
│   ├── blog/           # Blog pages (list + detail)
│   ├── layout.tsx      # Root layout (SEO, tracking scripts)
│   └── page.tsx        # Homepage
├── components/
│   ├── animations/     # FadeIn, ScaleIn, StaggerContainer, CountUp
│   ├── layout/         # Header, Footer, FloatingButtons
│   └── sections/       # Hero, Services, Pricing, Payment, WhyChoose, About
└── lib/
    ├── auth.ts         # JWT helpers
    ├── prisma.ts       # Prisma client
    ├── seo.ts          # SEO utilities + tracking scripts
    └── middleware-auth.ts  # Auth middleware
```

## Deploy

### Vercel (Recommended)
1. Push code lên GitHub
2. Import project vào Vercel
3. Set environment variables (DATABASE_URL, JWT_SECRET)
4. Deploy

### VPS
```bash
npm run build
npm start
```

## SEO & Sale Optimization

- ✅ Meta tags tối ưu cho Google Search
- ✅ Open Graph cho Facebook share
- ✅ Twitter Cards
- ✅ Schema.org LocalBusiness
- ✅ Article schema cho blog posts
- ✅ Facebook Pixel (PageView, Lead events)
- ✅ TikTok Pixel
- ✅ Google Analytics 4
- ✅ Canonical URLs
- ✅ Sitemap-ready structure
