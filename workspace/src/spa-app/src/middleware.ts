import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'ngochuongspa-super-secret-key');

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isApi = pathname.startsWith('/api');
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    const session = request.cookies.get('session')?.value;
    let isValidSession = false;

    if (session) {
      try {
        await jwtVerify(session, secretKey, { algorithms: ['HS256'] });
        isValidSession = true;
      } catch (error) {
        isValidSession = false;
      }
    }
    
    if (pathname === '/admin/login') {
      if (isValidSession) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    if (!isValidSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
