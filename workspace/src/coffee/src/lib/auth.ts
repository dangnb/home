import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "moc_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getSecret() {
  return process.env.SESSION_SECRET || "development-only-secret-change-me";
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(signature).toString("base64url");
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function createSession(adminId: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${adminId}.${expiresAt}`;
  const signature = await sign(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) {
    return null;
  }

  const parts = session.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [adminId, expiresAtRaw, signature] = parts;
  const payload = `${adminId}.${expiresAtRaw}`;
  const expectedSignature = await sign(payload);
  const expiresAt = Number(expiresAtRaw);

  if (signature !== expectedSignature || !expiresAt || expiresAt < Date.now()) {
    return null;
  }

  return db.adminUser.findFirst({ where: { id: adminId, isActive: true } });
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
