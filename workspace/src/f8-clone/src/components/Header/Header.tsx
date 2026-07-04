import styles from "./Header.module.css";
import { Search, Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            className={styles.logo}
            src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
            alt="F8 Logo"
          />
        </Link>
        <h4 className={styles.title}>Học Lập Trình Để Đi Làm</h4>
      </div>

      <div className={styles.searchBody}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Tìm kiếm khóa học, bài viết, video, ..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <Bell size={20} />
        </button>
        <button className={styles.loginBtn}>Đăng nhập</button>
      </div>
    </header>
  );
}
