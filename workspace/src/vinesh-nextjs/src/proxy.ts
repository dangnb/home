import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/assets') ||
        pathname.includes('.') ||
        pathname.startsWith('/_next')
    ) {
        return NextResponse.next();
    }

    // Detect /[lang] (2-5 letter language code, e.g. vi, en, eng, zh-CN)
    const pathnameHasLocale = /^\/[a-zA-Z0-9-]{2,6}(?:\/|$)/.test(pathname);
    if (pathnameHasLocale) return NextResponse.next();

    request.nextUrl.pathname = `/vi${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
