import styles from "./CruiseCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaTags, FaArrowRight } from "react-icons/fa";

interface CruiseCardProps {
  image: string;
  title: string;
  floors: number;
  capacity: number;
  isSale?: boolean;
  price?: string;
  link?: string;
}

export default function CruiseCard({ image, title, floors, capacity, isSale, price, link = "#" }: CruiseCardProps) {
  return (
    <Link href={link} className={styles.card}>
      <div className={styles.imageContainer}>
        {isSale && <span className={styles.saleBadge}><FaTags style={{ marginRight: '4px' }} /> Sale</span>}
        <Image src={image || "/images/banner_desktop.webp"} alt={title} fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw" />
        <div className={styles.imageOverlayBtn}>Xem Chi Tiết <FaArrowRight style={{ marginLeft: '4px' }} /></div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.features}>
          <div className={styles.feature}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dien-tich.png" alt="Tầng" style={{ width: 14, height: 14 }} />
            {floors} Tầng
          </div>
          <div className={styles.feature}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/phong-ngu.png" alt="Người" style={{ width: 14, height: 14 }} />
            {capacity} Người
          </div>
        </div>
        {price && (
          <div className={styles.footer}>
            <div>
              <span className={styles.priceLabel}>Giá tham khảo</span>
              <span className={styles.price}>{price}</span>
            </div>
            <span className={styles.bookBtn}>Đặt ngay</span>
          </div>
        )}
      </div>
    </Link>
  );
}
