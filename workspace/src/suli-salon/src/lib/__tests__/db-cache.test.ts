import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma client
vi.mock("../prisma", () => ({
  default: {
    category: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    service: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    setting: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import prisma from "../prisma";
import {
  getCategories,
  getServices,
  getSettings,
  invalidateDbCache,
} from "../db";

describe("db.ts - In-Memory Cache and DB Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    invalidateDbCache();
  });

  describe("getCategories cache behavior", () => {
    it("should fetch from prisma on initial call and use memory cache on subsequent calls", async () => {
      const mockCategories = [
        { id: "cat-1", label: "Móng Tay", slug: "mong-tay", description: "Chăm sóc tay", order: 1 },
      ];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

      // First call -> hits DB
      const result1 = await getCategories();
      expect(result1).toHaveLength(1);
      expect(result1[0].slug).toBe("mong-tay");
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);

      // Second call -> returns cached result without querying DB again
      const result2 = await getCategories();
      expect(result2).toEqual(result1);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });

    it("should re-query database after invalidateDbCache is called", async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([]);

      await getCategories();
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);

      // Invalidate cache
      invalidateDbCache();

      await getCategories();
      expect(prisma.category.findMany).toHaveBeenCalledTimes(2);
    });

    it("should gracefully handle database errors and fallback safely", async () => {
      vi.mocked(prisma.category.findMany).mockRejectedValue(new Error("DB Connection Error"));

      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("getServices cache behavior", () => {
    it("should parse gallery JSON and return active services from cache", async () => {
      const mockServices = [
        {
          id: "srv-1",
          slug: "son-gel",
          name: "Sơn Gel Mộc",
          categoryId: "cat-1",
          description: "Móng gel bền đẹp",
          duration: 45,
          price: "250.000 VNĐ",
          promoPrice: null,
          image: "https://example.com/srv1.jpg",
          gallery: JSON.stringify(["https://example.com/g1.jpg"]),
          isActive: true,
          order: 1,
        },
      ];
      vi.mocked(prisma.service.findMany).mockResolvedValue(mockServices);

      const services = await getServices();
      expect(services).toHaveLength(1);
      expect(services[0].gallery).toEqual(["https://example.com/g1.jpg"]);
      expect(prisma.service.findMany).toHaveBeenCalledTimes(1);

      // Cached call
      await getServices();
      expect(prisma.service.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSettings behavior", () => {
    it("should deduplicate in-flight concurrent requests to prevent DB connection stampedes", async () => {
      let resolveQuery!: (val: unknown) => void;
      const slowQuery = new Promise((resolve) => {
        resolveQuery = resolve;
      });
      vi.mocked(prisma.setting.findMany).mockImplementation(() => slowQuery as never);

      // Fire 3 concurrent requests while the query is in flight
      const p1 = getSettings();
      const p2 = getSettings();
      const p3 = getSettings();

      resolveQuery([{ key: "hotline", value: "0796 768 636" }]);

      const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
      expect(r1.hotline).toBe("0796 768 636");
      expect(r2.hotline).toBe("0796 768 636");
      expect(r3.hotline).toBe("0796 768 636");
      // Only 1 DB query was made despite 3 concurrent calls
      expect(prisma.setting.findMany).toHaveBeenCalledTimes(1);
    });

    it("should filter out legacy cruise keywords and apply salon defaults", async () => {
      vi.mocked(prisma.setting.findMany).mockResolvedValue([
        { key: "siteName", value: "Mộc Salon Luxury" },
        { key: "hotline", value: "0796 768 636" },
        // Legacy cruise values that must be ignored
        { key: "siteName", value: "Du Thuyền Sông Hàn Suli" },
      ]);

      const settings = await getSettings();
      expect(settings.hotline).toBe("0796 768 636");
      expect(settings.siteName).not.toContain("Suli");
    });
  });
});
