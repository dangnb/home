import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/db", () => ({
  createContact: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  contactRateLimiter: {
    check: vi.fn(),
  },
}));

import { createContact } from "@/lib/db";
import { contactRateLimiter } from "@/lib/rate-limit";
import { POST } from "../contact/route";
import { NextRequest } from "next/server";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 429 when rate limit is exceeded", async () => {
    vi.mocked(contactRateLimiter.check).mockReturnValue(false);

    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Khách", message: "Chào salon" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("quá nhiều yêu cầu");
  });

  it("should return 400 when validation fails (short message or invalid email)", async () => {
    vi.mocked(contactRateLimiter.check).mockReturnValue(true);

    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A",
        message: "Ngắn",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should return 400 when honeypot website field is filled by bot", async () => {
    vi.mocked(contactRateLimiter.check).mockReturnValue(true);

    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot User",
        message: "Hello this is a genuine message from bot",
        website: "http://spam.com",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should successfully save contact and return 200", async () => {
    vi.mocked(contactRateLimiter.check).mockReturnValue(true);
    vi.mocked(createContact).mockResolvedValue({ id: "cnt-1" } as never);

    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mai Lan",
        email: "lan@example.com",
        phone: "0988123456",
        subject: "Hỏi về khóa học làm móng",
        message: "Salon cho mình hỏi học phí khóa vẽ móng cơ bản nhé.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true });
    expect(createContact).toHaveBeenCalledWith({
      name: "Mai Lan",
      email: "lan@example.com",
      phone: "0988123456",
      subject: "Hỏi về khóa học làm móng",
      message: "Salon cho mình hỏi học phí khóa vẽ móng cơ bản nhé.",
    });
  });

  it("should return 500 when database save fails", async () => {
    vi.mocked(contactRateLimiter.check).mockReturnValue(true);
    vi.mocked(createContact).mockRejectedValue(new Error("DB Error"));

    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mai Lan",
        message: "Salon cho mình hỏi học phí khóa vẽ móng cơ bản nhé.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Có lỗi xảy ra");
  });
});
