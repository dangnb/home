// src/lib/auth.ts
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SECRET = process.env.ADMIN_SECRET ?? "duthuyensonghan_secret_2025";

export function generateToken(): string {
  return Buffer.from(`${SECRET}:${Date.now()}`).toString("base64");
}

export function validateToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${SECRET}:`);
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return validateToken(token);
}

export { SESSION_COOKIE };
