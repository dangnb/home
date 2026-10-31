"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SeasonalCompass.module.css";
import { useLocale } from "./LocaleProvider";
import type { Tour } from "@/types";
import { FiArrowUpRight } from "react-icons/fi";

interface SeasonalCompassProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

interface SeasonEntry {
  id: string;
  nameVi: string;
  nameEn: string;
  monthsVi: string;
  monthsEn: string;
  temp: string;
  weatherVi: string;
  weatherEn: string;
  headlineVi: string;
  headlineEn: string;
  storyVi: string;
  storyEn: string;
  destinationsVi: string;
  destinationsEn: string;
  recommendedTourId: string;
  image: string;
}

const SEASONS: SeasonEntry[] = [
  {
    id: "autumn",
    nameVi: "Mùa Thu",
    nameEn: "Autumn",
    monthsVi: "Tháng 9 – Tháng 11",
    monthsEn: "Sep – Nov",
    temp: "16°C – 24°C",
    weatherVi: "Nắng hanh vàng · Sương sớm vùng cao",
    weatherEn: "Crisp golden sun · Highland morning mist",
    headlineVi: "Mùa lúa chín vàng và sương sớm trên cao nguyên đá",
    headlineEn: "Golden harvest terraces and mist over the karst plateau",
    storyVi:
      "Thời điểm đẹp nhất để đi bộ qua những thung lũng đá tai mèo Hà Giang, ngắm lúa chín ở Mù Cang Chải hoặc chèo thuyền sớm giữa tiết trời se lạnh của Ninh Bình.",
    storyEn:
      "The finest months for walking Ha Giang's limestone valleys, witnessing golden rice harvests in the northern highlands, and rowing quiet wetlands in Ninh Binh.",
    destinationsVi: "Hà Giang · Mù Cang Chải · Ninh Bình",
    destinationsEn: "Ha Giang · Mu Cang Chai · Ninh Binh",
    recommendedTourId: "ha-giang-mua-da-no",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "winter",
    nameVi: "Mùa Đông",
    nameEn: "Winter",
    monthsVi: "Tháng 12 – Tháng 2",
    monthsEn: "Dec – Feb",
    temp: "14°C – 26°C",
    weatherVi: "Se lạnh miền núi · Biển phương Nam êm dịu",
    weatherEn: "Cool pine highlands · Calm southern seas",
    headlineVi: "Biển mây dưới tán thông già và nắng ấm đảo phương Nam",
    headlineEn: "Cloud seas in old-growth pines and calm southern coves",
    storyVi:
      "Khi miền Bắc chìm trong sương núi, Tây Nguyên vào mùa săn mây và hoa dã quỳ, còn bờ biển Bắc đảo Phú Quốc bước vào mùa nước trong vắt và êm sóng nhất năm.",
    storyEn:
      "While northern valleys rest in winter mist, Da Lat's pine hills glow with morning cloud seas and Phu Quoc's northern coast enters its calmest, clearest season.",
    destinationsVi: "Đà Lạt · Cầu Đất · Đảo Phú Quốc",
    destinationsEn: "Da Lat · Cau Dat · Phu Quoc Island",
    recommendedTourId: "da-lat-suong-som-va-rung-thong",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "spring",
    nameVi: "Mùa Xuân",
    nameEn: "Spring",
    monthsVi: "Tháng 3 – Tháng 5",
    monthsEn: "Mar – May",
    temp: "20°C – 28°C",
    weatherVi: "Tiết trời dịu mát · Cây cối đâm chồi",
    weatherEn: "Mild breezes · Blossoming garden estates",
    headlineVi: "Những khu vườn cổ xứ Huế và đầm phá miền Trung",
    headlineEn: "Ancestral garden houses and tranquil central lagoons",
    storyVi:
      "Mùa xuân khô ráo và dịu nắng ở miền Trung là lúc lý tưởng để tản bộ qua những phủ đệ Kim Long, thưởng trà sen và đón hoàng hôn tím trên phá Tam Giang.",
    storyEn:
      "Dry, gentle spring days in Central Vietnam invite slow walks through moss-grown Kim Long garden houses, lotus tea sessions, and sunset crossings on Tam Giang lagoon.",
    destinationsVi: "Cố đô Huế · Phá Tam Giang · Làng cổ Phước Tích",
    destinationsEn: "Imperial Hue · Tam Giang Lagoon · Phuoc Tich",
    recommendedTourId: "hue-nha-nhac-va-vuon-xua",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "summer",
    nameVi: "Mùa Hạ",
    nameEn: "Summer",
    monthsVi: "Tháng 6 – Tháng 8",
    monthsEn: "Jun – Aug",
    temp: "24°C – 31°C",
    weatherVi: "Bình minh trong trẻo · Mùa sen nở rộ",
    weatherEn: "Luminous dawns · Lotus season in full bloom",
    headlineVi: "Thuyền sớm qua đầm sen đá vôi và làng nghề ven sông",
    headlineEn: "Dawn boats through lotus wetlands and river craft villages",
    storyVi:
      "Nếp chọn khởi hành từ 05:30 sáng khi nắng mới vừa chạm mặt đầm Vân Long mùa sen nở, và xuôi dòng Thu Bồn mát rượi về các làng mộc, làng gốm xứ Quảng.",
    storyEn:
      "We set out at 05:30 as first light touches blooming lotus ponds in Ninh Binh and sail down the breezy Thu Bon river to traditional carpentry and pottery villages.",
    destinationsVi: "Hội An · Sông Thu Bồn · Đầm Vân Long",
    destinationsEn: "Hoi An · Thu Bon River · Van Long Wetland",
    recommendedTourId: "hoi-an-lang-nghe-ven-song",
    image:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1600&q=85",
  },
];

