"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ContactSection.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";
import defaultSettings from "../../data/settings.json";
import type { SiteSettings } from "@/types";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

interface ContactSectionProps {
  settings?: SiteSettings;
}

export default function ContactSection({
  settings: propSettings,
}: ContactSectionProps) {
  const settings = propSettings || (defaultSettings as SiteSettings);
  const { locale, dictionary } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || status === "submitting") return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Contact submission failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const feedback =
    status === "success"
      ? dictionary.contact.successMsg
      : status === "error"
        ? locale === "en"
          ? "We could not save your email. Please try again in a moment."
          : "Nếp chưa thể lưu email của bạn. Vui lòng thử lại sau ít phút."
        : "";

  return (
    <section className={styles.contact} id="lien-he">
      <div className={styles.contactGrid}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.heading}>
            {dictionary.contact.headingMain} {dictionary.contact.headingItalic}
          </h2>
          <p className={styles.tagline}>{dictionary.contact.tagline}</p>

          <div className={styles.contactLinks}>
            <a
              href={`tel:${settings.hotline.replace(/\s/g, "")}`}
              className={styles.mailLink}
            >
              {settings.hotlineDisplay}
            </a>
            <a href={`mailto:${settings.email}`} className={styles.mailLink}>
              {settings.email}
            </a>
            <a
              href={settings.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mailLink}
            >
              {locale === "en" ? "Chat on Zalo" : "Nhắn tin qua Zalo"}
            </a>
          </div>
        </motion.div>

        <motion.form
          className={styles.contactForm}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <label htmlFor="contact-email" className={styles.formLabel}>
            {dictionary.contact.label}
          </label>
          <div className={styles.emailField}>
            <input
              id="contact-email"
              type="email"
              required
              autoComplete="email"
              placeholder={dictionary.contact.placeholder}
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "submitting"}
            />
            <button
              type="submit"
              className={styles.submitBtn}
              aria-label={dictionary.contact.submit}
              disabled={status === "submitting"}
            >
              <span>{dictionary.contact.submit}</span>
              <FiArrowUpRight size={17} aria-hidden="true" />
            </button>
          </div>
          <AnimatePresence mode="wait">
            {feedback ? (
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`${styles.formMessage} ${status === "error" ? styles.formError : ""}`}
                role="status"
                aria-live="polite"
              >
                {feedback}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}
