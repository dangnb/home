"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BookingForm.module.css";
import Swal from "sweetalert2";
import { MdErrorOutline } from "react-icons/md";

interface BookingFormProps {
  cruiseSlug?: string;
  cruiseName?: string;
  standalone?: boolean;
  timeSlots?: string[];
}

const DEFAULT_SLOTS = [
  "09:00 – Buổi sáng",
  "10:30 – Buổi sáng",
  "13:30 – Buổi chiều",
  "15:00 – Buổi chiều",
  "16:30 – Chiều muộn",
  "18:00 – Buổi tối",
];

export default function BookingForm({
  cruiseSlug = "",
  cruiseName = "",
  standalone = false,
  timeSlots,
}: BookingFormProps) {
  const TIME_SLOTS = (timeSlots && timeSlots.length > 0) ? timeSlots : DEFAULT_SLOTS;
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: TIME_SLOTS[0],
    guests: 2,
    note: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(p => ({ ...p, [key]: val }));
  }

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cruiseSlug, cruiseName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Có lỗi xảy ra khi gửi yêu cầu. Quý khách vui lòng thử lại.");
        setStatus("error");
      } else {
        setStatus("success");
        Swal.fire({
          title: "Đặt lịch thành công!",
          text: `Cảm ơn quý khách ${form.customerName}! Mộc Salon đã tiếp nhận yêu cầu đặt hẹn. Chuyên viên sẽ liên hệ xác nhận qua số ${form.phone} trong vòng 30 phút.`,
          icon: "success",
          confirmButtonText: "Đã hiểu",
          confirmButtonColor: "#967840",
          background: "#FDFBF7",
          color: "#2C2219",
          backdrop: "rgba(20, 16, 12, 0.65)",
          customClass: {
            popup: "luxury-swal-popup",
            title: "luxury-swal-title",
            htmlContainer: "luxury-swal-text",
            confirmButton: "luxury-swal-confirm-btn",
          },
          showClass: {
            popup: "swal2-show luxury-swal-animate-in",
            backdrop: "swal2-backdrop-show",
          },
          hideClass: {
            popup: "swal2-hide luxury-swal-animate-out",
            backdrop: "swal2-backdrop-hide",
          },
        });
        setForm({ customerName: "", phone: "", email: "", date: "", time: TIME_SLOTS[0], guests: 2, note: "" });
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Quý khách vui lòng kiểm tra kết nối mạng và thử lại.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${standalone ? styles.standalone : ""}`}>
      {standalone && (
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Đặt Lịch Hẹn Làm Móng</h2>
          <p className={styles.formSubtitle}>Điền thông tin bên dưới — chuyên viên Mộc Salon sẽ liên hệ xác nhận trong 30 phút</p>
        </div>
      )}

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            className={styles.errorBox}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <MdErrorOutline size={16} />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1: Họ tên + SĐT */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Họ và tên <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            type="text"
            placeholder="Nguyễn Văn A"
            value={form.customerName}
            onChange={e => set("customerName", e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Số điện thoại <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            type="tel"
            placeholder="0796 768 636"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 2: Email */}
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          placeholder="email@example.com (không bắt buộc)"
          value={form.email}
          onChange={e => set("email", e.target.value)}
        />
      </div>

      {/* Row 3: Ngày + Giờ */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Ngày đặt <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            type="date"
            min={today}
            value={form.date}
            onChange={e => set("date", e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Khung giờ hẹn <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.input}
            value={form.time}
            onChange={e => set("time", e.target.value)}
            required
          >
            {TIME_SLOTS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Số người */}
      <div className={styles.field}>
        <label className={styles.label}>
          Số lượng khách <span className={styles.required}>*</span>
        </label>
        <div className={styles.guestCounter}>
          <button
            type="button"
            className={styles.counterBtn}
            onClick={() => set("guests", Math.max(1, form.guests - 1))}
          >−</button>
          <span className={styles.counterValue}>{form.guests} người</span>
          <button
            type="button"
            className={styles.counterBtn}
            onClick={() => set("guests", Math.min(220, form.guests + 1))}
          >+</button>
        </div>
      </div>

      {/* Row 5: Ghi chú */}
      <div className={styles.field}>
        <label className={styles.label}>Ghi chú / Yêu cầu đặc biệt</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Ví dụ: Tổ chức sinh nhật, cần setup hoa, có trẻ em..."
          value={form.note}
          onChange={e => set("note", e.target.value)}
          rows={3}
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <span className={styles.spinner} />
        ) : (
          "Xác Nhận Đặt Lịch"
        )}
      </button>

      <p className={styles.disclaimer}>
        Bằng cách đặt lịch, bạn đồng ý để Mộc Salon liên hệ xác nhận qua số điện thoại đã cung cấp.
      </p>
    </form>
  );
}