export default function SeasonalCompass({
  tours,
  onSelectTour,
}: SeasonalCompassProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const [activeSeasonId, setActiveSeasonId] = useState<string>("autumn");

  const activeSeason =
    SEASONS.find((s) => s.id === activeSeasonId) ?? SEASONS[0];
  const recommendedTour = tours.find(
    (t) => t.id === activeSeason.recommendedTourId,
  );

  return (
    <section className={styles.compassSection} id="la-ban-mua">
      <div className={styles.compassGrid}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.eyebrow}>
            {isEn ? "Seasonal travel compass" : "La bàn mùa đi trong năm"}
          </p>
          <h2 className={styles.heading}>
            {isEn ? "Where to journey" : "Mỗi mùa một miền"}
            <br />
            <em>{isEn ? "by the season" : "di sản đẹp nhất"}</em>
          </h2>
          <p className={styles.lead}>
            {isEn
              ? "Vietnam spans three climate zones. Select a season to see the finest weather windows and our recommended slow route."
              : "Khí hậu Việt Nam biến chuyển theo từng vĩ độ. Chọn mùa dự kiến của bạn để xem thời tiết đẹp nhất và tuyến hành trình gợi ý từ Nếp."}
          </p>

          <div
            className={styles.seasonList}
            role="tablist"
            aria-label={isEn ? "Select season" : "Chọn mùa khởi hành"}
          >
            {SEASONS.map((season) => {
              const isSelected = season.id === activeSeason.id;
              return (
                <button
                  key={season.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-active={isSelected}
                  className={styles.seasonTab}
                  onClick={() => setActiveSeasonId(season.id)}
                >
                  <span className={styles.seasonName}>
                    {isEn ? season.nameEn : season.nameVi}
                  </span>
                  <span className={styles.seasonMonths}>
                    {isEn ? season.monthsEn : season.monthsVi}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -30px 0px" }}
          transition={{
            duration: 0.68,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSeason.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className={styles.seasonCard}
            >
              <div className={styles.mediaWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSeason.image}
                  alt={isEn ? activeSeason.headlineEn : activeSeason.headlineVi}
                  className={styles.seasonImage}
                />
                <div className={styles.climateBar}>
                  <span className={styles.tempBadge}>{activeSeason.temp}</span>
                  <span className={styles.weatherText}>
                    {isEn ? activeSeason.weatherEn : activeSeason.weatherVi}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.destinationsLine}>
                  {isEn
                    ? activeSeason.destinationsEn
                    : activeSeason.destinationsVi}
                </p>

                <h3 className={styles.cardHeadline}>
                  {isEn ? activeSeason.headlineEn : activeSeason.headlineVi}
                </h3>

                <p className={styles.cardStory}>
                  {isEn ? activeSeason.storyEn : activeSeason.storyVi}
                </p>

                {recommendedTour && (
                  <div className={styles.recommendBar}>
                    <div className={styles.recommendInfo}>
                      <span className={styles.recommendLabel}>
                        {isEn
                          ? "Recommended route for this season"
                          : "Hành trình tiêu biểu mùa này"}
                      </span>
                      <strong className={styles.recommendTitle}>
                        {isEn
                          ? recommendedTour.titleEn
                          : recommendedTour.title}{" "}
                        · {recommendedTour.price}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className={styles.inspectBtn}
                      onClick={() => onSelectTour(recommendedTour)}
                    >
                      <span>
                        {isEn ? "Inspect route" : "Xem lịch trình này"}
                      </span>
                      <FiArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
