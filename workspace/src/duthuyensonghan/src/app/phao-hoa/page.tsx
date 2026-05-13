"use client";

import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function PhaoHoaPage() {
  return (
    <main className={styles.container}>
      {/* Hero Banner with Clip Path */}
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/images/phaohoatuocte.jpg" 
          alt="Lễ hội pháo hoa quốc tế Đà Nẵng" 
          className={styles.heroImage}
        />
        
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div 
            className={styles.ticketCard}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h2 className={styles.ticketTitle}>KHÔNG NHÀ HÀNG</h2>
            <p className={styles.ticketPrice}>Từ 800.000đ - 1.500.000đ</p>
            <div className={styles.ticketDesc}>
              - Xem pháo hoa view đẹp, thoáng mát<br />
              - Hỗ trợ 1 suất ăn tối (Cơm gà, trái cây, nước)<br />
              - Thích hợp gia đình thích yên tĩnh<br />
              - Tầng 1 hoặc Tầng 2
            </div>
          </motion.div>

          <motion.div 
            className={styles.ticketCard}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h2 className={styles.ticketTitle}>NHÀ HÀNG</h2>
            <p className={styles.ticketPrice}>Từ 1.700.000đ - 3.000.000đ</p>
            <div className={styles.ticketDesc}>
              - Phục vụ ăn uống theo menu đặt trước<br />
              - Tổ chức tiệc theo đoàn<br />
              - Dragon Cruise, Tàu Rồng<br />
              - View tầng 2 hoặc Mũi tàu VIP
            </div>
          </motion.div>

          <motion.div 
            className={styles.ticketCard}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h2 className={styles.ticketTitle}>NHÀ HÀNG VIP</h2>
            <p className={styles.ticketPrice}>Từ 2.500.000đ - 5.000.000đ</p>
            <div className={styles.ticketDesc}>
              - Du thuyền 5* (Poseidon Cruise)<br />
              - Phục vụ suất ăn menu hoặc Buffet<br />
              - Tầng 2 có quầy bar, DJ, Dancer<br />
              - Không gian sang trọng, đẳng cấp
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Layout: 2 columns */}
      <div className={styles.mainLayout}>
        
        {/* Left Column */}
        <div className={styles.mainContent}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            LỊCH THI ĐẤU LỄ HỘI PHÁO HOA QUỐC TẾ ĐÀ NẴNG - DIFF 2026
          </motion.h2>

          <motion.img
            src="https://images.unsplash.com/photo-1533660505191-4c12643a6d10?q=80&w=2070&auto=format&fit=crop"
            alt="DIFF Poster"
            className={styles.posterImage}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className={styles.textBlock}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>
              Lễ hội Pháo hoa Quốc tế Đà Nẵng 2026 sẽ diễn ra từ ngày 30/05 đến 11/07/2026, kéo dài trong 6 đêm thi vào thứ Bảy hàng tuần với chủ đề <strong>“Đà Nẵng – Những chân trời kết nối”</strong>.
            </p>
            <br />
            <p>
              Sự kiện năm nay có sự tham gia của các đội đến từ Việt Nam, Pháp, Đức, Bồ Đào Nha, Ma Cao, Nhật Bản, Ý, Úc và Trung Quốc. Để thưởng thức các màn trình diễn pháo hoa một cách độc đáo nhất, bạn nên lựa chọn xem từ các du thuyền trên sông Hàn mang lại tầm nhìn toàn cảnh kết hợp du ngoạn, ngắm hoàng hôn và thưởng thức ẩm thực.
            </p>
            <br />
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>Lịch trình các đêm bắn pháo hoa:</h3>
            <ul>
              <li><strong>Đêm 1 (30/5/2026):</strong> Chủ đề “Thiên Nhiên” – Đội Đà Nẵng (Việt Nam) và Trung Quốc.</li>
              <li><strong>Đêm 2 (6/6/2026):</strong> Chủ đề “Di Sản” – Đội Z21 (Việt Nam) và Pháp.</li>
              <li><strong>Đêm 3 (13/6/2026):</strong> Chủ đề “Văn Hoá” – Đội Nhật Bản và Ý.</li>
              <li><strong>Đêm 4 (20/6/2026):</strong> Chủ đề “Sáng Tạo” – Đội Đức và Ma Cao.</li>
              <li><strong>Đêm 5 (27/6/2026):</strong> Chủ đề “Tầm Nhìn” – Đội Úc và Bồ Đào Nha.</li>
              <li><strong>Đêm 6 (11/7/2026):</strong> Chủ đề “Đà Nẵng – Những chân trời kết nối” – CHUNG KẾT.</li>
            </ul>
            <br />
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>Lịch trình chung khi xem pháo hoa trên du thuyền:</h3>
            <ul>
              <li><strong>16h30 – 17h30:</strong> Đón khách tại Cảng Sông Thu cũ (dưới chân cầu Trần Thị Lý)</li>
              <li><strong>17h30 – 19h00:</strong> Du ngoạn sông Hàn, ngắm hoàng hôn, tham quan các cây cầu nổi tiếng và thưởng thức bữa tối.</li>
              <li><strong>19h00 – 20h00:</strong> Tham gia các chương trình giải trí như múa Chămpa, giao lưu âm nhạc, karaoke.</li>
              <li><strong>20h00 – 21h30:</strong> Thưởng thức các màn trình diễn pháo hoa từ vị trí đậu đặc biệt trên sông Hàn.</li>
              <li><strong>21h30 – 22h00:</strong> Du thuyền đưa khách về lại bến và kết thúc chương trình.</li>
            </ul>
          </motion.div>

          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Thư viện hình ảnh
          </motion.h2>

          <div className={styles.galleryGrid}>
            {[
              "https://images.unsplash.com/photo-1498622205843-3b0ac17be8aa?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1542282811-943ef1a977c3?q=80&w=2072&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1502476579222-777e4cb52ba0?q=80&w=2071&auto=format&fit=crop"
            ].map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt={`Gallery ${index}`}
                className={styles.galleryImage}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>Video Nổi Bật</h3>
            <div className={styles.videoWrapper}>
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>Tin Tức Gần Đây</h3>
            <ul className={styles.recentPosts}>
              <li>Bảng giá vé Du thuyền xem pháo hoa 2024</li>
              <li>Kinh nghiệm đặt vé tránh bị lừa đảo</li>
              <li>Review 5 du thuyền nhà hàng tốt nhất</li>
              <li>Top vị trí xem pháo hoa đẹp nhất Đà Nẵng</li>
              <li>Hướng dẫn di chuyển đến bến du thuyền</li>
            </ul>
          </div>
        </aside>

      </div>
      
    </main>
  );
}
