import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("../prisma", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  compare: vi.fn(),
}));

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

import prisma from "../prisma";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions, requireAdmin } from "../auth";

describe("auth.ts - NextAuth and Admin Guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Credentials Provider authorize()", () => {
    const rawProvider = authOptions.providers[0] as unknown as {
      authorize?: (credentials: Record<string, string> | undefined) => Promise<unknown>;
      options?: {
        authorize: (credentials: Record<string, string> | undefined) => Promise<unknown>;
      };
    };
    const authorize = (rawProvider.options?.authorize || rawProvider.authorize)!;

    it("should throw error if email or password is missing", async () => {
      await expect(authorize(undefined)).rejects.toThrow("Vui lòng nhập đầy đủ email và mật khẩu.");
      await expect(authorize({ email: "", password: "123" })).rejects.toThrow("Vui lòng nhập đầy đủ email và mật khẩu.");
      await expect(authorize({ email: "admin@mocsalon.vn", password: "" })).rejects.toThrow("Vui lòng nhập đầy đủ email và mật khẩu.");
    });

    it("should throw error if user is not found in database", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

      await expect(
        authorize({ email: "notfound@mocsalon.vn", password: "password123" })
      ).rejects.toThrow("Tài khoản email này không tồn tại trong hệ thống.");
    });

    it("should throw error if password comparison fails", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: "usr-1",
        email: "admin@mocsalon.vn",
        password: "hashed_password",
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(compare).mockResolvedValue(false as never);

      await expect(
        authorize({ email: "admin@mocsalon.vn", password: "wrongpassword" })
      ).rejects.toThrow("Mật khẩu không chính xác. Vui lòng kiểm tra lại!");
    });

    it("should return user object when credentials match", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: "usr-1",
        email: "admin@mocsalon.vn",
        password: "hashed_password",
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(compare).mockResolvedValue(true as never);

      const user = await authorize({ email: "admin@mocsalon.vn", password: "correctpassword" });
      expect(user).toEqual({
        id: "usr-1",
        email: "admin@mocsalon.vn",
        name: "Admin User",
        role: "admin",
      });
    });
  });

  describe("NextAuth callbacks", () => {
    it("should populate jwt token with user role and id", async () => {
      const jwtCallback = authOptions.callbacks?.jwt;
      if (!jwtCallback) throw new Error("jwt callback not found");

      const token = await jwtCallback({
        token: {},
        user: { id: "usr-10", role: "admin", email: "admin@mocsalon.vn" },
        account: null,
      });

      expect(token.role).toBe("admin");
      expect(token.id).toBe("usr-10");
    });

    it("should attach role and id from token to session.user", async () => {
      const sessionCallback = authOptions.callbacks?.session;
      if (!sessionCallback) throw new Error("session callback not found");

      const session = await sessionCallback({
        session: { user: { name: "Admin", email: "admin@mocsalon.vn" }, expires: "2099-01-01" },
        token: { role: "admin", id: "usr-10" },
        user: { id: "usr-10", role: "admin" } as never,
        newSession: false as never,
        trigger: "update" as never,
      });

      expect(session.user?.role).toBe("admin");
      expect(session.user?.id).toBe("usr-10");
    });
  });

  describe("requireAdmin() route protection guard", () => {
    it("should return 401 Unauthorized when there is no active session", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await requireAdmin();
      expect(result.response?.status).toBe(401);
      const json = await result.response?.json();
      expect(json).toEqual({ error: "Unauthorized" });
    });

    it("should return 403 Forbidden when user is not admin", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "staff", email: "staff@mocsalon.vn" },
        expires: "2099-01-01",
      });

      const result = await requireAdmin();
      expect(result.response?.status).toBe(403);
      const json = await result.response?.json();
      expect(json).toEqual({ error: "Forbidden" });
    });

    it("should return session when user has admin role", async () => {
      const mockSession = {
        user: { role: "admin", email: "admin@mocsalon.vn" },
        expires: "2099-01-01",
      };
      vi.mocked(getServerSession).mockResolvedValue(mockSession);

      const result = await requireAdmin();
      expect(result.response).toBeUndefined();
      expect(result.session).toBe(mockSession);
    });
  });
});
