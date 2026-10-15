import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RateLimiter, bookingRateLimiter, contactRateLimiter } from "../rate-limit";

describe("rate-limit.ts - In-Memory Sliding Window Rate Limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should allow requests up to the configured limit", () => {
    const limiter = new RateLimiter(3, 60_000); // 3 reqs per minute
    const ip = "192.168.1.10";

    expect(limiter.check(ip)).toBe(true); // 1st
    expect(limiter.check(ip)).toBe(true); // 2nd
    expect(limiter.check(ip)).toBe(true); // 3rd
  });

  it("should block requests once limit is exceeded within window", () => {
    const limiter = new RateLimiter(2, 60_000);
    const ip = "192.168.1.20";

    expect(limiter.check(ip)).toBe(true); // 1
    expect(limiter.check(ip)).toBe(true); // 2
    expect(limiter.check(ip)).toBe(false); // 3 (exceeded)
    expect(limiter.check(ip)).toBe(false); // 4 (still blocked)
  });

  it("should reset counter after the expiration window passes", () => {
    const limiter = new RateLimiter(2, 30_000); // 30 seconds window
    const ip = "192.168.1.30";

    expect(limiter.check(ip)).toBe(true);
    expect(limiter.check(ip)).toBe(true);
    expect(limiter.check(ip)).toBe(false); // blocked

    // Advance time by 30.1 seconds
    vi.advanceTimersByTime(30_100);

    // Counter resets, request is allowed again
    expect(limiter.check(ip)).toBe(true);
  });

  it("should track distinct IPs independently", () => {
    const limiter = new RateLimiter(2, 60_000);
    const ip1 = "10.0.0.1";
    const ip2 = "10.0.0.2";

    expect(limiter.check(ip1)).toBe(true);
    expect(limiter.check(ip1)).toBe(true);
    expect(limiter.check(ip1)).toBe(false); // ip1 exceeded

    // ip2 should still be allowed
    expect(limiter.check(ip2)).toBe(true);
    expect(limiter.check(ip2)).toBe(true);
    expect(limiter.check(ip2)).toBe(false); // ip2 exceeded
  });

  it("should verify global bookingRateLimiter and contactRateLimiter instances exist and function", () => {
    const testIp = `test-ip-${Date.now()}`;
    expect(bookingRateLimiter.check(testIp)).toBe(true);
    expect(contactRateLimiter.check(testIp)).toBe(true);
  });
});
