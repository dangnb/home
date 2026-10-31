"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./DestinationGallery.module.css";
import { useLocale } from "./LocaleProvider";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";

import type { DestinationPhoto } from "@/types";

const DESTINATIONS: DestinationPhoto[] = [
  {
    id: "dong-van-ha-giang",
    region: "bac",
    regionLabelVi: "Miền Bắc",
    regionLabelEn: "Northern Vietnam",
    nameVi: "Cao nguyên đá Đồng Văn & Mã Pì Lèng",
    nameEn: "Dong Van Karst Plateau & Ma Pi Leng",
    provinceVi: "Hà Giang",
    provinceEn: "Ha Giang",
    seasonVi: "Mùa đẹp nhất: Tháng 9 đến Tháng 3",
    seasonEn: "Best season: September to March",
    timeOfDayVi: "Bình minh · 05:45",
    timeOfDayEn: "First light · 05:45",
    storyVi:
      "Sương sớm phủ lên những nếp nhà trình tường đất nện của người Lô Lô dưới chân núi đá tai mèo xám trầm.",
    storyEn:
      "Morning mist drifts across rammed-earth Lo Lo homes nestled beneath jagged grey limestone peaks.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85",
    spanWide: true,
  },
  {
    id: "vinh-lan-ha",
    region: "bac",
    regionLabelVi: "Miền Bắc",
    regionLabelEn: "Northern Vietnam",
    nameVi: "Vịnh Lan Hạ & Đảo Cát Bà",
    nameEn: "Lan Ha Bay & Cat Ba Archipelago",
    provinceVi: "Hải Phòng · Quảng Ninh",
    provinceEn: "Hai Phong · Quang Ninh",
    seasonVi: "Mùa đẹp nhất: Tháng 10 đến Tháng 4",
    seasonEn: "Best season: October to April",
    timeOfDayVi: "Sớm mai · 06:15",
    timeOfDayEn: "Early morning · 06:15",
    storyVi:
      "Hàng trăm tháp đá vôi phủ rừng xanh nổi lên giữa mặt vịnh tĩnh lặng, tách biệt khỏi các luồng tàu du lịch lớn.",
    storyEn:
      "Forested limestone towers rise from calm emerald waters far from the main cruise channels.",
    image:
      "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "trang-an-ninh-binh",
    region: "bac",
    regionLabelVi: "Miền Bắc",
    regionLabelEn: "Northern Vietnam",
    nameVi: "Đầm Vân Long & Tràng An",
    nameEn: "Van Long Wetland & Trang An",
    provinceVi: "Ninh Bình",
    provinceEn: "Ninh Binh",
    seasonVi: "Mùa đẹp nhất: Tháng 5 đến Tháng 10",
    seasonEn: "Best season: May to October",
    timeOfDayVi: "Chuyến đò đầu · 06:00",
    timeOfDayEn: "First boat · 06:00",
    storyVi:
      "Mặt nước phẳng như gương phản chiếu vách núi đá vôi và những cánh đồng lúa chín vàng dọc triền đê cổ.",
    storyEn:
      "Mirror-still wetlands reflect sheer karst cliffs and golden rice paddies along quiet village dykes.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "dai-noi-pha-tam-giang",
    region: "trung",
    regionLabelVi: "Miền Trung",
    regionLabelEn: "Central Vietnam",
    nameVi: "Cố đô Huế & Đầm phá Tam Giang",
    nameEn: "Imperial Hue & Tam Giang Lagoon",
    provinceVi: "Thừa Thiên Huế",
    provinceEn: "Thua Thien Hue",
    seasonVi: "Mùa đẹp nhất: Tháng 2 đến Tháng 8",
    seasonEn: "Best season: February to August",
    timeOfDayVi: "Hoàng hôn · 17:20",
    timeOfDayEn: "Dusk · 17:20",
    storyVi:
      "Từ những phủ đệ rêu phong ở Kim Long đến vùng đầm phá nước lợ mênh mông khi chiều buông xuống nhịp chèo gỗ.",
    storyEn:
      "From moss-grown garden estates in Kim Long to vast brackish lagoons glowing at sunset.",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "pho-co-hoi-an",
    region: "trung",
    regionLabelVi: "Miền Trung",
    regionLabelEn: "Central Vietnam",
    nameVi: "Phố cổ Hội An & Sông Thu Bồn",
    nameEn: "Hoi An Ancient Town & Thu Bon River",
    provinceVi: "Quảng Nam",
    provinceEn: "Quang Nam",
    seasonVi: "Mùa đẹp nhất: Tháng 2 đến Tháng 7",
    seasonEn: "Best season: February to July",
    timeOfDayVi: "Tinh mơ · 05:30",
    timeOfDayEn: "Dawn · 05:30",
    storyVi:
      "Những dãy nhà gỗ tường vàng bên bến sông Thu Bồn vào khoảnh khắc bình minh tĩnh mịch trước giờ phố lên đèn.",
    storyEn:
      "Ochre-walled merchant houses along the Thu Bon riverbanks in the quiet hour of dawn.",
    image:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1600&q=85",
    spanWide: true,
  },
  {
    id: "rung-thong-da-lat",
    region: "nam",
    regionLabelVi: "Tây Nguyên & Nam Bộ",
    regionLabelEn: "Highlands & South",
    nameVi: "Rừng thông Cầu Đất & Hồ Tuyền Lâm",
    nameEn: "Cau Dat Pine Forest & Tuyen Lam",
    provinceVi: "Đà Lạt · Lâm Đồng",
    provinceEn: "Da Lat · Lam Dong",
    seasonVi: "Mùa đẹp nhất: Tháng 11 đến Tháng 4",
    seasonEn: "Best season: November to April",
    timeOfDayVi: "Săn sương · 05:50",
    timeOfDayEn: "Morning mist · 05:50",
    storyVi:
      "Biển mây trôi qua những triền đồi thông ba lá cổ thụ và nông trại cà phê Arabica của người K'Ho.",
    storyEn:
      "Low cloud seas drifting through old-growth three-needle pines and highland Arabica farms.",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "rung-quoc-gia-phu-quoc",
    region: "nam",
    regionLabelVi: "Tây Nguyên & Nam Bộ",
    regionLabelEn: "Highlands & South",
    nameVi: "Bắc đảo & Làng chài Rạch Vẹm",
    nameEn: "Northern Coast & Rach Vem Coves",
    provinceVi: "Đảo Phú Quốc",
    provinceEn: "Phu Quoc Island",
    seasonVi: "Mùa đẹp nhất: Tháng 11 đến Tháng 5",
    seasonEn: "Best season: November to May",
    timeOfDayVi: "Chiều muộn · 16:45",
    timeOfDayEn: "Late afternoon · 16:45",
    storyVi:
      "Bờ biển hoang sơ giáp rừng nguyên sinh Bắc đảo, nơi những chiếc thuyền gỗ neo đậu bên làn nước trong vắt.",
    storyEn:
      "Quiet northern coves where primary forest meets crystal-clear shallows and wooden fishing boats.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "thung-lung-mu-cang-chai",
    region: "bac",
    regionLabelVi: "Miền Bắc",
    regionLabelEn: "Northern Vietnam",
    nameVi: "Thung lũng Mù Cang Chải & Tú Lệ",
    nameEn: "Mu Cang Chai & Tu Le Terraces",
    provinceVi: "Yên Bái",
    provinceEn: "Yen Bai",
    seasonVi: "Mùa đẹp nhất: Tháng 9 đến Tháng 10",
    seasonEn: "Best season: September to October",
    timeOfDayVi: "Nắng sớm · 06:30",
    timeOfDayEn: "Morning sun · 06:30",
    storyVi:
      "Những thửa ruộng bậc thang uốn lượn theo sườn núi Khau Phạ khi mùa lúa chín thơm hương cốm mới.",
    storyEn:
      "Centuries-old rice terraces carved along Khau Pha pass during the golden autumn harvest.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
  },
];

