"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./TravelerPostcards.module.css";
import { useLocale } from "./LocaleProvider";

import type { PostcardItem } from "@/types";

const POSTCARDS: PostcardItem[] = [
  {
    id: "postcard-01",
    stampVi: "Đoàn 06 khách · Hà Giang · Tháng 10",
    stampEn: "Group of 06 · Ha Giang · October",
    quoteTitleVi:
      "“Không có cảm giác đang đi tour, mà như về thăm nhà một người bạn lâu năm trên bản.”",
    quoteTitleEn:
      "“It never felt like a commercial tour—more like visiting an old friend's mountain home.”",
    bodyVi:
      "Buổi sáng ở Lao Xa, cả nhóm ngồi bên bếp củi nghe nghệ nhân người Mông kể chuyện đúc bạc và dệt lanh. Không ai phải vội vã nhìn đồng hồ để kịp điểm check-in tiếp theo.",
    bodyEn:
      "In Lao Xa village, our small group sat by the hearth listening to a H'Mong silversmith share his family craft. Nobody had to rush or check their watch for the next bus stop.",
    guestName: "Lê Minh Hoàng",
    guestRoleVi: "Kiến trúc sư · TP. Hồ Chí Minh",
    guestRoleEn: "Architect · Ho Chi Minh City",
  },
  {
    id: "postcard-02",
    stampVi: "Đoàn 04 khách · Cố đô Huế · Tháng 03",
    stampEn: "Group of 04 · Imperial Hue · March",
    quoteTitleVi:
      "“Bữa cơm chiều trong khu nhà vườn rêu phong ở Kim Long là kỷ niệm đẹp nhất chuyến đi.”",
    quoteTitleEn:
      "“Evening dinner inside a moss-grown Kim Long garden house was the soul of our journey.”",
    bodyVi:
      "Nếp dẫn chúng tôi đi đò ngang qua phá Tam Giang đúng giờ hoàng hôn vắng lặng nhất, rồi trở về dùng bữa chay truyền thống do chính gia chủ chuẩn bị dưới hiên nhà gỗ.",
    bodyEn:
      "Nep guided us across Tam Giang lagoon at the quietest hour of dusk, followed by a traditional vegetarian supper prepared by the family of a century-old wooden estate.",
    guestName: "Claire & Thomas Moreau",
    guestRoleVi: "Nhiếp ảnh gia · Lyon, Pháp",
    guestRoleEn: "Photographers · Lyon, France",
  },
  {
    id: "postcard-03",
    stampVi: "Gia đình 07 khách · Hội An & Ninh Bình · Tháng 06",
    stampEn: "Family of 07 · Hoi An & Ninh Binh · June",
    quoteTitleVi:
      "“Lịch trình thưa thoáng giúp bố mẹ lớn tuổi và hai bé nhỏ đều tận hưởng trọn vẹn.”",
    quoteTitleEn:
      "“The unhurried rhythm allowed both our elderly parents and young children to truly rest.”",
    bodyVi:
      "Khởi hành lúc 5h30 sáng trên sông Thu Bồn khi phố cổ chưa có bóng người là một quyết định tuyệt vời. Homestay bản địa ấm cúng, sạch tinh tươm và rất có gu.",
    bodyEn:
      "Setting out at 05:30 on the Thu Bon river before the town awoke was unforgettable. Every local homestay was spotless, warm, and deeply rooted in regional architecture.",
    guestName: "Trần Thu Hà",
    guestRoleVi: "Biên tập viên xuất bản · Hà Nội",
    guestRoleEn: "Publishing Editor · Hanoi",
  },
];

interface TravelerPostcardsProps {
  postcards?: PostcardItem[];
}

export default function TravelerPostcards({
  postcards,
}: TravelerPostcardsProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const items = postcards && postcards.length > 0 ? postcards : POSTCARDS;

  return (
    <section className={styles.postcardsSection} id="luu-but">
      <motion.div
        className={styles.headerGrid}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>
            {isEn
              ? "Field notes from past guests"
              : "Lưu bút từ người đồng hành"}
          </p>
          <h2 className={styles.heading}>
            {isEn
              ? "What remains after the journey"
              : "Dư âm đọng lại sau mỗi chuyến đi"}
          </h2>
        </div>

        <p className={styles.summary}>
          {isEn
            ? "Over 84% of our travelers return for a second regional route or refer close friends seeking quiet, unhurried cultural immersion."
            : "Hơn 84% khách từng đi cùng Nếp quay lại cho hành trình vùng miền tiếp theo hoặc giới thiệu cho bạn bè có chung gu thưởng ngoạn tĩnh lặng."}
        </p>
      </motion.div>

      <div className={styles.cardGrid}>
        {items.map((item, idx) => (
          <motion.article
            key={item.id}
            className={styles.postcard}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -30px 0px" }}
            transition={{
              duration: 0.62,
              delay: idx * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.stampRow}>
              <span className={styles.stampBadge}>
                {isEn ? item.stampEn : item.stampVi}
              </span>
            </div>

            <h3 className={styles.quoteTitle}>
              {isEn ? item.quoteTitleEn : item.quoteTitleVi}
            </h3>

            <p className={styles.quoteBody}>
              {isEn ? item.bodyEn : item.bodyVi}
            </p>

            <footer className={styles.guestFooter}>
              <strong className={styles.guestName}>{item.guestName}</strong>
              <span className={styles.guestRole}>
                {isEn ? item.guestRoleEn : item.guestRoleVi}
              </span>
            </footer>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
