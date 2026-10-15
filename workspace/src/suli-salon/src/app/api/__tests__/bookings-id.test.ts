import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    appointment: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PATCH, DELETE } from "../bookings/[id]/route";
import { NextResponse } from "next/server";

describe("PATCH and DELETE /api/bookings/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PATCH /api/bookings/[id]", () => {
    it("should return 401 if not admin", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const req = new Request("http://localhost/api/bookings/b1", {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "b1" }) });
      expect(res.status).toBe(401);
    });

    it("should return 400 for invalid status", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const req = new Request("http://localhost/api/bookings/b1", {
        method: "PATCH",
        body: JSON.stringify({ status: "invalid_status" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "b1" }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Trạng thái không hợp lệ");
    });

    it("should update status and return 200 on valid status", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.appointment.update).mockResolvedValue({
        id: "b1",
        status: "confirmed",
      } as never);

      const req = new Request("http://localhost/api/bookings/b1", {
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "b1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: { id: "b1" },
        data: { status: "confirmed" },
      });
    });

    it("should return 404 if booking not found in DB", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.appointment.update).mockRejectedValue(new Error("Record not found"));

      const req = new Request("http://localhost/api/bookings/b_none", {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "b_none" }) });
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Not found");
    });
  });

  describe("DELETE /api/bookings/[id]", () => {
    it("should delete appointment when admin calls", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.appointment.delete).mockResolvedValue({ id: "b1" } as never);

      const req = new Request("http://localhost/api/bookings/b1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "b1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.appointment.delete).toHaveBeenCalledWith({ where: { id: "b1" } });
    });

    it("should return 404 if deletion target does not exist", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.appointment.delete).mockRejectedValue(new Error("Record not found"));

      const req = new Request("http://localhost/api/bookings/b_not_found", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "b_not_found" }) });
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Not found");
    });
  });
});
