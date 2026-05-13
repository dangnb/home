"use client";
import styles from "./CruiseSection.module.css";
import CruiseCard from "./CruiseCard";
import Link from "next/link";
import { motion } from "framer-motion";

interface Cruise {
  id: string;
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
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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
          <h2 className={styles.title}>{title}</h2>
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
                link={`#${cruise.id}`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.actionContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href={viewAllLink} className={styles.viewAllButton}>
            Xem Thêm Du Thuyền
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
