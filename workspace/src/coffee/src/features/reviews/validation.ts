import { z } from "zod";
import { nonEmptyText } from "@/lib/validation";

export const reviewRequestSchema = z.object({
  productSlug: z.string().trim().min(1),
  name: nonEmptyText("Tên", 2, 100),
  rating: z.number().int().min(1).max(5),
  comment: nonEmptyText("Bình luận", 5, 1000),
});
