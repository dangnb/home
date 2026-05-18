"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Calendar, Clock, Users, Car, CheckCircle, ArrowRight } from "lucide-react";

const routes = [
  "Hà Nội → Nam Định",
  "Nam Định → Hà Nội",
  "Nam Định → Nội Bài",
  "Nội Bài → Nam Định",
  "Hà Nội → Giao Thủy",
  "Hà Nội → Xuân Trường",
  "Hà Nội → Hải Hậu",
  "Hà Nội → Trực Ninh",
  "Hà Nội → Nam Trực",
  "Hà Nội → Nghĩa Hưng",
  "Hà Nội → Ý Yên",
  "Hà Nội → Vụ Bản",
];

const vehicleTypes = [
  { value: "xe-ghep", label: "Xe ghép (250k/ghế)", icon: "🚗" },
  { value: "taxi-4", label: "Taxi 4 chỗ (900k/xe)", icon: "🚕" },
  { value: "taxi-7", label: "Taxi 7 chỗ (1.1tr/xe)", icon: "🚐" },
];

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ code: string; message: string } | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    dropAddress: "",
    route: "",
    tripDate: "",
    tripTime: "",
    seats: 1,
    vehicleType: "xe-ghep",
    note: "",
  });

  // Pre-fill from URL params (when clicking from pricing cards)
  useEffect(() => {
    const route = searchParams.get("route");
    const vehicle = searchParams.get("vehicle");
    if (route || vehicle) {
      setForm((prev) => ({
        ...prev,
        route: route || prev.route,
        vehicleType: vehicle || prev.vehicleType,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setBookingResult({ code: data.booking.code, message: data.message });
        setStep(3);
      } else {
        alert(data.error || "Lỗi đặt vé");
      }
    } catch {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.route && form.tripDate && form.tripTime && form.vehicleType;
  const isStep2Valid = form.customerName && form.customerPhone && form.pickupAddress && form.dropAddress;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Đặt Vé{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Xe Ghép Nam Định
            </span>
          </h1>
          <p className="mt-3 text-gray-600">Đặt vé nhanh chóng, đón tận nhà, giá trọn gói</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? <CheckCircle size={18} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 rounded ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Car size={24} className="text-blue-600" />
                Thông tin chuyến đi
              </h2>

              <div className="space-y-5">
                {/* Route */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tuyến đường *
                  </label>
                  <select
                    value={form.route}
                    onChange={(e) => setForm({ ...form, route: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">-- Chọn tuyến đường --</option>
                    {routes.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={14} className="inline mr-1" />
                      Ngày đi *
                    </label>
                    <input
                      type="date"
                      value={form.tripDate}
                      onChange={(e) => setForm({ ...form, tripDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={14} className="inline mr-1" />
                      Giờ đi *
                    </label>
                    <input
                      type="time"
                      value={form.tripTime}
                      onChange={(e) => setForm({ ...form, tripTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại xe *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {vehicleTypes.map((v) => (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => setForm({ ...form, vehicleType: v.value })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          form.vehicleType === v.value
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{v.icon}</div>
                        <div className="text-xs font-medium">{v.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={14} className="inline mr-1" />
                    Số ghế
                  </label>
                  <select
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>{n} ghế</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-600" />
                Thông tin khách hàng
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={14} className="inline mr-1" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0379 803 990"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    Điểm đón *
                  </label>
                  <input
                    type="text"
                    value={form.pickupAddress}
                    onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Số nhà, đường, phường/xã..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    Điểm trả *
                  </label>
                  <input
                    type="text"
                    value={form.dropAddress}
                    onChange={(e) => setForm({ ...form, dropAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Số nhà, đường, phường/xã..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Ghi chú thêm (số hành lý, yêu cầu đặc biệt...)"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-2">Tóm tắt chuyến đi</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <span>Tuyến: {form.route}</span>
                  <span>Ngày: {form.tripDate}</span>
                  <span>Giờ: {form.tripTime}</span>
                  <span>Số ghế: {form.seats}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStep2Valid || loading}
                  className="flex-[2] py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "🎫 Xác nhận đặt vé"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && bookingResult && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt vé thành công!</h2>
              <p className="text-gray-600 mb-6">Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút</p>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-blue-600 mb-1">Mã vé của bạn</p>
                <p className="text-3xl font-bold text-blue-900 tracking-wider">{bookingResult.code}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tuyến:</span>
                  <span className="font-medium">{form.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày giờ:</span>
                  <span className="font-medium">{form.tripDate} - {form.tripTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Điểm đón:</span>
                  <span className="font-medium">{form.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Điểm trả:</span>
                  <span className="font-medium">{form.dropAddress}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:0379803990"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
                >
                  <Phone size={18} />
                  Gọi xác nhận
                </a>
                <a
                  href="https://zalo.me/0379803990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Chat Zalo
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
