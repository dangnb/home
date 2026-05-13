import Hero from "@/components/Hero";
import OfficialTicketCounter from "@/components/OfficialTicketCounter";
import CruiseSection from "@/components/CruiseSection";
import FireworksBanner from "@/components/FireworksBanner";

export default function Home() {
  const regularCruises = [
    {
      id: "4u",
      image: "/images/4u-6-300x188.jpg",
      title: "Du Thuyền Sông Hàn 4U",
      floors: 2,
      capacity: 89,
      price: "150.000 VNĐ",
      isSale: true
    },
    {
      id: "sweettime",
      image: "/images/DU-THUYEN-SWEETTIME6-300x225.jpg",
      title: "Du Thuyền Sweet Time",
      floors: 2,
      capacity: 90,
      price: "150.000 VNĐ"
    },
    {
      id: "myxuan",
      image: "/images/DU-THUYEN-MY-XUAN-300x225.jpg",
      title: "Du thuyền Mỹ Xuân",
      floors: 2,
      capacity: 90,
      price: "150.000 VNĐ",
      isSale: true
    },
    {
      id: "taybac",
      image: "/images/DU-THUYEN-TAY-BAC3-300x225.jpg",
      title: "Du Thuyền Tây Bắc",
      floors: 2,
      capacity: 90,
      price: "150.000 VNĐ"
    },
    {
      id: "baoanh",
      image: "/images/DU-THUYEN-BAO-ANH4-300x225.jpg",
      title: "Du Thuyền Bảo Anh",
      floors: 2,
      capacity: 95,
      price: "150.000 VNĐ"
    }
  ];

  const dinnerCruises = [
    {
      id: "poseidon",
      image: "/images/DU-THUYEN-POSEIDON-300x170.jpg",
      title: "Du thuyền POSEIDON CRUISE",
      floors: 2,
      capacity: 198,
      price: "800.000 VNĐ",
      isSale: true
    },
    {
      id: "taurong",
      image: "/images/TAU-RONG-SONG-HAN-300x169.jpg",
      title: "Tàu Rồng Sông Hàn",
      floors: 3,
      capacity: 220,
      price: "700.000 VNĐ"
    },
    {
      id: "dragon",
      image: "/images/DA-NANG-CRUSIE-2-300x225.jpg",
      title: "Du Thuyền DANANG DRAGON CRUISE",
      floors: 2,
      capacity: 65,
      price: "850.000 VNĐ",
      isSale: true
    },
    {
      id: "thaonhi",
      image: "/images/thaonhi_yatch1-300x169.webp",
      title: "Thảo Nhi Yatch",
      floors: 2,
      capacity: 9,
      price: "1.200.000 VNĐ"
    }
  ];

  return (
    <main>
      <Hero />
      <OfficialTicketCounter />
      
      <div style={{ backgroundColor: '#f9f9f9', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <CruiseSection 
          id="khong-an-toi"
          title="Top Du Thuyền Sông Hàn được đặt nhiều nhất"
          subtitle="Nếu quý khách không có nhu cầu ăn tối, tổ chức tiệc. Muốn yên tĩnh để du ngoạn, đắm chìm với vẻ đẹp thơ mộng của dòng sông Hàn thì đây là top những du thuyền không thể bỏ qua."
          cruises={regularCruises}
          viewAllLink="#"
        />
      </div>

      <FireworksBanner />

      <CruiseSection 
        id="co-an-toi"
        title="Du Thuyền Đà Nẵng Có Ăn Tối – Trải Nghiệm Sang Trọng"
        subtitle="Quý khách cần 1 du thuyền sông Hàn 5* sang trọng để: Tổ chức 1 buổi ăn tối bên người thân, liên hoan, gala diner hay 1 quầy Bar có DJ để quẩy suốt đêm."
        cruises={dinnerCruises}
        viewAllLink="#"
      />
    </main>
  );
}
