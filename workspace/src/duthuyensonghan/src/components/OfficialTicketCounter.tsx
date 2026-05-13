"use client";
import styles from "./OfficialTicketCounter.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OfficialTicketCounter() {
  return (
    <section className={styles.section} id="thong-tin">
      <div className={`container ${styles.grid}`}>
        <motion.div 
          className={styles.textContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.badge}>UY TÍN – CHẤT LƯỢNG</span>
          <h2 className={styles.title}>Quầy Vé Chính Thức</h2>
          <p className={styles.description}>
            2Da Tickets với hơn 1000 lượt đánh giá và xếp hạng 5* về dịch vụ bán vé du thuyền sông Hàn Đà Nẵng trên Google Map. Chúng tôi tự tin sẽ mang đến những du thuyền với chất lượng, dịch vụ và giá tốt nhất.
          </p>
          <p className={styles.description}>
            Tại Duthuyensonghan.vn, chúng tôi mang đến giải pháp đặt vé nhanh – an toàn – hoàn huỷ đổi chuyến linh hoạt.
          </p>
          <Link href="https://maps.app.goo.gl/4wPKGFBAKUAfdYsK7" target="_blank" rel="noopener noreferrer" className={styles.badge} style={{ background: 'var(--primary)', color: 'white', display: 'inline-block', marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
            Xem 2Da Tickets trên Google map
          </Link>
        </motion.div>
        <motion.div 
          className={styles.mapContainer}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/Screenshot-2025-03-08-at-10.33.57 AM-1.webp" 
            alt="Bản đồ 2Da Tickets" 
            className={styles.mapImage} 
          />
        </motion.div>
      </div>
    </section>
  );
}
