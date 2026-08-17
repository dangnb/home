import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Từ khóa quá dài')
    .transform((val) => val.trim().replace(/[<>]/g, '')) // Remove dangerous tags
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(4, 'Mã đơn hàng không hợp lệ (VD: WTH-1001)').max(20),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
});

export type TrackOrderFormData = z.infer<typeof trackOrderSchema>;
