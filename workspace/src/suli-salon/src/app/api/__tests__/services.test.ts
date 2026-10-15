import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  default: {
    service: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/cloudinary", () => ({
  deleteImages: vi.fn(),
  extractCloudinaryUrls: vi.fn().mockReturnValue([]),
}));

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { GET as getServices, POST as createService, servicePayload } from "../services/route";
import { GET as getServiceBySlug, PUT as updateService, DELETE as deleteService } from "../services/[slug]/route";
import { NextResponse } from "next/server";

describe("/api/services and /api/services/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("servicePayload helper", () => {
    it("should accept valid service body and return sanitized object", () => {
      const payload = {
        slug: "son-gel-cao-cap",
        name: "Sơn Gel Cao Cấp",
        categoryId: "cat-1",
        price: "250.000 VNĐ",
        duration: 60,
        gallery: ["https://example.com/img1.jpg"],
        isActive: true,
      };
      const result = servicePayload(payload);
      expect(result).not.toBeNull();
      expect(result?.slug).toBe("son-gel-cao-cap");
      expect(result?.duration).toBe(60);
    });

    it("should reject invalid service body", () => {
      expect(servicePayload(null)).toBeNull();
      expect(servicePayload({})).toBeNull();
      expect(servicePayload({ slug: "", name: "No slug" })).toBeNull();
      // Invalid duration (> 1440 mins)
      expect(servicePayload({
        slug: "test",
        name: "Test",
        categoryId: "cat-1",
        price: "100k",
        duration: 2000,
        gallery: [],
      })).toBeNull();
    });
  });

  describe("GET /api/services", () => {
    it("should return services with parsed gallery JSON", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.service.findMany).mockResolvedValue([
        {
          id: "srv-1",
          slug: "son-gel",
          name: "Sơn Gel",
          gallery: JSON.stringify(["https://example.com/1.jpg"]),
        } as never,
      ]);

      const res = await getServices();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].gallery).toEqual(["https://example.com/1.jpg"]);
    });
  });

  describe("POST /api/services", () => {
    it("should return 400 when invalid payload is submitted", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const req = new Request("http://localhost/api/services", {
        method: "POST",
        body: JSON.stringify({ invalid: true }),
      });

      const res = await createService(req);
      expect(res.status).toBe(400);
    });

    it("should create service successfully", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.service.create).mockResolvedValue({ id: "srv-new", slug: "ve-mong" } as never);

      const req = new Request("http://localhost/api/services", {
        method: "POST",
        body: JSON.stringify({
          slug: "ve-mong",
          name: "Vẽ Móng Nghệ Thuật",
          categoryId: "cat-1",
          price: "150.000 VNĐ",
          duration: 45,
          gallery: [],
        }),
      });

      const res = await createService(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.service.slug).toBe("ve-mong");
    });
  });

  describe("GET /api/services/[slug]", () => {
    it("should return 404 when service not found", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.service.findUnique).mockResolvedValue(null);

      const req = new Request("http://localhost/api/services/not-found");
      const res = await getServiceBySlug(req, { params: Promise.resolve({ slug: "not-found" }) });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/services/[slug]", () => {
    it("should delete service and return success", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.service.findUnique).mockResolvedValue({
        slug: "son-gel",
        image: "https://example.com/srv.jpg",
        gallery: "[]",
        description: "",
      } as never);
      vi.mocked(prisma.service.delete).mockResolvedValue({ slug: "son-gel" } as never);

      const req = new Request("http://localhost/api/services/son-gel", { method: "DELETE" });
      const res = await deleteService(req, { params: Promise.resolve({ slug: "son-gel" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });
});
