"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  cruiseSlug?: string;
  cruiseName?: string;
  /** If true, renders as a full-page standalone form */
  standalone?: boolean;
}

const TIME_SLOTS = [
  "17:00 – Chuyến chiều",
  "17:30 – Chuyến chiều tối",
  "19:00 – Chuyến tối",
  "19:30 – Chuyến tối muộn",
];

export default function BookingForm({ cruiseSlug = "", cruiseName = "", standalone = false }: BookingFormProps) {
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
        setErrorMsg(data.error ?? "Có lỗi xảy ra, vui lòng thử lại.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Không thể kết nối máy chủ. Vui lòng thử lại.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        className={styles.successBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.successIcon}>✅</div>
        <h3 className={styles.successTitle}>Đặt lịch thành công!</h3>
        <p className={styles.successDesc}>
          Cảm ơn <strong>{form.customerName}</strong>! Chúng tôi đã nhận được yêu cầu đặt lịch của bạn.
          <br />Nhân viên 2Da Tickets sẽ liên hệ xác nhận qua số <strong>{form.phone}</strong> trong vòng 30 phút.
        </p>
        <div className={styles.successInfo}>
          <div className={styles.successInfoItem}>
            <span>🚢 Du thuyền</span>
            <strong>{cruiseName || "Chưa chọn"}</strong>
          </div>
          <div className={styles.successInfoItem}>
            <span>📅 Ngày</span>
            <strong>{new Date(form.date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
          </div>
          <div className={styles.successInfoItem}>
            <span>🕐 Giờ</span>
            <strong>{form.time}</strong>
          </div>
          <div className={styles.successInfoItem}>
            <span>👥 Số người</span>
            <strong>{form.guests} người</strong>
          </div>
        </div>
        <div className={styles.successActions}>
          <a href="tel:0796768636" className={styles.successCallBtn}>
            📞 Gọi ngay: 0796.768.636
          </a>
          <button
            className={styles.successResetBtn}
            onClick={() => { setStatus("idle"); setForm({ customerName:"", phone:"", email:"", date:"", time:TIME_SLOTS[0], guests:2, note:"" }); }}
          >
            Đặt lịch khác
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${standalone ? styles.standalone : ""}`}>
      {standalone && (
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Đặt Lịch Du Thuyền</h2>
          <p className={styles.formSubtitle}>Điền thông tin bên dưới — nhân viên sẽ xác nhận trong 30 phút</p>
        </div>
      )}

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            className={styles.errorBox}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ {errorMsg}
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
            Chuyến / Giờ khởi hành <span className={styles.required}>*</span>
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
          Số người <span className={styles.required}>*</span>
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
          "🎟️ Xác Nhận Đặt Lịch"
        )}
      </button>

      <p className={styles.disclaimer}>
        Bằng cách đặt lịch, bạn đồng ý để 2Da Tickets liên hệ xác nhận qua số điện thoại đã cung cấp.
      </p>
    </form>
  );
}
