import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://duthuyensonghan.vn/wp-content/uploads/2025/03/logopng-1.png" alt="Logo" style={{ height: '50px', filter: 'brightness(0) invert(1)' }} />
            </Link>
            <div className={styles.contactInfo}>
              <p>Hotline (24/7): <a href="tel:0796768636" style={{color: 'var(--primary)', fontWeight: 'bold'}}>0796 768 636</a></p>
              <p>Email: support@duthuyensonghan.vn</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1rem', listStyleType: 'disc'}}>
                <li>Ưu tiên view đẹp.</li>
                <li>Trực tiếp đón tại bến.</li>
                <li>Trực tiếp dẫn lên du thuyền.</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Du Thuyền</h4>
              <Link href="#" className={styles.link}>Du Thuyền Không Ăn Tối</Link>
              <Link href="#" className={styles.link}>Du Thuyền Có Ăn Tối</Link>
              <Link href="#" className={styles.link}>Tàu Rồng Sông Hàn</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Thông Tin</h4>
              <Link href="#" className={styles.link}>Giá Vé Du Thuyền Sông Hàn</Link>
              <Link href="#" className={styles.link}>Pháo Hoa</Link>
              <Link href="#" className={styles.link}>Liên Hệ</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Kết Nối</h4>
              <Link href="#" className={styles.link}>2Da Tickets Google Map</Link>
              <Link href="#" className={styles.link}>2Da Tickets Tiktok</Link>
              <Link href="#" className={styles.link}>2Da Tickets FaceBook</Link>
            </div>
          </div>
        </div>
      </footer>
      <div className={styles.bottomBar}>
        © 2025 by 2Da Tickets Du Thuyền Sông Hàn Đà Nẵng
      </div>
    </>
  );
}
