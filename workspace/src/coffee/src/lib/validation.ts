import { z } from "zod";

export const phoneSchema = z.string().trim().min(8, "Số điện thoại quá ngắn").max(20, "Số điện thoại quá dài");
export const nonEmptyText = (label: string, min = 2, max = 500) => z.string().trim().min(min, `${label} quá ngắn`).max(max, `${label} quá dài`);

export function validationErrorResponse(error: z.ZodError) {
  return Response.json(
    {
      error: "Dữ liệu không hợp lệ",
      issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    },
    { status: 400 },
  );
}
