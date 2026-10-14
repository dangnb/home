import { z } from "zod";

const phonePattern = /^(?:\+?84|0)(?:[\s.-]?\d){8,10}$/;
const optionalText = (maxLength: number) =>
    z.string().trim().max(maxLength).optional().transform((value) => value || undefined);

export const bookingSchema = z.object({
    customerName: z.string().trim().min(2, "Vui lòng nhập họ tên hợp lệ").max(100),
    phone: z.string().trim().regex(phonePattern, "Số điện thoại không hợp lệ"),
    email: optionalText(254).pipe(z.email("Email không hợp lệ").optional()),
    serviceName: z.string().trim().max(120).optional(),
    cruiseName: z.string().trim().max(120).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày đặt lịch không hợp lệ").refine(
        (value) => {
            const requestedDate = new Date(`${value}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return !Number.isNaN(requestedDate.getTime()) && requestedDate >= today;
        },
        "Ngày đặt lịch không được ở quá khứ"
    ),
    time: z.string().trim().min(1, "Vui lòng chọn giờ hẹn").max(80),
    note: optionalText(1000),
}).refine((data) => Boolean(data.serviceName || data.cruiseName), {
    message: "Vui lòng chọn dịch vụ",
    path: ["serviceName"],
});

export const contactSchema = z.object({
    name: z.string().trim().min(2, "Vui lòng nhập họ tên hợp lệ").max(100),
    email: optionalText(254).pipe(z.email("Email không hợp lệ").optional()),
    phone: optionalText(20).refine((value) => !value || phonePattern.test(value), "Số điện thoại không hợp lệ"),
    subject: optionalText(160),
    message: z.string().trim().min(10, "Nội dung cần có ít nhất 10 ký tự").max(2000),
    website: z.string().max(0).optional(),
});

export const appointmentStatusSchema = z.enum(["new", "confirmed", "cancelled", "completed"]);

export function getClientIp(headers: Headers): string {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim() || "unknown";

    return headers.get("x-real-ip")?.trim() || "unknown";
}

export async function parseJsonBody(request: Request): Promise<unknown> {
    try {
        return await request.json();
    } catch {
        return undefined;
    }
}
