"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./SlideOutBooking.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function SlideOutBooking() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={styles.triggerButton}
                onClick={() => setIsOpen(true)}
            >
                <span>BOOK APPOINTMENT</span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <React.Fragment>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className={styles.slideOutPanel}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.4 }}
                        >
                            <button
                                className={styles.closeBtn}
                                onClick={() => setIsOpen(false)}
                            >
                                &times;
                            </button>
                            <h3 className={styles.panelTitle}>Quick Booking</h3>
                            <p className={styles.panelDesc}>Leave your details and we will confirm your appointment shortly.</p>

                            <div className={styles.formContainer}>
                                <input type="text" placeholder="Your Name *" className={styles.inputField} />
                                <input type="tel" placeholder="Phone Number *" className={styles.inputField} />
                                <select className={styles.inputField}>
                                    <option>Select Service</option>
                                    <option>Manicure & Pedicure</option>
                                    <option>Eyelash Extension</option>
                                    <option>Facial Care</option>
                                </select>
                                <button className={styles.submitBtn}>
                                    CONFIRM BOOKING
                                </button>
                            </div>

                            <div className={styles.fullBookingLink}>
                                or <Link href="/booking" onClick={() => setIsOpen(false)}>go to full booking page</Link>
                            </div>
                        </motion.div>
                    </React.Fragment>
                )}
            </AnimatePresence>
        </>
    );
}
