"use server";

// Server Actions for Admin Authentication (simple demo auth)

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

/**
 * Login admin user
 */
export async function loginAdmin(email: string, password: string) {
  try {
    const user = await db.adminUser.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Set a simple session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Login failed" };
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Check if admin is authenticated
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  const user = await db.adminUser.findUnique({
    where: { id: sessionId },
    select: { id: true, email: true, name: true },
  });

  return user;
}
