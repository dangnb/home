import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Đặt Lịch Du Thuyền Sông Hàn – 2Da Tickets",
  description: "Đặt lịch du thuyền sông Hàn Đà Nẵng nhanh chóng. Xác nhận trong 30 phút, giữ chỗ miễn phí.",
};

export default function DatLichPage() {
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
            <BookingForm standalone />
          </div>

          {/* Right: Info */}
          <aside className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>📞 Liên hệ trực tiếp</h3>
              <p className={styles.infoDesc}>Nếu cần tư vấn ngay, gọi hoặc nhắn tin cho chúng tôi:</p>
              <a href="tel:0796768636" className={styles.infoCallBtn}>0796.768.636</a>
              <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer" className={styles.infoZaloBtn}>
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
                {[
                  { time: "17:00", label: "Chuyến chiều" },
                  { time: "17:30", label: "Chuyến chiều tối" },
                  { time: "19:00", label: "Chuyến tối" },
                  { time: "19:30", label: "Chuyến tối muộn" },
                ].map(t => (
                  <li key={t.time} className={styles.timeItem}>
                    <span className={styles.timeBadge}>{t.time}</span>
                    <span>{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>📍 Địa điểm đón khách</h3>
              <p className={styles.infoDesc}>
                Cảng Sông Thu cũ – dưới chân <strong>Cầu Trần Thị Lý</strong>, Đà Nẵng.
              </p>
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
