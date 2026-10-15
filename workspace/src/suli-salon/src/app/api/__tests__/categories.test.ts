import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    category: {
      findMany: vi.fn(),
      create: vi.fn(),
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
import { GET, POST } from "../categories/route";
import { PUT, DELETE } from "../categories/[id]/route";
import { NextResponse } from "next/server";

describe("/api/categories and /api/categories/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("should return 401 when unauthorized", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("should return categories list when authorized as admin", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.category.findMany).mockResolvedValue([
        { id: "cat-1", label: "Móng Tay", slug: "mong-tay", description: "", order: 1 } as never,
      ]);

      const res = await GET();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].slug).toBe("mong-tay");
    });
  });

  describe("POST /api/categories", () => {
    it("should return 400 when label or slug is missing", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const req = new Request("http://localhost/api/categories", {
        method: "POST",
        body: JSON.stringify({ label: "", slug: "" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Tên và đường dẫn danh mục là bắt buộc");
    });

    it("should create category when valid data provided", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.category.create).mockResolvedValue({
        id: "cat-new",
        label: "Nail Art",
        slug: "nail-art",
        description: "Vẽ móng nghệ thuật",
      } as never);

      const req = new Request("http://localhost/api/categories", {
        method: "POST",
        body: JSON.stringify({
          label: "Nail Art",
          slug: "nail-art",
          description: "Vẽ móng nghệ thuật",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.category.slug).toBe("nail-art");
    });
  });

  describe("PUT /api/categories/[id]", () => {
    it("should update category and return 200", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.category.update).mockResolvedValue({ id: "cat-1" } as never);

      const req = new Request("http://localhost/api/categories/cat-1", {
        method: "PUT",
        body: JSON.stringify({ label: "Móng Tay Đẹp", slug: "mong-tay-dep" }),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "cat-1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "cat-1" },
        data: expect.objectContaining({ label: "Móng Tay Đẹp", slug: "mong-tay-dep" }),
      });
    });
  });

  describe("DELETE /api/categories/[id]", () => {
    it("should delete category and return 200", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.category.delete).mockResolvedValue({ id: "cat-1" } as never);

      const req = new Request("http://localhost/api/categories/cat-1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "cat-1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("should return 404 when target category is not found", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.category.delete).mockRejectedValue(new Error("Record not found"));

      const req = new Request("http://localhost/api/categories/cat-none", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "cat-none" }) });
      expect(res.status).toBe(404);
    });
  });
});
