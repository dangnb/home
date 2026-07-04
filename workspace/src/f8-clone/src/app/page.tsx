import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>F8 - Học lập trình để đi làm</h1>
          <p className={styles.heroDesc}>
            Bắt đầu lộ trình học với hàng ngàn bài giảng miễn phí chất lượng.
          </p>
          <button className={styles.heroBtn}>Học ngay</button>
        </div>
        <div className={styles.heroImage}>
          {/* Placeholder for hero image */}
          <div className={styles.heroImagePlaceholder}></div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Khóa học Pro</h2>
          <a href="#" className={styles.sectionLink}>Xem thêm</a>
        </div>
        <div className={styles.courseGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.courseCard}>
              <div className={styles.courseImage}></div>
              <h3 className={styles.courseName}>Khóa học ReactJS Pro {i}</h3>
              <p className={styles.coursePrice}>1.299.000đ</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Khóa học miễn phí</h2>
          <a href="#" className={styles.sectionLink}>Xem thêm</a>
        </div>
        <div className={styles.courseGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.courseCard}>
              <div className={styles.courseImage}></div>
              <h3 className={styles.courseName}>Khóa học JavaScript cơ bản {i}</h3>
              <p className={styles.coursePrice}>Miễn phí</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
