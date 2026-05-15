"use client";
import styles from "./CruiseSection.module.css";
import CruiseCard from "./CruiseCard";
import Link from "next/link";
import { motion } from "framer-motion";

interface Cruise {
  id: string;
  slug?: string;
  image: string;
  title: string;
  floors: number;
  capacity: number;
  isSale?: boolean;
  price?: string;
}

interface CruiseSectionProps {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  cruises: Cruise[];
  viewAllLink: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function CruiseSection({ id, title, subtitle, cruises, viewAllLink }: CruiseSectionProps) {
  return (
    <section className={styles.section} id={id}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.titleCol}>
            {id === 'khong-an-toi' && <span className={styles.badge}>Du Thuyền Không Nhà Hàng</span>}
            {id === 'co-an-toi' && <span className={styles.badge}>Du Thuyền 5★ Nhà Hàng & Bar</span>}
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className={styles.divider} />
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cruises.map((cruise) => (
            <motion.div key={cruise.id} variants={itemVariants}>
              <CruiseCard
                image={cruise.image}
                title={cruise.title}
                floors={cruise.floors}
                capacity={cruise.capacity}
                isSale={cruise.isSale}
                price={cruise.price}
                link={cruise.slug ? `/du-thuyen/${cruise.slug}` : `#${cruise.id}`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.actionContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href={viewAllLink} className={styles.viewAllButton}>
            Xem Tất Cả Du Thuyền & Bảng Giá
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft:'8px'}}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
