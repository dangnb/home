import Hero from "@/components/Hero";
import OfficialTicketCounter from "@/components/OfficialTicketCounter";
import CruiseSection from "@/components/CruiseSection";
import FireworksBanner from "@/components/FireworksBanner";
import { getCruises, getSettings } from "@/lib/db";

export default async function Home() {
  const allCruises = await getCruises();
  const s = await getSettings();

  const regularCruises = allCruises
    .filter(c => c.categoryId === "regular")
    .map(c => ({
      id: c.slug,
      slug: c.slug,
      image: c.mainImage,
      title: c.name,
      floors: c.floors,
      capacity: c.capacity,
      price: c.salePrice,
      isSale: c.originalPrice !== c.salePrice && !!c.originalPrice,
    }));

  const dinnerCruises = allCruises
    .filter(c => c.categoryId === "dinner" || c.categoryId === "vip")
    .map(c => ({
      id: c.slug,
      slug: c.slug,
      image: c.mainImage,
      title: c.name,
      floors: c.floors,
      capacity: c.capacity,
      price: c.salePrice,
      isSale: c.originalPrice !== c.salePrice && !!c.originalPrice,
    }));

  return (
    <main>
      <Hero
        image={s.bannerImage}
        badge={s.bannerBadge}
        title={s.bannerTitle}
        subtitle={s.bannerSubtitle}
        cta1Text={s.bannerCta1Text}
        cta1Link={s.bannerCta1Link}
        cta2Text={s.bannerCta2Text}
        cta2Link={s.bannerCta2Link}
        stats={s.bannerStats}
        hotline={s.hotline}
      />
      <OfficialTicketCounter />

      <div style={{ backgroundColor: "#f9f9f9", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <CruiseSection
          id="khong-an-toi"
          title="Top Du Thuyền Sông Hàn được đặt nhiều nhất"
          subtitle="Nếu quý khách không có nhu cầu ăn tối, tổ chức tiệc. Muốn yên tĩnh để du ngoạn, đắm chìm với vẻ đẹp thơ mộng của dòng sông Hàn thì đây là top những du thuyền không thể bỏ qua."
          cruises={regularCruises}
          viewAllLink="/gia-ve"
        />
      </div>

      <FireworksBanner />

      <CruiseSection
        id="co-an-toi"
        title="Du Thuyền Đà Nẵng Có Ăn Tối – Trải Nghiệm Sang Trọng"
        subtitle="Quý khách cần 1 du thuyền sông Hàn 5* sang trọng để: Tổ chức 1 buổi ăn tối bên người thân, liên hoan, gala diner hay 1 quầy Bar có DJ để quẩy suốt đêm."
        cruises={dinnerCruises}
        viewAllLink="/gia-ve"
      />
    </main>
  );
}
