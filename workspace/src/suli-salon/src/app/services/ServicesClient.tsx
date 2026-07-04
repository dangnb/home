"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Services.module.css";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "nails", label: "Nails" },
  { id: "facial", label: "Facial Care / Skin Treatments" },
  { id: "eyelashes", label: "Eyelashes" },
  { id: "eyebrows", label: "Eyebrows" },
];

type ServiceItem = {
  id: number;
  name: string;
  price: string;
  duration: string;
  special?: boolean;
};

const mockServices: Record<string, ServiceItem[]> = {
  nails: [
    { id: 1, name: "Classic Manicure", price: "500 CZK", duration: "45 min" },
    { id: 2, name: "Gel Polish Manicure", price: "700 CZK", duration: "60 min", special: true },
    { id: 3, name: "Nail Extensions - New Set", price: "1200 CZK", duration: "90 min" },
    { id: 4, name: "Spa Pedicure", price: "800 CZK", duration: "60 min" },
  ],
  facial: [
    { id: 5, name: "Deep Cleansing Facial", price: "1500 CZK", duration: "60 min" },
    { id: 6, name: "Anti-Aging Treatment", price: "1800 CZK", duration: "90 min", special: true },
  ],
  eyelashes: [
    { id: 7, name: "Classic Lash Extensions", price: "1100 CZK", duration: "90 min" },
    { id: 8, name: "Volume Lash Extensions", price: "1400 CZK", duration: "120 min" },
    { id: 9, name: "Lash Lifting", price: "900 CZK", duration: "60 min" },
  ],
  eyebrows: [
    { id: 10, name: "Eyebrow Shaping", price: "300 CZK", duration: "20 min" },
    { id: 11, name: "Eyebrow Tinting", price: "400 CZK", duration: "30 min" },
  ],
};

export default function ServicesClient() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("categoryId");
  
  const [activeCategory, setActiveCategory] = useState("nails");

  useEffect(() => {
    if (catParam && categories.some(c => c.id === catParam)) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const currentServices = mockServices[activeCategory as keyof typeof mockServices] || [];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.branchSelector}>
          <span className={styles.branchLabel}>Branch</span>
          <select className={styles.branchSelect}>
            <option>Suli Salon - Praha 12</option>
            <option>Suli Salon - Center</option>
          </select>
        </div>

        <div className={styles.categoryList}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`${styles.catButton} ${activeCategory === cat.id ? styles.active : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.serviceList}
          >
            {currentServices.map(service => (
              <div key={service.id} className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceHeader}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    {service.special && <span className={styles.badge}>Special</span>}
                  </div>
                  <p className={styles.serviceDuration}>{service.duration}</p>
                </div>
                <div className={styles.serviceAction}>
                  <span className={styles.servicePrice}>{service.price}</span>
                  <Link href={`/booking?serviceId=${service.id}`} className={styles.bookBtn}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
