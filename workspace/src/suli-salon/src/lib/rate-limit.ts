export class RateLimiter {
    private ipRequests = new Map<string, { count: number; expiresAt: number }>();

    constructor(private requestLimit: number, private windowMs: number) { }

    check(ip: string): boolean {
        const now = Date.now();
        const record = this.ipRequests.get(ip);

        if (!record || record.expiresAt < now) {
            this.ipRequests.set(ip, { count: 1, expiresAt: now + this.windowMs });
            return true;
        }

        if (record.count >= this.requestLimit) {
            return false; // Rate limit exceeded
        }

        record.count++;
        return true; // OK
    }
}

// Global instances for specific routes to prevent multiple instantiation
// Booking limit: 5 booking requests per 15 minutes per IP
export const bookingRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Contact limit: 3 contact requests per 15 minutes per IP
export const contactRateLimiter = new RateLimiter(3, 15 * 60 * 1000);
