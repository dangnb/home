import { getBookings, createBooking } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/bookings — admin only
export async function GET() {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getBookings());
}

// POST /api/bookings — public (customer submits booking)
export async function POST(request: Request) {
  const body = await request.json();

  const { cruiseSlug, cruiseName, customerName, phone, email, date, time, guests, note } = body;

  if (!customerName || !phone || !date || !time || !guests) {
    return Response.json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc" }, { status: 400 });
  }

  if (!/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""))) {
    return Response.json({ error: "Số điện thoại không hợp lệ" }, { status: 400 });
  }

  const booking = createBooking({
    cruiseSlug: cruiseSlug ?? "",
    cruiseName: cruiseName ?? "Chưa xác định",
    customerName,
    phone,
    email: email ?? "",
    date,
    time,
    guests: Number(guests),
    note: note ?? "",
  });

  return Response.json(booking, { status: 201 });
}
