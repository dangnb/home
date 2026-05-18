"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Users, Car, CheckCircle, Phone, ArrowRight, X } from "lucide-react";
import FadeIn from "../animations/FadeIn";

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
];

const vehicleTypes = [
  { value: "xe-ghep", label: "Xe ghép", price: "250k/ghế", icon: "🚗" },
  { value: "taxi-4", label: "Taxi 4 chỗ", price: "900k/xe", icon: "🚕" },
  { value: "taxi-7", label: "Taxi 7 chỗ", price: "1.1tr/xe", icon: "🚐" },
];

export default function BookingWidget() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string } | null>(null);
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

  const resetForm = () => {
    setForm({
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
    setStep(1);
    setResult(null);
  };

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
        setResult({ code: data.booking.code });
        setStep(3);
      } else {
        alert(data.error || "Lỗi đặt vé");
      }
    } catch {
      alert("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Booking Quick Form on Homepage */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                  Đặt Vé Nhanh
                </h2>
                <p className="text-blue-200 text-center mb-8">
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ xác nhận ngay
                </p>

                {/* Quick booking form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-blue-200 mb-1.5 font-medium">Tuyến đường</label>
                    <select
                      value={form.route}
                      onChange={(e) => setForm({ ...form, route: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-400 outline-none backdrop-blur-sm [&>option]:text-gray-900"
                    >
                      <option value="">Chọn tuyến</option>
                      {routes.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-blue-200 mb-1.5 font-medium">
                      <Calendar size={12} className="inline mr-1" />
                      Ngày đi
                    </label>
                    <input
                      type="date"
                      value={form.tripDate}
                      onChange={(e) => setForm({ ...form, tripDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-orange-400 outline-none backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-blue-200 mb-1.5 font-medium">
                      <Clock size={12} className="inline mr-1" />
                      Giờ đi
                    </label>
                    <input
                      type="time"
                      value={form.tripTime}
                      onChange={(e) => setForm({ ...form, tripTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-orange-400 outline-none backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-blue-200 mb-1.5 font-medium">Loại xe</label>
                    <select
                      value={form.vehicleType}
                      onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-orange-400 outline-none backdrop-blur-sm [&>option]:text-gray-900"
                    >
                      {vehicleTypes.map((v) => (
                        <option key={v.value} value={v.value}>{v.icon} {v.label} - {v.price}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.route || !form.tripDate || !form.tripTime) {
                        alert("Vui lòng chọn tuyến đường, ngày và giờ đi");
                        return;
                      }
                      setShowModal(true);
                    }}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all"
                  >
                    Đặt vé ngay
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
            onClick={() => { setShowModal(false); resetForm(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">
                  {step === 3 ? "Đặt vé thành công!" : "Hoàn tất đặt vé"}
                </h3>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1 in modal: show trip summary + ask for customer info */}
                  {step === 1 && (
                    <motion.div
                      key="modal-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Trip Summary */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Car size={16} />
                          Thông tin chuyến đi
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                          <span>🛣️ {form.route}</span>
                          <span>📅 {form.tripDate}</span>
                          <span>⏰ {form.tripTime}</span>
                          <span>🚗 {vehicleTypes.find(v => v.value === form.vehicleType)?.label}</span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                            <input
                              type="text"
                              value={form.customerName}
                              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="Nguyễn Văn A"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SĐT *</label>
                            <input
                              type="tel"
                              value={form.customerPhone}
                              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="0379 803 990"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin size={12} className="inline mr-1" />
                            Điểm đón *
                          </label>
                          <input
                            type="text"
                            value={form.pickupAddress}
                            onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Số nhà, đường, phường/xã..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin size={12} className="inline mr-1" />
                            Điểm trả *
                          </label>
                          <input
                            type="text"
                            value={form.dropAddress}
                            onChange={(e) => setForm({ ...form, dropAddress: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Số nhà, đường, phường/xã..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Users size={12} className="inline mr-1" />
                              Số ghế
                            </label>
                            <select
                              value={form.seats}
                              onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <option key={n} value={n}>{n} ghế</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                            <input
                              type="text"
                              value={form.note}
                              onChange={(e) => setForm({ ...form, note: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              placeholder="Yêu cầu thêm..."
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!form.customerName || !form.customerPhone || !form.pickupAddress || !form.dropAddress || loading}
                        className="mt-6 w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Đang xử lý..." : "🎫 Xác nhận đặt vé"}
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: Success */}
                  {step === 3 && result && (
                    <motion.div
                      key="modal-step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle size={32} className="text-green-600" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900 mb-1">Đặt vé thành công!</h3>
                      <p className="text-gray-500 text-sm mb-4">Chúng tôi sẽ gọi xác nhận trong 15 phút</p>

                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <p className="text-xs text-blue-600 mb-1">Mã vé</p>
                        <p className="text-2xl font-bold text-blue-900 tracking-wider">{result.code}</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-left text-sm space-y-1 mb-6">
                        <div className="flex justify-between"><span className="text-gray-500">Tuyến:</span><span className="font-medium">{form.route}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Ngày:</span><span className="font-medium">{form.tripDate} - {form.tripTime}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Đón:</span><span className="font-medium">{form.pickupAddress}</span></div>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href="tel:0379803990"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm"
                        >
                          <Phone size={16} />
                          Gọi ngay
                        </a>
                        <button
                          type="button"
                          onClick={() => { setShowModal(false); resetForm(); }}
                          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200"
                        >
                          Đóng
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
