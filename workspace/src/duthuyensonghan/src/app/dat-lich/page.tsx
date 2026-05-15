import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import styles from "./page.module.css";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Đặt Lịch Du Thuyền Sông Hàn – 2Da Tickets",
  description: "Đặt lịch du thuyền sông Hàn Đà Nẵng nhanh chóng. Xác nhận trong 30 phút, giữ chỗ miễn phí.",
};

export default function DatLichPage() {
  const s = getSettings();
  const phoneDisplay = s.hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3");
  return (
    <main className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/banner_desktop.webp" alt="Đặt lịch du thuyền" className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🎟️ Đặt lịch trực tuyến</span>
          <h1 className={styles.heroTitle}>Đặt Lịch Du Thuyền Sông Hàn</h1>
          <p className={styles.heroSub}>Xác nhận trong 30 phút · Giữ chỗ miễn phí · Hoàn hủy linh hoạt</p>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>
          {/* Left: Form */}
          <div>
            <BookingForm standalone timeSlots={s.departureSlots} />
          </div>

          {/* Right: Info */}
          <aside className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>📞 Liên hệ trực tiếp</h3>
              <p className={styles.infoDesc}>Nếu cần tư vấn ngay, gọi hoặc nhắn tin cho chúng tôi:</p>
              <a href={`tel:${s.hotline}`} className={styles.infoCallBtn}>{phoneDisplay}</a>
              <a href={s.zalo} target="_blank" rel="noreferrer" className={styles.infoZaloBtn}>
                💬 Nhắn Zalo
              </a>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>✅ Quy trình đặt lịch</h3>
              <ol className={styles.stepList}>
                {[
                  { n: "1", text: "Điền form đặt lịch bên cạnh" },
                  { n: "2", text: "Nhân viên gọi xác nhận trong 30 phút" },
                  { n: "3", text: "Thanh toán linh hoạt tại bến hoặc chuyển khoản" },
                  { n: "4", text: "Nhận vé & lên du thuyền" },
                ].map(s => (
                  <li key={s.n} className={styles.stepItem}>
                    <span className={styles.stepNum}>{s.n}</span>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>🕐 Giờ khởi hành</h3>
              <ul className={styles.timeList}>
                {s.departureSlots.map((slot, i) => {
                  const [time, ...labelParts] = slot.split("–").map(p => p.trim());
                  const label = labelParts.join("–").trim() || slot;
                  return (
                    <li key={i} className={styles.timeItem}>
                      <span className={styles.timeBadge}>{time}</span>
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>📍 Địa điểm đón khách</h3>
              <p className={styles.infoDesc}>{s.address}</p>
              <p className={styles.infoDesc} style={{marginTop:'0.5rem'}}>
                Nhân viên sẽ trực tiếp đón và dẫn quý khách lên du thuyền.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
