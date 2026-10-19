"use client";

import React, { useState } from "react";
import styles from "./ContactSection.module.css";
import ScrollReveal from "./ScrollReveal";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
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
      <ScrollReveal className={styles.contactTop}>
        <p className={styles.eyebrow}>{dictionary.contact.eyebrow}</p>
        <span className={styles.contactMark} aria-hidden="true">✳</span>
      </ScrollReveal>

      <ScrollReveal className={styles.contactMain} delay={80}>
        <h2 className={styles.heading}>
          {dictionary.contact.headingMain}
          <br />
          <em>{dictionary.contact.headingItalic}</em>
        </h2>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
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
              {status === "submitting" ? <span className={styles.loadingDot} aria-hidden="true" /> : <FiArrowUpRight size={20} />}
            </button>
          </div>
          {feedback ? (
            <p className={`${styles.formMessage} ${status === "error" ? styles.formError : ""}`} role="status" aria-live="polite">
              {feedback}
            </p>
          ) : null}
        </form>
      </ScrollReveal>

      <ScrollReveal className={styles.contactBottom} delay={160}>
        <span>{dictionary.contact.tagline}</span>
        <a href="mailto:xin-chao@nepjourneys.vn" className={styles.mailLink}>XIN-CHAO@NEPJOURNEYS.VN ↗</a>
      </ScrollReveal>
    </section>
  );
}
