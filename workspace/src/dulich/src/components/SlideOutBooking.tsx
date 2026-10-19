"use client";

import React, { useState } from "react";
import styles from "./SlideOutBooking.module.css";
import type { Tour } from "@/types";
import { useLocale } from "./LocaleProvider";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { useOverlayAccessibility } from "@/hooks/useOverlayAccessibility";

interface SlideOutBookingProps {
  tours: Tour[];
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function SlideOutBooking({ tours }: SlideOutBookingProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const closeDrawer = () => setIsOpen(false);
  const { openWithTrigger } = useOverlayAccessibility(isOpen, closeDrawer, "#quick-tour");

  const openDrawer = (event: React.MouseEvent<HTMLButtonElement>) => {
    openWithTrigger(event.currentTarget);
    setStatus("idle");
    setErrorMsg("");
    setIsOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fullName || !phone || !selectedTourId || !departureDate) {
      setStatus("error");
      setErrorMsg(dictionary.drawer.errorMsg);
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const chosenTour = tours.find((tour) => tour.id === selectedTourId);
    const tourTitle = chosenTour
      ? isEn
        ? chosenTour.titleEn
        : chosenTour.title
      : selectedTourId;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          phone,
          tourId: selectedTourId,
          tourTitle,
          departureDate,
          guestsCount: guests,
          notes,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      setStatus("success");
      setFullName("");
      setPhone("");
      setDepartureDate("");
      setNotes("");
    } catch {
      setStatus("error");
      setErrorMsg(
        isEn
          ? "We could not send your request just yet. Please try again or call our hotline."
          : "Nếp chưa thể gửi yêu cầu của bạn. Vui lòng thử lại hoặc gọi hotline để được hỗ trợ ngay.",
      );
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.tabTrigger}
        onClick={openDrawer}
        aria-label={isEn ? "Open quick booking form" : "Mở form đặt tour nhanh"}
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <span>✦ {dictionary.drawer.tabTitle}</span>
      </button>

      {isOpen && (
        <>
          <div
            className={styles.drawerBackdrop}
            onClick={closeDrawer}
            role="presentation"
          />
          <aside
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-booking-heading"
          >
            <div className={styles.drawerHeader}>
              <div>
                <h3 id="quick-booking-heading" className={styles.drawerTitle}>
                  {dictionary.drawer.heading}
                </h3>
                <p className={styles.drawerSubtitle}>{dictionary.drawer.subheading}</p>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeDrawer}
                aria-label={dictionary.drawer.close}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {status === "success" ? (
                <div className={styles.successBox} role="status" aria-live="polite">
                  <FiCheckCircle size={42} aria-hidden="true" />
                  <h4>{dictionary.drawer.successTitle}</h4>
                  <p>{dictionary.drawer.successDesc}</p>
                  <button type="button" className={styles.successCloseBtn} onClick={closeDrawer}>
                    {dictionary.drawer.close}
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <p className={styles.formHint}>
                    {isEn ? "Fields marked with * are required." : "Các trường có dấu * là bắt buộc."}
                  </p>
                  {errorMsg && (
                    <div className={styles.formError} role="alert">
                      {errorMsg}
                    </div>
                  )}

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-tour">
                      {dictionary.drawer.selectTour} *
                    </label>
                    <select
                      id="quick-tour"
                      required
                      className={styles.select}
                      value={selectedTourId}
                      onChange={(event) => setSelectedTourId(event.target.value)}
                    >
                      <option value="">{dictionary.drawer.selectTourPlaceholder}</option>
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {isEn ? tour.titleEn : tour.title} ({tour.location} — {tour.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-name">
                      {dictionary.drawer.fullName} *
                    </label>
                    <input
                      id="quick-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={dictionary.drawer.fullNamePlaceholder}
                      className={styles.input}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-phone">
                      {dictionary.drawer.phone} *
                    </label>
                    <input
                      id="quick-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={dictionary.drawer.phonePlaceholder}
                      className={styles.input}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-date">
                      {dictionary.drawer.date} *
                    </label>
                    <input
                      id="quick-date"
                      type="date"
                      min={getToday()}
                      required
                      className={styles.input}
                      value={departureDate}
                      onChange={(event) => setDepartureDate(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-guests">
                      {dictionary.drawer.guests}
                    </label>
                    <input
                      id="quick-guests"
                      type="number"
                      min={1}
                      max={30}
                      inputMode="numeric"
                      className={styles.input}
                      value={guests}
                      onChange={(event) => setGuests(Math.min(30, Math.max(1, Number(event.target.value) || 1)))}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="quick-notes">
                      {dictionary.drawer.notes}
                    </label>
                    <textarea
                      id="quick-notes"
                      rows={3}
                      className={styles.textarea}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>

                  <button type="submit" disabled={status === "submitting"} className={styles.submitBtn}>
                    {status === "submitting" ? dictionary.drawer.submitting : dictionary.drawer.submit}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
