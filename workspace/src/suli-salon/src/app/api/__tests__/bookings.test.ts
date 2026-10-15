import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    appointment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  bookingRateLimiter: {
    check: vi.fn(),
  },
}));

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { bookingRateLimiter } from "@/lib/rate-limit";
import { GET, POST } from "../bookings/route";
import { NextResponse } from "next/server";

describe("POST and GET /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/bookings", () => {
    it("should return 401 if unauthorized", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const res = await GET();
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toEqual({ error: "Unauthorized" });
    });

    it("should return appointments list if admin", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const mockBookings = [
        { id: "b1", customerName: "Lan", phone: "0988123456", serviceName: "Nail Art", createdAt: new Date() },
      ];
      vi.mocked(prisma.appointment.findMany).mockResolvedValue(mockBookings as never);

      const res = await GET();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].customerName).toBe("Lan");
    });
  });

  describe("POST /api/bookings", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    it("should return 429 when rate limit is exceeded", async () => {
      vi.mocked(bookingRateLimiter.check).mockReturnValue(false);

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.error).toContain("Too many requests");
    });

    it("should return 400 when validation fails", async () => {
      vi.mocked(bookingRateLimiter.check).mockReturnValue(true);

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "A", // too short
          phone: "123", // invalid
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it("should create appointment and return 200 on valid input", async () => {
      vi.mocked(bookingRateLimiter.check).mockReturnValue(true);
      vi.mocked(prisma.appointment.create).mockResolvedValue({
        id: "b2",
        customerName: "Nguyễn Thu Hà",
        phone: "0988123456",
        email: "ha@example.com",
        serviceName: "Sơn Gel Cao Cấp",
        date: tomorrowStr,
        time: "10:00",
        note: "Móng ngắn",
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Nguyễn Thu Hà",
          phone: "0988123456",
          email: "ha@example.com",
          serviceName: "Sơn Gel Cao Cấp",
          date: tomorrowStr,
          time: "10:00",
          note: "Móng ngắn",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });
      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          customerName: "Nguyễn Thu Hà",
          phone: "0988123456",
          serviceName: "Sơn Gel Cao Cấp",
          status: "new",
        }),
      });
    });

    it("should return 500 if database creation throws an error", async () => {
      vi.mocked(bookingRateLimiter.check).mockReturnValue(true);
      vi.mocked(prisma.appointment.create).mockRejectedValue(new Error("Database crash"));

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Trần Văn B",
          phone: "0912345678",
          serviceName: "Chăm Sóc Móng",
          date: tomorrowStr,
          time: "14:00",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({ error: "Booking failed" });
    });
  });
});
