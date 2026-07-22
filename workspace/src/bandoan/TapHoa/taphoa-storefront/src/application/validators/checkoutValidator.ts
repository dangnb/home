import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên quá dài (tối đa 50 ký tự)')
    .regex(/^[a-zA-ZàáãạảờởỡợởơềếểễệeêìíĩịỉòóõọỏồốổỗộỗôừứửữựưỳỵỷỹđÀÁÃẠẢỜỞỠỢỞƠỀẾỂỄỆEÊÌÍĨỊỈÒÓÕỌỎỒỐỔỖỘỖÔỪỨỬỮỰƯỲỴỶỸĐ\s]+$/, 'Họ tên không hợp lệ'),
  phone: z.string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
  city: z.string().min(1, 'Vui lòng chọn Tỉnh / Thành phố'),
  district: z.string().min(1, 'Vui lòng chọn Quận / Huyện'),
  ward: z.string().min(1, 'Vui lòng chọn Phường / Xã'),
  street: z.string().min(5, 'Địa chỉ chi tiết phải từ 5 ký tự'),
  deliveryTimeSlot: z.string().min(1, 'Vui lòng chọn khung giờ giao'),
  paymentMethod: z.enum(['cod', 'momo', 'vnpay', 'banking'], {
    errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' })
  }),
  discountCode: z.string().max(20, 'Mã giảm giá không hợp lệ').optional(),
  note: z.string().max(200, 'Ghi chú tối đa 200 ký tự').optional()
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
