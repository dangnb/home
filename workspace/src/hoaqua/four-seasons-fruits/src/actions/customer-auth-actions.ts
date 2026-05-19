"use server";

// Server Actions for Customer Authentication

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const CUSTOMER_COOKIE = "customer_session";

/**
 * Register a new customer
 */
export async function registerCustomer(name: string, email: string, password: string) {
  try {
    const existing = await db.customer.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email đã được sử dụng" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await db.customer.create({
      data: { name, email, password: hashedPassword },
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE, customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    console.error("Register failed:", error);
    return { success: false, error: "Đăng ký thất bại" };
  }
}

/**
 * Login customer
 */
export async function loginCustomer(email: string, password: string) {
  try {
    const customer = await db.customer.findUnique({ where: { email } });
    if (!customer) {
      return { success: false, error: "Email hoặc mật khẩu không đúng" };
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return { success: false, error: "Email hoặc mật khẩu không đúng" };
    }

    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE, customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Đăng nhập thất bại" };
  }
}

/**
 * Logout customer
 */
export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
}

/**
 * Get current customer session
 */
export async function getCustomerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!sessionId) return null;

  const customer = await db.customer.findUnique({
    where: { id: sessionId },
    select: { id: true, name: true, email: true, avatar: true },
  });

  return customer;
}
