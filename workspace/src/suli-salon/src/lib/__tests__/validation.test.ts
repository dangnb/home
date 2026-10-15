import { describe, it, expect } from "vitest";
import {
  bookingSchema,
  contactSchema,
  appointmentStatusSchema,
  getClientIp,
  parseJsonBody,
} from "../validation";

describe("validation.ts - Schema and Helpers", () => {
  describe("bookingSchema", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    it("should accept valid booking with Vietnamese phone numbers", () => {
      const validCases = [
        { phone: "0988123456", format: "standard 09" },
        { phone: "0345678901", format: "standard 03" },
        { phone: "0796768636", format: "standard 07" },
        { phone: "+84988123456", format: "+84 prefix" },
        { phone: "0988 123 456", format: "spaces" },
        { phone: "0988-123-456", format: "dashes" },
      ];

      for (const item of validCases) {
        const payload = {
          customerName: "Nguyễn Văn A",
          phone: item.phone,
          serviceName: "Chăm sóc móng tay",
          date: tomorrowStr,
          time: "10:30 – Buổi sáng",
        };
        const result = bookingSchema.safeParse(payload);
        expect(result.success, `Failed on format: ${item.format}`).toBe(true);
      }
    });

    it("should reject invalid phone numbers", () => {
      const invalidPhones = ["123", "abcdefghij", "012345", "19001560", "++84988123456"];
      for (const phone of invalidPhones) {
        const payload = {
          customerName: "Nguyễn Văn A",
          phone,
          serviceName: "Chăm sóc móng",
          date: tomorrowStr,
          time: "10:00",
        };
        const result = bookingSchema.safeParse(payload);
        expect(result.success).toBe(false);
      }
    });

    it("should accept today or future dates, but reject past dates", () => {
      // Future date
      const validFuture = bookingSchema.safeParse({
        customerName: "Trần B",
        phone: "0912345678",
        serviceName: "Sơn Gel",
        date: tomorrowStr,
        time: "14:00",
      });
      expect(validFuture.success).toBe(true);

      // Today
      const validToday = bookingSchema.safeParse({
        customerName: "Trần B",
        phone: "0912345678",
        serviceName: "Sơn Gel",
        date: todayStr,
        time: "14:00",
      });
      expect(validToday.success).toBe(true);

      // Past date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateStr = pastDate.toISOString().split("T")[0];

      const invalidPast = bookingSchema.safeParse({
        customerName: "Trần B",
        phone: "0912345678",
        serviceName: "Sơn Gel",
        date: pastDateStr,
        time: "14:00",
      });
      expect(invalidPast.success).toBe(false);
      if (!invalidPast.success) {
        expect(invalidPast.error.issues[0].message).toContain("quá khứ");
      }
    });

    it("should require either serviceName or cruiseName", () => {
      // Both missing
      const noService = bookingSchema.safeParse({
        customerName: "Lê C",
        phone: "0987654321",
        date: tomorrowStr,
        time: "09:00",
      });
      expect(noService.success).toBe(false);

      // serviceName provided
      const withServiceName = bookingSchema.safeParse({
        customerName: "Lê C",
        phone: "0987654321",
        serviceName: "Nail Art",
        date: tomorrowStr,
        time: "09:00",
      });
      expect(withServiceName.success).toBe(true);

      // cruiseName provided (backward compat)
      const withCruiseName = bookingSchema.safeParse({
        customerName: "Lê C",
        phone: "0987654321",
        cruiseName: "Spa Pedicure",
        date: tomorrowStr,
        time: "09:00",
      });
      expect(withCruiseName.success).toBe(true);
    });

    it("should sanitize and trim note and optional fields", () => {
      const parsed = bookingSchema.parse({
        customerName: "  Phạm D  ",
        phone: "0912345678",
        serviceName: "Vẽ móng",
        email: "test@example.com",
        date: tomorrowStr,
        time: "15:00",
        note: "  Cần phục hồi móng  ",
      });

      expect(parsed.customerName).toBe("Phạm D");
      expect(parsed.note).toBe("Cần phục hồi móng");
    });
  });

  describe("contactSchema", () => {
    it("should validate a correct contact submission", () => {
      const result = contactSchema.safeParse({
        name: "Hoàng Yến",
        email: "yen@example.com",
        phone: "0988654321",
        subject: "Hỏi về dịch vụ nail art",
        message: "Chào Mộc Salon, mình muốn hỏi về chi phí vẽ móng thiết kế riêng.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject message shorter than 10 characters", () => {
      const result = contactSchema.safeParse({
        name: "Hoàng Yến",
        message: "Alo 123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("10 ký tự");
      }
    });

    it("should catch honeypot spam bot when website field is filled", () => {
      const spamResult = contactSchema.safeParse({
        name: "Spam Bot",
        message: "Check out this free crypto link now!!!",
        website: "https://spamlink.xyz",
      });
      expect(spamResult.success).toBe(false);
    });
  });

  describe("appointmentStatusSchema", () => {
    it("should accept valid appointment statuses", () => {
      expect(appointmentStatusSchema.safeParse("new").success).toBe(true);
      expect(appointmentStatusSchema.safeParse("confirmed").success).toBe(true);
      expect(appointmentStatusSchema.safeParse("completed").success).toBe(true);
      expect(appointmentStatusSchema.safeParse("cancelled").success).toBe(true);
    });

    it("should reject invalid statuses", () => {
      expect(appointmentStatusSchema.safeParse("pending").success).toBe(false);
      expect(appointmentStatusSchema.safeParse("unknown").success).toBe(false);
      expect(appointmentStatusSchema.safeParse(123).success).toBe(false);
    });
  });

  describe("getClientIp", () => {
    it("should extract first IP from comma-separated x-forwarded-for header", () => {
      const headers = new Headers({
        "x-forwarded-for": "118.69.182.50, 10.0.0.1, 192.168.1.1",
      });
      expect(getClientIp(headers)).toBe("118.69.182.50");
    });

    it("should fallback to x-real-ip when x-forwarded-for is missing", () => {
      const headers = new Headers({
        "x-real-ip": "14.161.20.100",
      });
      expect(getClientIp(headers)).toBe("14.161.20.100");
    });

    it("should return 'unknown' if no IP headers are present", () => {
      const headers = new Headers();
      expect(getClientIp(headers)).toBe("unknown");
    });
  });

  describe("parseJsonBody", () => {
    it("should parse valid JSON body from Request", async () => {
      const req = new Request("http://localhost/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Mộc Salon", rating: 5 }),
      });
      const data = await parseJsonBody(req);
      expect(data).toEqual({ name: "Mộc Salon", rating: 5 });
    });

    it("should safely return undefined without throwing when body is malformed", async () => {
      const req = new Request("http://localhost/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "Invalid { json text",
      });
      const data = await parseJsonBody(req);
      expect(data).toBeUndefined();
    });
  });
});
