"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Booking.module.css";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function BookingClient() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    branch: "",
    serviceId: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: ""
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className={styles.bookingWrapper}>
      
      {/* Progress Bar */}
      {step < 5 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${((step - 1) / 3) * 100}%` }} />
          <div className={styles.steps}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`${styles.stepIndicator} ${step >= s ? styles.activeStep : ""}`}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      {step > 1 && step < 5 && (
        <button onClick={prevStep} className={styles.backBtn}>
          <FaArrowLeft /> Back
        </button>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Branch Selection */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={styles.stepTitle}>Select Branch</h3>
            <div className={styles.grid2}>
              <div 
                className={`${styles.selectCard} ${formData.branch === "Praha 12" ? styles.selectedCard : ""}`}
                onClick={() => setFormData({ ...formData, branch: "Praha 12" })}
              >
                <h4>Suli Salon - Praha 12</h4>
                <p>Nové Dvory 123, 142 00 Praha 4</p>
                {formData.branch === "Praha 12" && <FaCheckCircle className={styles.checkIcon} />}
              </div>
              <div 
                className={`${styles.selectCard} ${formData.branch === "Center" ? styles.selectedCard : ""}`}
                onClick={() => setFormData({ ...formData, branch: "Center" })}
              >
                <h4>Suli Salon - Center</h4>
                <p>Wenceslas Square 1, 110 00 Praha 1</p>
                {formData.branch === "Center" && <FaCheckCircle className={styles.checkIcon} />}
              </div>
            </div>
            <button 
              className={styles.nextBtn} 
              disabled={!formData.branch}
              onClick={nextStep}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 2: Service Selection */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={styles.stepTitle}>Select Service</h3>
            <div className={styles.listSelection}>
              <div 
                className={`${styles.listItem} ${formData.serviceId === "1" ? styles.selectedCard : ""}`}
                onClick={() => setFormData({ ...formData, serviceId: "1" })}
              >
                <div className={styles.serviceInfo}>
                  <h4>Classic Manicure</h4>
                  <p>45 min</p>
                </div>
                <div className={styles.servicePrice}>500 CZK</div>
                {formData.serviceId === "1" && <FaCheckCircle className={styles.checkIcon} />}
              </div>
              <div 
                className={`${styles.listItem} ${formData.serviceId === "2" ? styles.selectedCard : ""}`}
                onClick={() => setFormData({ ...formData, serviceId: "2" })}
              >
                <div className={styles.serviceInfo}>
                  <h4>Gel Polish Manicure</h4>
                  <p>60 min</p>
                </div>
                <div className={styles.servicePrice}>700 CZK</div>
                {formData.serviceId === "2" && <FaCheckCircle className={styles.checkIcon} />}
              </div>
              <div 
                className={`${styles.listItem} ${formData.serviceId === "4" ? styles.selectedCard : ""}`}
                onClick={() => setFormData({ ...formData, serviceId: "4" })}
              >
                <div className={styles.serviceInfo}>
                  <h4>Spa Pedicure</h4>
                  <p>60 min</p>
                </div>
                <div className={styles.servicePrice}>800 CZK</div>
                {formData.serviceId === "4" && <FaCheckCircle className={styles.checkIcon} />}
              </div>
            </div>
            <button 
              className={styles.nextBtn} 
              disabled={!formData.serviceId}
              onClick={nextStep}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 3: Date & Time */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={styles.stepTitle}>Select Date & Time</h3>
            <input 
              type="date" 
              className={styles.inputField}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            
            <h4 className={styles.subLabel}>Available Times:</h4>
            <div className={styles.timeGrid}>
              {["10:00", "11:00", "13:30", "15:00", "16:30"].map(t => (
                <div 
                  key={t}
                  className={`${styles.timeSlot} ${formData.time === t ? styles.selectedTime : ""}`}
                  onClick={() => setFormData({ ...formData, time: t })}
                >
                  {t}
                </div>
              ))}
            </div>

            <button 
              className={styles.nextBtn} 
              disabled={!formData.date || !formData.time}
              onClick={nextStep}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 4: Personal Details */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={styles.stepTitle}>Your Details</h3>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                placeholder="Full Name" 
                className={styles.inputField} 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className={styles.inputField}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className={styles.inputField}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className={styles.summaryBox}>
              <h4>Booking Summary</h4>
              <p><strong>Branch:</strong> {formData.branch}</p>
              <p><strong>Date & Time:</strong> {formData.date} at {formData.time}</p>
            </div>

            <button 
              className={styles.confirmBtn} 
              disabled={!formData.name || !formData.phone}
              onClick={nextStep}
            >
              Confirm Booking
            </button>
          </motion.div>
        )}

        {/* STEP 5: Success */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.successState}>
            <div className={styles.successIcon}><FaCheckCircle size={60} /></div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you, {formData.name}. Your appointment for {formData.date} at {formData.time} is confirmed.</p>
            <p>We have sent a confirmation email to {formData.email}.</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
