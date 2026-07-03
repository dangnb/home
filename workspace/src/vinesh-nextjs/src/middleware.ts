import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware bảo mật — Edge Runtime
 * 1. Bảo vệ /admin routes (chỉ cho phép user đã đăng nhập với role ADMIN/EDITOR)
 * 2. Chặn truy cập API nguy hiểm (seed, setup) trên production
 * 3. Thêm Security Headers cho mọi response
 * 4. Rate limiting đơn giản cho API contact (dùng IP-based tracking)
 */

// In-memory rate limit store (resets khi edge cold start, đủ tốt cho mỗi region)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 phút
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests / phút cho contact

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }
    return false;
}

// Security Headers
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Chống clickjacking
    response.headers.set("X-Frame-Options", "DENY");
    // Chống MIME-type sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");
    // Chống XSS (legacy browsers)
    response.headers.set("X-XSS-Protection", "1; mode=block");
    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // Permissions Policy — tắt các tính năng không cần thiết
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );
    // Strict Transport Security (HTTPS)
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    );
    // Content Security Policy cơ bản
    response.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com",
            "frame-src 'self' https://www.google.com https://maps.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join("; ")
    );

    return response;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ═══════════════════════════════════════════
    // 1. CHẶN API NGUY HIỂM TRÊN PRODUCTION
    // ═══════════════════════════════════════════
    if (
        (pathname.startsWith("/api/seed") || pathname.startsWith("/api/setup")) &&
        process.env.NODE_ENV === "production"
    ) {
        return addSecurityHeaders(
            NextResponse.json(
                { error: "Forbidden: API này bị vô hiệu hóa trên production." },
                { status: 403 }
            )
        );
    }

    // ═══════════════════════════════════════════
    // 2. RATE LIMITING CHO API CONTACT
    // ═══════════════════════════════════════════
    if (pathname === "/api/contact" && request.method === "POST") {
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        if (isRateLimited(ip)) {
            return addSecurityHeaders(
                NextResponse.json(
                    { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
                    { status: 429 }
                )
            );
        }
    }

    // ═══════════════════════════════════════════
    // 3. BẢO VỆ ADMIN ROUTES
    // ═══════════════════════════════════════════
    if (pathname.startsWith("/admin")) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // Chưa đăng nhập → redirect về login
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return addSecurityHeaders(NextResponse.redirect(loginUrl));
        }

        // Đã đăng nhập nhưng không có quyền
        const role = token.role as string;
        if (role !== "ADMIN" && role !== "EDITOR") {
            return addSecurityHeaders(
                NextResponse.json(
                    { error: "Forbidden: Bạn không có quyền truy cập khu vực quản trị." },
                    { status: 403 }
                )
            );
        }
    }

    // ═══════════════════════════════════════════
    // 4. THÊM SECURITY HEADERS CHO TẤT CẢ RESPONSES
    // ═══════════════════════════════════════════
    const response = NextResponse.next();
    return addSecurityHeaders(response);
}

export const config = {
    matcher: [
        // Admin routes
        "/admin/:path*",
        // API routes cần bảo vệ
        "/api/seed/:path*",
        "/api/setup/:path*",
        "/api/contact/:path*",
        // Tất cả các trang (tránh static files)
        "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
    ],
};
