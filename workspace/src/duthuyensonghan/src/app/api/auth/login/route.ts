import { NextRequest, NextResponse } from "next/server";
import { generateToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "admin123";

  if (username !== expectedUser || password !== expectedPass) {
    return Response.json({ error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
  }

  const token = generateToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
  return res;
}
