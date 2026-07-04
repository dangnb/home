import styles from "./Sidebar.module.css";
import Link from "next/link";
import { Home, Compass, GraduationCap, FileText } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={`${styles.navLink} ${styles.active}`}>
              <div className={styles.iconWrapper}>
                <Home size={20} />
              </div>
              <span>Trang chủ</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/learning-paths" className={styles.navLink}>
              <div className={styles.iconWrapper}>
                <Compass size={20} />
              </div>
              <span>Lộ trình</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/courses" className={styles.navLink}>
              <div className={styles.iconWrapper}>
                <GraduationCap size={20} />
              </div>
              <span>Học tập</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/blog" className={styles.navLink}>
              <div className={styles.iconWrapper}>
                <FileText size={20} />
              </div>
              <span>Blog</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
