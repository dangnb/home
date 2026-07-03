"use client";
import styles from "./page.module.css";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LiênHệPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                Swal.fire({
                    title: "Gửi thành công!",
                    text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
                    icon: "success",
                    confirmButtonColor: "#01bf93",
                });
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                const data = await res.json();
                Swal.fire({
                    title: "Lỗi!",
                    text: data.error || "Không thể gửi tin nhắn. Vui lòng thử lại.",
                    icon: "error",
                    confirmButtonColor: "#ef4444",
                });
            }
        } catch {
            Swal.fire({
                title: "Lỗi kết nối!",
                text: "Không thể kết nối với máy chủ.",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setStatus("idle");
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.hero}>
                <img src="/images/banner_desktop.webp" alt="Liên hệ" className={styles.heroBg} />
                <div className={styles.heroOverlay} />
                <div className={`container ${styles.heroContent}`}>
                    <h1 className={styles.title}>Liên Hệ Với Chúng Tôi</h1>
                    <p className={styles.subtitle}>Sẵn sàng hỗ trợ bạn 24/7</p>
                </div>
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>📍</div>
                        <div className={styles.infoText}>
                            <h3>Văn phòng</h3>
                            <p>Bến Du Thuyền Sông Hàn, Đường Bạch Đằng, Hải Châu, Đà Nẵng</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>📞</div>
                        <div className={styles.infoText}>
                            <h3>Hotline / Zalo</h3>
                            <p>0796.768.636</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>✉️</div>
                        <div className={styles.infoText}>
                            <h3>Email</h3>
                            <p>contact@duthuyensonghan.com</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>⏰</div>
                        <div className={styles.infoText}>
                            <h3>Giờ làm việc</h3>
                            <p>Thứ 2 - Chủ Nhật: 08:00 - 22:00</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formBox}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label}>Họ và tên *</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Số điện thoại *</label>
                            <input
                                type="tel"
                                className={styles.input}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email (không bắt buộc)</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Chủ đề *</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Nội dung tin nhắn *</label>
                            <textarea
                                className={styles.textarea}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                            {status === "loading" ? "Đang gửi..." : "Gửi Liên Hệ"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
