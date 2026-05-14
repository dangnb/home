import { updateBookingStatus, deleteBooking, type BookingStatus } from "@/lib/db";
import { getSession } from "@/lib/auth";

// PATCH /api/bookings/[id] — update status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await request.json() as { status: BookingStatus };

  const validStatuses: BookingStatus[] = ["new", "confirmed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  const ok = updateBookingStatus(id, status);
  if (!ok) return Response.json({ error: "Không tìm thấy booking" }, { status: 404 });
  return Response.json({ success: true });
}

// DELETE /api/bookings/[id] — admin only
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteBooking(id);
  if (!ok) return Response.json({ error: "Không tìm thấy booking" }, { status: 404 });
  return Response.json({ success: true });
}
