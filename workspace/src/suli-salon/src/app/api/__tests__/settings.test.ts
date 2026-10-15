import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getSettings: vi.fn(),
  invalidateDbCache: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: vi.fn(),
    setting: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { requireAdmin } from "@/lib/auth";
import { getSettings, invalidateDbCache } from "@/lib/db";
import prisma from "@/lib/prisma";
import { GET, POST } from "../settings/route";
import { NextResponse } from "next/server";

describe("GET and POST /api/settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/settings", () => {
    it("should return 401 when not authorized", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("should return site settings when admin", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(getSettings).mockResolvedValue({
        siteName: "Mộc Salon",
        hotline: "0988 123 456",
      } as never);

      const res = await GET();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.siteName).toBe("Mộc Salon");
    });
  });

  describe("POST /api/settings", () => {
    it("should reject when body contains no recognized setting keys", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const req = new Request("http://localhost/api/settings", {
        method: "POST",
        body: JSON.stringify({ randomUnknownField: "test" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Không tìm thấy cấu hình");
    });

    it("should save settings, clear cache, and return 200", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(prisma.$transaction).mockResolvedValue([] as never);

      const req = new Request("http://localhost/api/settings", {
        method: "POST",
        body: JSON.stringify({
          siteName: "Mộc Salon Luxury",
          hotline: "0796 768 636",
          popupEnabled: true,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(invalidateDbCache).toHaveBeenCalled();
    });
  });
});
