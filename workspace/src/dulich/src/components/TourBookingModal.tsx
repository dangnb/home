"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TourBookingModal.module.css";
import type { Tour } from "@/types";
import { useLocale } from "./LocaleProvider";
import { formatVND } from "@/lib/utils";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
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
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  useOverlayAccessibility(Boolean(tour), onClose, "#modal-close-button");

  const totalEstimated = useMemo(
    () => (tour ? tour.priceNumeric * guests : 0),
    [guests, tour],
  );

  if (!tour) return null;

  const title = isEn ? tour.titleEn : tour.title;
  const subtitle = isEn ? tour.subtitleEn : tour.subtitle;
  const duration = isEn ? tour.durationEn : tour.duration;
  const groupSize = isEn ? tour.groupSizeEn : tour.groupSize;
  const transport = isEn ? tour.transportEn : tour.transport;
  const regionLabel = isEn ? tour.regionLabelEn : tour.regionLabel;
  const highlights = isEn ? tour.highlightsEn : tour.highlights;

  const galleryImages =
    tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image];
  const currentBannerImg =
    galleryImages[activePhotoIdx] ?? galleryImages[0] ?? tour.image;

  const stepPhoto = (dir: 1 | -1) => {
    setActivePhotoIdx(
      (prev) => (prev + dir + galleryImages.length) % galleryImages.length,
    );
  };

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
      transition={{ duration: 0.25 }}
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] as const }}
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

        {/* Top Editorial Hero Split: Unobstructed Gallery (left) + Dark Forest Summary (right) */}
        <div className={styles.heroSplit}>
          <div className={styles.galleryStage}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentBannerImg}
                src={currentBannerImg}
                alt={title}
                className={styles.stageImage}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>

            <span className={styles.regionBadge}>{regionLabel}</span>

            {galleryImages.length > 1 && (
              <div className={styles.galleryBar}>
                <div className={styles.arrowGroup}>
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => stepPhoto(-1)}
                    aria-label={isEn ? "Previous photo" : "Ảnh trước"}
                  >
                    <FiArrowLeft size={15} />
                  </button>
                  <span className={styles.photoCounter}>
                    {activePhotoIdx + 1} / {galleryImages.length}
                  </span>
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => stepPhoto(1)}
                    aria-label={isEn ? "Next photo" : "Ảnh tiếp theo"}
                  >
                    <FiArrowRight size={15} />
                  </button>
                </div>

                <div
                  className={styles.thumbRow}
                  role="tablist"
                  aria-label={isEn ? "Tour photos" : "Thư viện ảnh hành trình"}
                >
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      role="tab"
                      aria-selected={idx === activePhotoIdx}
                      className={`${styles.thumbBtn} ${
                        idx === activePhotoIdx ? styles.thumbBtnActive : ""
                      }`}
                      onClick={() => setActivePhotoIdx(idx)}
                      aria-label={`${isEn ? "Photo" : "Ảnh"} ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="" className={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.heroSummary}>
            <div className={styles.metaPill}>
              <span>{tour.location}</span>
              <span aria-hidden="true">·</span>
              <span>{duration}</span>
            </div>

            <h2 id="tour-booking-title" className={styles.heroTitle}>
              {title}
            </h2>

            <p className={styles.heroSubtitle}>{subtitle}</p>

            <dl className={styles.specGrid}>
              <div className={styles.specCell}>
                <dt className={styles.specLabel}>
                  {dictionary.journeys.groupSize}
                </dt>
                <dd className={styles.specValue}>{groupSize}</dd>
              </div>
              <div className={styles.specCell}>
                <dt className={styles.specLabel}>
                  {dictionary.journeys.transport}
                </dt>
                <dd className={styles.specValue}>{transport}</dd>
              </div>
              <div className={styles.specCell}>
                <dt className={styles.specLabel}>
                  {dictionary.modal.pricePerGuest}
                </dt>
                <dd className={styles.specPrice}>{tour.price}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom Content Split: Itinerary & Highlights (left) + Reservation Form (right) */}
        <div className={styles.body}>
          <div className={styles.infoCol}>
            {tour.itinerary?.length ? (
              <div className={styles.dossierBlock}>
                <div className={styles.blockHeader}>
                  <h3 className={styles.sectionTitle}>
                    {dictionary.modal.itinerary}
                  </h3>
                  <span className={styles.blockSub}>
                    {duration} · {tour.location}
                  </span>
                </div>

                <div className={styles.itineraryList}>
                  {tour.itinerary.map((item) => (
                    <div key={item.day} className={styles.itineraryItem}>
                      <span className={styles.dayBadge}>
                        {dictionary.modal.day}{" "}
                        {String(item.day).padStart(2, "0")}
                      </span>
                      <span className={styles.dayRoute}>
                        {isEn ? item.titleEn : item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.dossierBlock}>
              <div className={styles.blockHeader}>
                <h3 className={styles.sectionTitle}>
                  {dictionary.modal.highlights}
                </h3>
              </div>
              <ul className={styles.highlightsList}>
                {highlights.map((item, index) => (
                  <li key={index} className={styles.highlightItem}>
                    <span className={styles.checkIcon} aria-hidden="true">
                      <FiCheck size={15} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.formCol}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>
                {isEn ? "Hold your spot" : "Phiếu giữ chỗ hành trình"}
              </h3>
              <p className={styles.formSub}>
                {isEn
                  ? "No immediate payment · Coordinator confirms within 24h"
                  : "Chưa cần thanh toán ngay · Điều phối viên xác nhận trong 24h"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
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
                      <span>
                        {dictionary.modal.pricePerGuest} ({guests}{" "}
                        {isEn ? "guests" : "khách"})
                      </span>
                      <span className={styles.unitPrice}>{tour.price}</span>
                    </div>
                    <div className={styles.priceRowTotal}>
                      <span>{dictionary.modal.estTotal}</span>
                      <span className={styles.totalPrice}>
                        {formatVND(totalEstimated)}
                      </span>
                    </div>
                  </div>

                  {errorMsg ? (
                    <div className={styles.formError} role="alert">
                      {errorMsg}
                    </div>
                  ) : null}

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="modal-guests">
                        {dictionary.modal.adultsCount}
                      </label>
                      <div className={styles.guestCounter}>
                        <button
                          type="button"
                          className={styles.counterBtn}
                          aria-label={
                            isEn ? "Decrease guests" : "Giảm số khách"
                          }
                          onClick={() => updateGuests(guests - 1)}
                        >
                          −
                        </button>
                        <output
                          className={styles.guestCount}
                          aria-live="polite"
                        >
                          {guests}
                        </output>
                        <button
                          type="button"
                          className={styles.counterBtn}
                          aria-label={
                            isEn ? "Increase guests" : "Tăng số khách"
                          }
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
                        onChange={(event) =>
                          setDepartureDate(event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="modal-name">
                        {dictionary.modal.fullName} *
                      </label>
                      <input
                        id="modal-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder={
                          isEn ? "Minh Anh Nguyen" : "Nguyễn Minh Anh"
                        }
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
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="modal-email">
                      {dictionary.modal.email}
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      autoComplete="email"
                      placeholder="minhanh@nepjourneys.vn"
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