interface DestinationGalleryProps {
  destinations?: DestinationPhoto[];
}

export default function DestinationGallery({
  destinations,
}: DestinationGalleryProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const items =
    destinations && destinations.length > 0 ? destinations : DESTINATIONS;
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterTabs = useMemo(
    () => [
      {
        id: "all",
        label: isEn ? "All destinations" : "Tất cả điểm đến",
        count: items.length,
      },
      {
        id: "bac",
        label: isEn ? "Northern Vietnam" : "Miền Bắc",
        count: items.filter((d) => d.region === "bac").length,
      },
      {
        id: "trung",
        label: isEn ? "Central Heritage" : "Miền Trung",
        count: items.filter((d) => d.region === "trung").length,
      },
      {
        id: "nam",
        label: isEn ? "Highlands & South" : "Tây Nguyên & Nam Bộ",
        count: items.filter((d) => d.region === "nam").length,
      },
    ],
    [isEn, items],
  );

  const filteredDestinations = useMemo(() => {
    if (activeRegion === "all") return items;
    return items.filter((item) => item.region === activeRegion);
  }, [activeRegion, items]);

  const selectedIndex = useMemo(
    () =>
      selectedId
        ? filteredDestinations.findIndex((item) => item.id === selectedId)
        : -1,
    [filteredDestinations, selectedId],
  );

  const activePhoto =
    selectedIndex >= 0 ? filteredDestinations[selectedIndex] : null;

  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
      } else if (event.key === "ArrowRight") {
        const nextIdx = (selectedIndex + 1) % filteredDestinations.length;
        setSelectedId(filteredDestinations[nextIdx].id);
      } else if (event.key === "ArrowLeft") {
        const prevIdx =
          (selectedIndex - 1 + filteredDestinations.length) %
          filteredDestinations.length;
        setSelectedId(filteredDestinations[prevIdx].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, filteredDestinations, selectedIndex]);

  const handleStep = (direction: 1 | -1) => {
    if (selectedIndex < 0 || filteredDestinations.length === 0) return;
    const nextIdx =
      (selectedIndex + direction + filteredDestinations.length) %
      filteredDestinations.length;
    setSelectedId(filteredDestinations[nextIdx].id);
  };

  return (
    <section className={styles.gallerySection} id="thu-vien-anh">
      <motion.div
        className={styles.headingRow}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>
            {isEn
              ? "Photographic archive · North · Central · South"
              : "Tư liệu hình ảnh thực địa · Bắc · Trung · Nam"}
          </p>
          <h2 className={styles.title}>
            {isEn ? "Iconic Vietnamese" : "Thư viện ảnh những"}
            <br />
            <em>{isEn ? "landscapes & heritage" : "miền di sản nổi tiếng"}</em>
          </h2>
        </div>

        <div className={styles.headerRight}>
          <p className={styles.lead}>
            {isEn
              ? "Select a region or click any photograph to inspect full field notes, ideal seasons, and quiet hours at each destination."
              : "Chọn vùng miền hoặc chạm vào từng bức ảnh để xem kích thước lớn cùng ghi chú mùa đẹp nhất và khung giờ vắng khách đoàn."}
          </p>

          <div
            className={styles.filterBar}
            role="tablist"
            aria-label={
              isEn ? "Filter destinations by region" : "Lọc điểm đến theo vùng"
            }
          >
            {filterTabs.map((tab) => {
              const isActive = activeRegion === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-active={isActive}
                  className={styles.filterBtn}
                  onClick={() => setActiveRegion(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span className={styles.filterCount}>({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div layout className={styles.photoGrid}>
        <AnimatePresence mode="popLayout">
          {filteredDestinations.map((item, idx) => {
            const name = isEn ? item.nameEn : item.nameVi;
            const province = isEn ? item.provinceEn : item.provinceVi;
            const time = isEn ? item.timeOfDayEn : item.timeOfDayVi;
            const isWide = activeRegion === "all" && item.spanWide;

            return (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{
                  once: true,
                  amount: 0.15,
                  margin: "0px 0px -36px 0px",
                }}
                transition={{
                  duration: 0.58,
                  delay: (idx % 3) * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`${styles.photoCard} ${
                  isWide ? styles.photoCardWide : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.photoTrigger}
                  onClick={() => setSelectedId(item.id)}
                  aria-label={`${name} - ${province}`}
                >
                  <div className={styles.imageFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={`${name}, ${province}`}
                      className={styles.image}
                      loading="lazy"
                    />
                    <span className={styles.provinceTag}>{province}</span>
                    <span className={styles.zoomHint} aria-hidden="true">
                      <FiMaximize2 size={15} />
                    </span>
                  </div>

                  <div className={styles.captionBar}>
                    <div className={styles.captionTop}>
                      <h3 className={styles.placeName}>{name}</h3>
                      <span className={styles.timeTag}>{time}</span>
                    </div>
                    <p className={styles.storySnippet}>
                      {isEn ? item.storyEn : item.storyVi}
                    </p>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className={styles.lightboxOverlay}
            onClick={() => setSelectedId(null)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={styles.lightboxModal}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-place-title"
            >
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedId(null)}
                aria-label={isEn ? "Close gallery" : "Đóng thư viện ảnh"}
              >
                <FiX size={18} />
              </button>

              <div className={styles.lightboxStage}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto.id}
                    src={activePhoto.image}
                    alt={
                      isEn ? activePhoto.nameEn : activePhoto.nameVi
                    }
                    className={styles.lightboxImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  />
                </AnimatePresence>

                <div className={styles.lightboxControls}>
                  <button
                    type="button"
                    className={styles.navBtn}
                    onClick={() => handleStep(-1)}
                    aria-label={isEn ? "Previous photo" : "Ảnh trước"}
                  >
                    <FiArrowLeft size={17} />
                  </button>
                  <span className={styles.counter}>
                    {selectedIndex + 1} / {filteredDestinations.length}
                  </span>
                  <button
                    type="button"
                    className={styles.navBtn}
                    onClick={() => handleStep(1)}
                    aria-label={isEn ? "Next photo" : "Ảnh tiếp theo"}
                  >
                    <FiArrowRight size={17} />
                  </button>
                </div>
              </div>

              <div className={styles.lightboxInfo}>
                <div className={styles.lightboxMeta}>
                  <span>
                    {isEn
                      ? activePhoto.regionLabelEn
                      : activePhoto.regionLabelVi}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEn ? activePhoto.provinceEn : activePhoto.provinceVi}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEn
                      ? activePhoto.timeOfDayEn
                      : activePhoto.timeOfDayVi}
                  </span>
                </div>

                <h3 id="lightbox-place-title" className={styles.lightboxTitle}>
                  {isEn ? activePhoto.nameEn : activePhoto.nameVi}
                </h3>

                <p className={styles.lightboxStory}>
                  {isEn ? activePhoto.storyEn : activePhoto.storyVi}
                </p>

                <div className={styles.lightboxFooter}>
                  <span className={styles.seasonBadge}>
                    {isEn ? activePhoto.seasonEn : activePhoto.seasonVi}
                  </span>

                  <a
                    href="#hanh-trinh"
                    className={styles.journeyCta}
                    onClick={() => setSelectedId(null)}
                  >
                    <span>
                      {isEn
                        ? "View routes in this region"
                        : "Xem hành trình qua vùng này"}
                    </span>
                    <FiArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
