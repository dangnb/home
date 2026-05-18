"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Trash2, CheckCircle, XCircle, Clock, Phone, Car } from "lucide-react";

interface Booking {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropAddress: string;
  route: string;
  tripDate: string;
  tripTime: string;
  seats: number;
  vehicleType: string;
  note: string | null;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle },
};

const vehicleLabels: Record<string, string> = {
  "xe-ghep": "Xe ghép",
  "taxi-4": "Taxi 4 chỗ",
  "taxi-7": "Taxi 7 chỗ",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  async function fetchBookings() {
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({ limit: "50", status: statusFilter });
      if (search) params.set("search", search);

      const res = await fetch(`/api/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
    setSelectedBooking(null);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Xóa vé này?")) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookings();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchBookings();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Đang tải...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt vé</h1>
          <p className="text-sm text-gray-500 mt-1">{bookings.length} vé</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              placeholder="Tìm tên, SĐT, mã vé..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "Tất cả" },
          { value: "pending", label: "Chờ xác nhận" },
          { value: "confirmed", label: "Đã xác nhận" },
          { value: "completed", label: "Hoàn thành" },
          { value: "cancelled", label: "Đã hủy" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Mã vé</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Tuyến</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Ngày giờ</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => {
                const status = statusLabels[booking.status] || statusLabels.pending;
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-600 text-sm">{booking.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {booking.route}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {booking.tripDate} - {booking.tripTime}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={`tel:${booking.customerPhone}`}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Gọi khách"
                        >
                          <Phone size={16} />
                        </a>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">Chưa có vé nào</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết vé</h2>
              <span className="font-mono font-bold text-blue-600">{selectedBooking.code}</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Khách hàng</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{selectedBooking.customerPhone}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tuyến đường</p>
                <p className="font-medium">{selectedBooking.route}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ngày đi</p>
                  <p className="font-medium">{selectedBooking.tripDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Giờ đi</p>
                  <p className="font-medium">{selectedBooking.tripTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Loại xe</p>
                  <p className="font-medium flex items-center gap-1">
                    <Car size={14} />
                    {vehicleLabels[selectedBooking.vehicleType] || selectedBooking.vehicleType}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Điểm đón</p>
                <p className="font-medium">{selectedBooking.pickupAddress}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Điểm trả</p>
                <p className="font-medium">{selectedBooking.dropAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Số ghế</p>
                  <p className="font-medium">{selectedBooking.seats}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày đặt</p>
                  <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString("vi-VN")}</p>
                </div>
              </div>

              {selectedBooking.note && (
                <div>
                  <p className="text-xs text-gray-500">Ghi chú</p>
                  <p className="font-medium text-gray-700">{selectedBooking.note}</p>
                </div>
              )}
            </div>

            {/* Status Actions */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Cập nhật trạng thái:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateStatus(selectedBooking.id, "confirmed")}
                  className="py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  ✓ Xác nhận
                </button>
                <button
                  onClick={() => updateStatus(selectedBooking.id, "completed")}
                  className="py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  ✓ Hoàn thành
                </button>
                <button
                  onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                  className="py-2.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                >
                  ✕ Hủy vé
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
