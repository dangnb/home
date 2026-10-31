"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./IntroSection.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

interface RhythmMoment {
  id: string;
  timeVi: string;
  timeEn: string;
  labelVi: string;
  labelEn: string;
  placeVi: string;
  placeEn: string;
  storyVi: string;
  storyEn: string;
  detailVi: string;
  detailEn: string;
  image: string;
}

const RHYTHM_MOMENTS: RhythmMoment[] = [
  {
    id: "morning",
    timeVi: "05:45 · Sương sớm",
    timeEn: "05:45 · First light",
    labelVi: "Buổi sớm",
    labelEn: "Morning",
    placeVi: "Tràng An và Hoàng Su Phì",
    placeEn: "Trang An and Hoang Su Phi",
    storyVi:
      "Thuyền rời bến khi mặt nước còn phẳng lặng chưa bóng người, hoặc ngồi bên bếp củi uống chén trà Shan Tuyết đầu tiên trước khi mây tan trên thửa ruộng bậc thang.",
    storyEn:
      "Set out by wooden boat while the limestone waterways are still mirror-calm, or sit by the hearth with the first cup of Shan Tuyet tea before mist lifts off the terraces.",
    detailVi: "Không báo thức · Khởi hành theo ánh mặt trời",
    detailEn: "No alarm · Guided by daylight",
    image:
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "afternoon",
    timeVi: "14:30 · Hiên nhà nghề",
    timeEn: "14:30 · The artisan porch",
    labelVi: "Buổi chiều",
    labelEn: "Afternoon",
    placeVi: "Làng thêu Văn Lâm và Trà Quế",
    placeEn: "Van Lam and Tra Que villages",
    storyVi:
      "Dành trọn buổi chiều bên khung thêu gỗ hoặc mảnh vườn rau thơm, lắng nghe người thợ kể chuyện nghề qua ba thế hệ thay vì ghé qua mười lăm phút chụp ảnh.",
    storyEn:
      "Spend an unhurried afternoon beside a wooden embroidery frame or herb garden, hearing three generations of craft directly from the makers rather than rushing through.",
    detailVi: "Trò chuyện trực tiếp cùng nghệ nhân bản địa",
    detailEn: "Unhurried time with local makers",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "evening",
    timeVi: "18:45 · Cơm nhà lên đèn",
    timeEn: "18:45 · Lanterns and supper",
    labelVi: "Chiều muộn",
    labelEn: "Evening",
    placeVi: "Nhà vườn Kim Long và Côn Sơn",
    placeEn: "Kim Long garden houses and Con Son",
    storyVi:
      "Bữa tối nấu theo mùa trong sân nhà vườn cổ ở Huế hoặc bên bờ vịnh tĩnh lặng, nơi câu chuyện kéo dài tự nhiên mà không bị thúc giục bởi lịch trình.",
    storyEn:
      "A seasonal supper in a historic Hue garden house or beside a quiet island bay, where conversation unfolds naturally without a timetable waiting.",
    detailVi: "Ẩm thực theo mùa tại không gian riêng tư",
    detailEn: "Seasonal dining in private courtyards",
    image:
      "https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function IntroSection() {
  const { locale, dictionary } = useLocale();
  const [activeId, setActiveId] = useState<string>("morning");
  const isEn = locale === "en";

  const activeMoment =
    RHYTHM_MOMENTS.find((m) => m.id === activeId) ?? RHYTHM_MOMENTS[0];

  return (
    <section className={styles.intro} id="ban-sac">
      <div className={styles.introGrid}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.heading}>
            {dictionary.intro.heading} {dictionary.intro.headingItalic}
          </h2>

          <p className={styles.body}>{dictionary.intro.body}</p>

          <div className={styles.rhythmSwitcher}>
            <p className={styles.switcherTitle}>
              {isEn
                ? "Explore a day at Nếp's pace"
                : "Trải nghiệm một ngày theo nhịp của Nếp"}
            </p>
            <div
              className={styles.tabGroup}
              role="tablist"
              aria-label={isEn ? "Daily rhythm" : "Nhịp đi trong ngày"}
            >
              {RHYTHM_MOMENTS.map((moment) => {
                const selected = moment.id === activeMoment.id;
                return (
                  <button
                    key={moment.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`${styles.tabBtn} ${
                      selected ? styles.tabBtnActive : ""
                    }`}
                    onClick={() => setActiveId(moment.id)}
                  >
                    {isEn ? moment.labelEn : moment.labelVi}
                  </button>
                );
              })}
            </div>
          </div>

          <a href="#cach-di" className={styles.textLink}>
            <span>{dictionary.intro.moreLink}</span>
            <FiArrowUpRight size={16} aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
          transition={{
            duration: 0.7,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className={styles.stageCard}>
            <div className={styles.stageImageWrap}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeMoment.id}
                  src={activeMoment.image}
                  alt={isEn ? activeMoment.placeEn : activeMoment.placeVi}
                  className={styles.stageImage}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>

            <div className={styles.stageBody}>
              <div className={styles.stageMeta}>
                <span className={styles.stageTime}>
                  {isEn ? activeMoment.timeEn : activeMoment.timeVi}
                </span>
                <span className={styles.stagePlace}>
                  {isEn ? activeMoment.placeEn : activeMoment.placeVi}
                </span>
              </div>

              <p className={styles.stageStory}>
                {isEn ? activeMoment.storyEn : activeMoment.storyVi}
              </p>

              <p className={styles.stageDetail}>
                {isEn ? activeMoment.detailEn : activeMoment.detailVi}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
