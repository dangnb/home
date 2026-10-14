import { NextRequest, NextResponse } from "next/server";
import { getPreferredLocale, isLocale } from "@/lib/i18n/config";
import { getLegacyPath } from "@/lib/i18n/routes";

const EXCLUDED_PREFIXES = ["/admin", "/admin-login", "/api", "/_next", "/favicon", "/sitemap", "/robots"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) return NextResponse.next();

  const referer = request.headers.get("referer");
  let refererLocale = "";
  if (referer) {
    try {
      refererLocale = new URL(referer).pathname.split("/")[1] || "";
    } catch {
      refererLocale = "";
    }
  }
  const locale = isLocale(refererLocale)
    ? refererLocale
    : getPreferredLocale(request.headers.get("accept-language"));
  const destination = getLegacyPath(locale, pathname);

  if (!destination) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url);
}

export default proxy;

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
