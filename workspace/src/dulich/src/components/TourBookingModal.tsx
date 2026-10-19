"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TourBookingModal.module.css";
import type { Tour } from "@/types";
import { useLocale } from "./LocaleProvider";
import { formatVND } from "@/lib/utils";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { useOverlayAccessibility } from "@/hooks/useOverlayAccessibility";

interface TourBookingModalProps {
  tour: Tour | null;
  onClose: () => void;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function TourBookingModal({
  tour,
  onClose,
}: TourBookingModalProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";
  const [guests, setGuests] = useState(2);
  const [departureDate, setDepartureDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  useOverlayAccessibility(Boolean(tour), onClose, "#modal-close-button");

  const totalEstimated = useMemo(
    () => (tour ? tour.priceNumeric * guests : 0),
    [guests, tour],
  );

  if (!tour) return null;

  const title = isEn ? tour.titleEn : tour.title;
  const duration = isEn ? tour.durationEn : tour.duration;
  const highlights = isEn ? tour.highlightsEn : tour.highlights;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fullName || !phone || !departureDate) {
      setStatus("error");
      setErrorMsg(
        isEn
          ? "Please complete the required details."
          : "Vui lòng điền đủ các thông tin bắt buộc.",
      );
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          phone,
          email,
          tourId: tour.id,
          tourTitle: title,
          departureDate,
          guestsCount: guests,
          notes: note,
          totalEstimatedPrice: formatVND(totalEstimated),
        }),
      });

      if (!response.ok) throw new Error("Booking submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(
        isEn
          ? "We could not send your booking. Please try again or call our hotline for immediate support."
          : "Nếp chưa thể gửi yêu cầu đặt tour. Vui lòng thử lại hoặc gọi hotline để được hỗ trợ ngay.",
      );
    }
  };

  const updateGuests = (nextValue: number) => {
    setGuests(Math.max(1, Math.min(30, nextValue)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-booking-title"
      >
        <button
          id="modal-close-button"
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={dictionary.modal.close}
        >
          <FiX size={18} />
        </button>

        <div className={styles.banner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tour.image} alt={title} className={styles.bannerImage} />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerMeta}>
              <span>{tour.location}</span>
              <span aria-hidden="true">·</span>
              <span>{duration}</span>
            </div>
            <h2 id="tour-booking-title" className={styles.bannerTitle}>
              {title}
            </h2>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.infoCol}>
            <div>
              <h3 className={styles.sectionTitle}>
                {dictionary.modal.highlights}
              </h3>
              <ul className={styles.highlightsList}>
                {highlights.map((item, index) => (
                  <li key={index} className={styles.highlightItem}>
                    <span
                      className={styles.highlightBullet}
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {tour.itinerary?.length ? (
              <div>
                <h3 className={styles.sectionTitle}>
                  {dictionary.modal.itinerary}
                </h3>
                <div className={styles.itineraryList}>
                  {tour.itinerary.map((item) => (
                    <div key={item.day} className={styles.itineraryItem}>
                      <span className={styles.dayBadge}>
                        {dictionary.modal.day} {item.day}
                      </span>
                      <span>{isEn ? item.titleEn : item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.formCol}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={styles.successAlert}
                  role="status"
                  aria-live="polite"
                >
                  <FiCheckCircle size={36} aria-hidden="true" />
                  <h4>{dictionary.drawer.successTitle}</h4>
                  <p>{dictionary.drawer.successDesc}</p>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={onClose}
                  >
                    {dictionary.modal.close}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.bookingForm}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className={styles.priceBox}>
                    <div className={styles.priceRow}>
                      <span>{dictionary.modal.pricePerGuest}:</span>
                      <span className={styles.unitPrice}>{tour.price}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>{dictionary.modal.estTotal}:</span>
                      <span className={styles.totalPrice}>
                        {formatVND(totalEstimated)}
                      </span>
                    </div>
                  </div>

                  <p className={styles.formHint}>
                    {isEn
                      ? "Fields marked with * are required."
                      : "Các trường có dấu * là bắt buộc."}
                  </p>
                  {errorMsg ? (
                    <div className={styles.formError} role="alert">
                      {errorMsg}
                    </div>
                  ) : null}

                  <div className={styles.field}>
                    <label htmlFor="modal-guests">
                      {dictionary.modal.adultsCount}
                    </label>
                    <div className={styles.guestCounter}>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        aria-label={isEn ? "Decrease guests" : "Giảm số khách"}
                        onClick={() => updateGuests(guests - 1)}
                      >
                        −
                      </button>
                      <output className={styles.guestCount} aria-live="polite">
                        {guests}
                      </output>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        aria-label={isEn ? "Increase guests" : "Tăng số khách"}
                        onClick={() => updateGuests(guests + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-date">
                      {dictionary.modal.departureDate} *
                    </label>
                    <input
                      id="modal-date"
                      type="date"
                      min={getToday()}
                      required
                      className={styles.input}
                      value={departureDate}
                      onChange={(event) => setDepartureDate(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-name">
                      {dictionary.modal.fullName} *
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      className={styles.input}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-phone">
                      {dictionary.modal.phone} *
                    </label>
                    <input
                      id="modal-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="090 123 4567"
                      className={styles.input}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-email">
                      {dictionary.modal.email}
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      autoComplete="email"
                      placeholder="email@example.com"
                      className={styles.input}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-notes">{dictionary.modal.note}</label>
                    <textarea
                      id="modal-notes"
                      rows={2}
                      placeholder={dictionary.modal.notePlaceholder}
                      className={styles.textarea}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={styles.submitBtn}
                  >
                    {status === "submitting"
                      ? dictionary.modal.submitting
                      : dictionary.modal.confirmBooking}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
