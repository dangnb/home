import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Proxy — Next.js 16 (thay thế middleware)
 * Xử lý:
 * 1. Locale redirect (/ → /vi)
 * 2. Bảo vệ /admin routes (JWT check)
 * 3. Chặn API nguy hiểm trên production
 * 4. Rate limiting cho /api/contact
 * 5. Thêm Security Headers cho mọi response
 */

// ── Rate Limit Store (in-memory, đủ tốt cho edge runtime)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 phút
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests / phút

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ── Security Headers
function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    );
    response.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
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

export async function proxy(request: NextRequest) {
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

        // Cho phép truy cập admin
        return addSecurityHeaders(NextResponse.next());
    }

    // ═══════════════════════════════════════════
    // 4. SKIP STATIC FILES, API, LOGIN, ASSETS
    // ═══════════════════════════════════════════
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/assets') ||
        pathname.includes('.') ||
        pathname.startsWith('/_next')
    ) {
        return addSecurityHeaders(NextResponse.next());
    }

    // ═══════════════════════════════════════════
    // 5. LOCALE REDIRECT (/ → /vi)
    // ═══════════════════════════════════════════
    const pathnameHasLocale = /^\/[a-zA-Z0-9-]{2,6}(?:\/|$)/.test(pathname);
    if (pathnameHasLocale) {
        return addSecurityHeaders(NextResponse.next());
    }

    // Redirect to default locale /vi
    request.nextUrl.pathname = `/vi${pathname === '/' ? '' : pathname}`;
    return addSecurityHeaders(NextResponse.redirect(request.nextUrl));
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
