import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getOrInitAdminCredentials,
  getServerAdminSession,
  updateAdminCredentials,
  verifyPassword,
} from "@/lib/adminAuth";

interface AttemptRecord {
  count: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 3 * 60 * 1000; // 3 minutes

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local-client";
}

export async function GET() {
  const session = await getServerAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const creds = getOrInitAdminCredentials();
  return NextResponse.json({
    authenticated: true,
    username: session.username || creds.username,
    updatedAt: creds.updatedAt,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action: string };

    if (action === "login") {
      const clientKey = getClientKey(request);
      const now = Date.now();
      const attempt = loginAttempts.get(clientKey);

      if (attempt && attempt.lockedUntil > now) {
        const remainingSec = Math.ceil((attempt.lockedUntil - now) / 1000);
        return NextResponse.json(
          {
            error: `Tài khoản tạm khóa bảo mật do nhập sai nhiều lần. Vui lòng thử lại sau ${remainingSec} giây.`,
          },
          { status: 429 }
        );
      }

      const { username = "", password = "" } = body as {
        username?: string;
        password?: string;
      };

      const isValid = verifyPassword(username, password);
      if (!isValid) {
        const prevCount =
          attempt && attempt.lockedUntil <= now ? attempt.count : 0;
        const nextCount = prevCount + 1;
        const lockedUntil =
          nextCount >= MAX_ATTEMPTS ? now + LOCK_DURATION_MS : 0;

        loginAttempts.set(clientKey, { count: nextCount, lockedUntil });

        const attemptsLeft = Math.max(0, MAX_ATTEMPTS - nextCount);
        return NextResponse.json(
          {
            error:
              attemptsLeft > 0
                ? `Tên đăng nhập hoặc mật khẩu không chính xác (còn ${attemptsLeft} lần thử).`
                : "Nhập sai quá 5 lần. Hệ thống đã tạm khóa 3 phút để bảo vệ tài khoản.",
          },
          { status: 401 }
        );
      }

      loginAttempts.delete(clientKey);
      const token = createSessionToken(username.trim());
      const res = NextResponse.json({
        success: true,
        username: username.trim(),
      });

      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      });

      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ success: true });
      res.cookies.set(ADMIN_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    if (action === "change-password") {
      const session = await getServerAdminSession();
      if (!session.authenticated) {
        return NextResponse.json(
          { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." },
          { status: 401 }
        );
      }

      const {
        currentPassword = "",
        newUsername = "",
        newPassword = "",
      } = body as {
        currentPassword?: string;
        newUsername?: string;
        newPassword?: string;
      };

      const creds = getOrInitAdminCredentials();
      if (!verifyPassword(creds.username, currentPassword)) {
        return NextResponse.json(
          { error: "Mật khẩu hiện tại không chính xác." },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: "Mật khẩu mới phải có ít nhất 6 ký tự." },
          { status: 400 }
        );
      }

      const targetUser = newUsername.trim() || creds.username;
      const updatedOk = updateAdminCredentials(targetUser, newPassword);
      if (!updatedOk) {
        return NextResponse.json(
          { error: "Không thể lưu thông tin bảo mật mới." },
          { status: 500 }
        );
      }

      const freshToken = createSessionToken(targetUser);
      const res = NextResponse.json({
        success: true,
        username: targetUser,
        message: "Đã cập nhật thông tin đăng nhập & khóa bảo mật mới.",
      });

      res.cookies.set(ADMIN_COOKIE_NAME, freshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      });

      return res;
    }

    return NextResponse.json(
      { error: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Admin Auth API Error:", err);
    return NextResponse.json(
      { error: "Lỗi máy chủ xác thực." },
      { status: 500 }
    );
  }
}
