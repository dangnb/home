"use client";

import { useState } from "react";
import "./ContactForm.css";

interface ContactFormProps {
  lang: string;
}

export default function ContactForm({ lang }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const t = {
    title: lang === "vi" ? "Gửi Tin Nhắn Cho Chúng Tôi" : "Send Us A Message",
    name: lang === "vi" ? "Họ và Tên *" : "Full Name *",
    email: lang === "vi" ? "Email *" : "Email Address *",
    phone: lang === "vi" ? "Số điện thoại" : "Phone Number",
    message: lang === "vi" ? "Lời nhắn *" : "Your Message *",
    submit: lang === "vi" ? "Gửi Tin Nhắn" : "Send Message",
    sending: lang === "vi" ? "Đang gửi..." : "Sending...",
    success: lang === "vi" ? "Cảm ơn bạn! Lời nhắn của bạn đã được gửi thành công." : "Thank you! Your message has been sent successfully.",
    error: lang === "vi" ? "Có lỗi xảy ra. Vui lòng thử lại sau." : "An error occurred. Please try again later.",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <h3 className="contact-form-title">{t.title}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t.name}</label>
          <input type="text" name="name" className="form-input" required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.email}</label>
            <input type="email" name="email" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.phone}</label>
            <input type="tel" name="phone" className="form-input" />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t.message}</label>
          <textarea name="message" className="form-textarea" required></textarea>
        </div>
        
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <><div className="spinner"></div> {t.sending}</>
          ) : (
            <>{t.submit} <i className="ph-bold ph-paper-plane-right"></i></>
          )}
        </button>
        
        {status === "success" && (
          <div className="form-message success">
            <i className="ph-fill ph-check-circle" style={{ fontSize: "20px" }}></i>
            {t.success}
          </div>
        )}
        
        {status === "error" && (
          <div className="form-message error">
            <i className="ph-fill ph-warning-circle" style={{ fontSize: "20px" }}></i>
            {t.error}
          </div>
        )}
      </form>
    </div>
  );
}
