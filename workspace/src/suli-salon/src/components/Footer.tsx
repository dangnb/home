import styles from "./Footer.module.css";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand */}
        <div className={styles.col}>
          <h2 className={styles.logo}>Suli Salon</h2>
          <p className={styles.desc}>Professional manicure and pedicure in a calm, modern space.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF size={20} /></a>
            <a href="#" aria-label="TikTok"><FaTiktok size={20} /></a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Information</h3>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/services" className={styles.link}>Services</Link>
          <Link href="/gallery" className={styles.link}>Gallery</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Contact Us</h3>
          <p className={styles.text}>Prague 12, Czech Republic</p>
          <p className={styles.text}>+420 777 123 456</p>
          <p className={styles.text}>info@sulisalon.cz</p>
        </div>

        {/* Hours */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Opening Hours</h3>
          <p className={styles.text}>Mon - Fri: 09:00 - 20:00</p>
          <p className={styles.text}>Sat - Sun: 10:00 - 18:00</p>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Suli Salon. All rights reserved.</p>
      </div>
    </footer>
  );
}
