import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getCustomers: vi.fn(),
  getCustomerById: vi.fn(),
  saveCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    appointment: {
      findMany: vi.fn(),
    },
  },
}));

import { requireAdmin } from "@/lib/auth";
import { getCustomers, getCustomerById, saveCustomer, deleteCustomer } from "@/lib/db";
import prisma from "@/lib/prisma";
import { GET as getCustomersApi, POST as createCustomerApi } from "../customers/route";
import { GET as getCustomerDetailApi, DELETE as deleteCustomerApi } from "../customers/[id]/route";

describe("/api/customers and /api/customers/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/customers", () => {
    const mockList = [
      { id: "c1", name: "Elena Minh Anh", phone: "0988654321", tier: "diamond", tags: ["VIP"] },
      { id: "c2", name: "Trần Thu Hương", phone: "0912345678", tier: "gold", tags: ["Văn phòng"] },
    ];

    it("should filter customers by query string q", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(getCustomers).mockResolvedValue(mockList as never);

      const req = new Request("http://localhost/api/customers?q=elena");
      const res = await getCustomersApi(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe("Elena Minh Anh");
    });

    it("should filter customers by membership tier", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(getCustomers).mockResolvedValue(mockList as never);

      const req = new Request("http://localhost/api/customers?tier=gold");
      const res = await getCustomersApi(req);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].tier).toBe("gold");
    });
  });

  describe("POST /api/customers", () => {
    it("should return 400 when customer name is missing", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });

      const req = new Request("http://localhost/api/customers", {
        method: "POST",
        body: JSON.stringify({ name: "", phone: "0988123456" }),
      });

      const res = await createCustomerApi(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Họ tên");
    });

    it("should save customer and return 200 on valid input", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(saveCustomer).mockResolvedValue({
        id: "c-new",
        name: "Lê Thị Thảo",
        phone: "0988123456",
        tier: "silver",
      } as never);

      const req = new Request("http://localhost/api/customers", {
        method: "POST",
        body: JSON.stringify({
          name: "Lê Thị Thảo",
          phone: "0988123456",
          tier: "silver",
        }),
      });

      const res = await createCustomerApi(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.customer.name).toBe("Lê Thị Thảo");
    });
  });

  describe("GET /api/customers/[id]", () => {
    it("should return 404 when customer not found", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(getCustomerById).mockResolvedValue(null);

      const req = new Request("http://localhost/api/customers/c_none");
      const res = await getCustomerDetailApi(req, { params: Promise.resolve({ id: "c_none" }) });
      expect(res.status).toBe(404);
    });

    it("should return customer and matching appointments", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(getCustomerById).mockResolvedValue({
        id: "c1",
        name: "Minh Anh",
        phone: "0988654321",
      } as never);
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([
        { id: "a1", phone: "0988 654 321", serviceName: "Nail Art" } as never,
      ]);

      const req = new Request("http://localhost/api/customers/c1");
      const res = await getCustomerDetailApi(req, { params: Promise.resolve({ id: "c1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.customer.name).toBe("Minh Anh");
      expect(data.appointments).toHaveLength(1);
    });
  });

  describe("DELETE /api/customers/[id]", () => {
    it("should return 200 when deleteCustomer succeeds", async () => {
      vi.mocked(requireAdmin).mockResolvedValue({
        session: { user: { role: "admin" } } as never,
      });
      vi.mocked(deleteCustomer).mockResolvedValue(true);

      const req = new Request("http://localhost/api/customers/c1", { method: "DELETE" });
      const res = await deleteCustomerApi(req, { params: Promise.resolve({ id: "c1" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });
});
