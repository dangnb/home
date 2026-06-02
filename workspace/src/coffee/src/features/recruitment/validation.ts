import { z } from "zod";
import { nonEmptyText, phoneSchema } from "@/lib/validation";

export const applicationRequestSchema = z.object({
  jobPostingId: z.string().trim().optional(),
  fullName: nonEmptyText("Họ tên", 2, 100),
  phone: phoneSchema,
  email: z.email("Email không hợp lệ").optional().or(z.literal("")),
  position: nonEmptyText("Vị trí", 2, 120),
  message: nonEmptyText("Lời nhắn", 5, 1000),
});
