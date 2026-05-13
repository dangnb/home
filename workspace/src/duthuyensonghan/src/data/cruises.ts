export interface CruiseInfo {
  slug: string;
  name: string;
  category: "regular" | "dinner";
  badge?: string;
  tagline: string;
  originalPrice: string;
  salePrice: string;
  floors: number;
  capacity: number;
  mainImage: string;
  gallery: string[];
  highlights: string[];
  description: string;
  tours: {
    name: string;
    icon: string;
    schedule: string[];
  }[];
  includes: string[];
  relatedSlugs: string[];
}

export const cruiseData: Record<string, CruiseInfo> = {
  "thao-nhi-yatch": {
    slug: "thao-nhi-yatch",
    name: "Du Thuyền Thảo Nhi Yatch",
    category: "dinner",
    badge: "Du thuyền nhà hàng",
    tagline: "Biệt Thự Di Động – Đẳng Cấp 5 Sao Trên Sông Hàn",
    originalPrice: "1.500.000 ₫",
    salePrice: "900.000 ₫",
    floors: 2,
    capacity: 9,
    mainImage: "/images/thaonhi_yatch1-300x169.webp",
    gallery: [
      "/images/thaonhi_yatch1-300x169.webp",
      "/images/banner_desktop.webp",
      "/images/phaohoatuocte.jpg",
      "/images/thaonhi_yatch1-300x169.webp",
    ],
    highlights: [
      "Không gian riêng tư, sang trọng tuyệt đối – chỉ 9 khách",
      "Setup tiệc theo yêu cầu: lãng mạn, riêng tư, ấm cúng",
      "Góc sống ảo cực chill, thiết kế hiện đại nội thất cao cấp",
      "Hệ thống âm thanh, ánh sáng hiện đại & quầy bar mini",
    ],
    description: `Du Thuyền Thảo Nhi Yatch hạ thuỷ vào giữa năm 2025. Ra đời sau các du thuyền truyền thống trên dòng sông Hàn nên nó mang đến các dịch vụ riêng với đẳng cấp khác biệt với tất cả các du thuyền còn lại.

Khác với các tàu du lịch đông đúc, Thảo Nhi Yacht mang đến không gian riêng tư và sang trọng tuyệt đối. Với thiết kế hiện đại, nội thất cao cấp, đây không chỉ là phương tiện di chuyển mà còn là một "biệt thự di động" trên mặt nước.`,
    tours: [
      {
        name: "Tour Hoàng Hôn Trên Sông Hàn (Sunset Tour)",
        icon: "🌅",
        schedule: [
          "17:30 – 18:00: Đón khách lên du thuyền.",
          "18:30: Khởi hành tham quan các cây cầu nổi tiếng & thưởng thức tiệc buffet mini.",
          "19:30: Cập bến, kết thúc hành trình.",
        ],
      },
      {
        name: "Tour Du Ngoạn Sông Hàn Về Đêm (Night River Cruise)",
        icon: "🌃",
        schedule: [
          "19:30 – 20:00: Đón khách lên du thuyền.",
          "20:30: Khởi hành tham quan hệ thống cầu biểu tượng & thưởng thức buffet mini.",
          "21:30: Cập bến, cảm ơn và hẹn gặp lại quý khách.",
        ],
      },
      {
        name: "Tour Trải Nghiệm Cầu Rồng Phun Lửa & Nước (Dragon Bridge Show)",
        icon: "🐉",
        schedule: [
          "19:30 – 20:00: Đón khách chuẩn bị cho hành trình.",
          "20:00 – 20:20: Khởi hành, thưởng thức buffet mini & chọn vị trí xem show Cầu Rồng.",
          "21:30: Cập bến và kết thúc chuyến tham quan.",
        ],
      },
    ],
    includes: [
      "DJ chuyên nghiệp khuấy động không gian",
      "Tiệc Buffet mini đa dạng trên du thuyền",
      "Bảo hiểm hành khách đầy đủ",
      "Thuế VAT đã bao gồm trong giá",
    ],
    relatedSlugs: ["du-thuyen-poseidon-cruise", "du-thuyen-danang-dragon-cruise", "tau-rong-song-han"],
  },

  "du-thuyen-poseidon-cruise": {
    slug: "du-thuyen-poseidon-cruise",
    name: "Du thuyền POSEIDON CRUISE",
    category: "dinner",
    badge: "Du thuyền 5* nhà hàng",
    tagline: "Du Thuyền 5 Sao – Buffet & DJ Bar Đẳng Cấp",
    originalPrice: "1.200.000 ₫",
    salePrice: "800.000 ₫",
    floors: 2,
    capacity: 198,
    mainImage: "/images/DU-THUYEN-POSEIDON-300x170.jpg",
    gallery: ["/images/DU-THUYEN-POSEIDON-300x170.jpg", "/images/banner_desktop.webp"],
    highlights: [
      "Du thuyền 5* lớn nhất trên sông Hàn – 198 khách",
      "Tầng 2 có quầy Bar: DJ & Dancer phục vụ hàng đêm",
      "Buffet đa dạng phong phú, ẩm thực cao cấp",
      "Không gian sang trọng, đẳng cấp 5 sao",
    ],
    description: `POSEIDON CRUISE là du thuyền nhà hàng 5 sao lớn nhất trên sông Hàn Đà Nẵng với sức chứa 198 khách. Không chỉ phục vụ suất ăn theo menu, du thuyền còn có buffet đa dạng và quầy Bar với DJ, Dancer hoạt động hàng đêm.`,
    tours: [
      {
        name: "Tour Du Ngoạn Sông Hàn Kết Hợp Ăn Tối",
        icon: "🚢",
        schedule: [
          "18:00 – 18:30: Đón khách tại bến.",
          "19:00: Khởi hành du ngoạn sông Hàn, thưởng thức buffet.",
          "21:00: Khu vực bar & DJ khuấy động không khí.",
          "22:00: Cập bến, kết thúc hành trình.",
        ],
      },
    ],
    includes: [
      "Buffet ẩm thực cao cấp",
      "DJ & Dancer tầng 2",
      "Nước uống không giới hạn tại bar",
      "Bảo hiểm hành khách",
    ],
    relatedSlugs: ["thao-nhi-yatch", "du-thuyen-danang-dragon-cruise", "tau-rong-song-han"],
  },

  "tau-rong-song-han": {
    slug: "tau-rong-song-han",
    name: "Tàu Rồng Sông Hàn",
    category: "dinner",
    badge: "Du thuyền nhà hàng",
    tagline: "Biểu Tượng Sông Hàn – Trải Nghiệm Đẳng Cấp",
    originalPrice: "900.000 ₫",
    salePrice: "700.000 ₫",
    floors: 3,
    capacity: 220,
    mainImage: "/images/TAU-RONG-SONG-HAN-300x169.jpg",
    gallery: ["/images/TAU-RONG-SONG-HAN-300x169.jpg", "/images/banner_desktop.webp"],
    highlights: [
      "Tàu Rồng – biểu tượng du lịch sông Hàn 3 tầng",
      "Sức chứa lớn nhất – 220 khách",
      "Chương trình giải trí múa Chămpa, karaoke",
      "Set menu cao cấp, phong cách",
    ],
    description: `Tàu Rồng Sông Hàn là một trong những du thuyền nổi bật nhất với thiết kế hình rồng độc đáo, sức chứa 220 khách và 3 tầng không gian rộng rãi. Phục vụ ẩm thực theo set menu cao cấp kết hợp chương trình giải trí đặc sắc.`,
    tours: [
      {
        name: "Tour Ăn Tối Trên Sông Hàn",
        icon: "🍽️",
        schedule: [
          "18:30: Đón khách tại bến.",
          "19:00: Khởi hành, thưởng thức set menu cao cấp.",
          "20:00: Chương trình giải trí múa Chămpa & karaoke.",
          "21:30: Cập bến.",
        ],
      },
    ],
    includes: ["Set menu ẩm thực cao cấp", "Chương trình múa Chămpa", "Karaoke trực tiếp", "Bảo hiểm"],
    relatedSlugs: ["du-thuyen-poseidon-cruise", "thao-nhi-yatch", "du-thuyen-danang-dragon-cruise"],
  },

  "du-thuyen-danang-dragon-cruise": {
    slug: "du-thuyen-danang-dragon-cruise",
    name: "Du Thuyền DANANG DRAGON CRUISE",
    category: "dinner",
    badge: "Du thuyền 3 sao",
    tagline: "Dragon Cruise – Sang Trọng Và Đẳng Cấp",
    originalPrice: "1.000.000 ₫",
    salePrice: "850.000 ₫",
    floors: 2,
    capacity: 65,
    mainImage: "/images/DA-NANG-CRUSIE-2-300x225.jpg",
    gallery: ["/images/DA-NANG-CRUSIE-2-300x225.jpg", "/images/banner_desktop.webp"],
    highlights: [
      "Du thuyền nhà hàng 3 sao chất lượng cao",
      "Sức chứa 65 khách – không gian ấm cúng",
      "Set menu cao cấp phong cách Âu",
      "Vị trí mũi tàu VIP view đẹp nhất",
    ],
    description: `DANANG DRAGON CRUISE là du thuyền 3 sao phục vụ ăn tối sang trọng với sức chứa 65 khách. Set menu theo phong cách Âu kết hợp chương trình giải trí, phù hợp cho các buổi tiệc công ty hoặc hẹn hò lãng mạn.`,
    tours: [
      {
        name: "Tour Ăn Tối & Du Ngoạn Sông Hàn",
        icon: "🌊",
        schedule: [
          "18:00: Đón khách tại bến.",
          "18:30: Khởi hành, thưởng thức set menu.",
          "20:00: Chương trình giải trí.",
          "21:30: Cập bến.",
        ],
      },
    ],
    includes: ["Set menu Âu cao cấp", "Nước uống kèm theo", "Chương trình giải trí", "Bảo hiểm hành khách"],
    relatedSlugs: ["du-thuyen-poseidon-cruise", "thao-nhi-yatch", "tau-rong-song-han"],
  },

  // Regular cruises
  "du-thuyen-bao-anh": {
    slug: "du-thuyen-bao-anh",
    name: "Du Thuyền Bảo Anh",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "Ngắm Sông Hàn – Không Gian Thoáng Mát",
    originalPrice: "200.000 ₫",
    salePrice: "150.000 ₫",
    floors: 2,
    capacity: 95,
    mainImage: "/images/DU-THUYEN-BAO-ANH4-300x225.jpg",
    gallery: ["/images/DU-THUYEN-BAO-ANH4-300x225.jpg", "/images/banner_desktop.webp"],
    highlights: [
      "Du thuyền 2 tầng thoáng mát, view 360°",
      "Phục vụ 1 suất ăn tối cơm gà + trái cây + nước",
      "Không gian gia đình yên tĩnh, ấm cúng",
      "Sức chứa 95 khách, lịch chạy đều",
    ],
    description: `Du Thuyền Bảo Anh là lựa chọn lý tưởng cho những ai muốn trải nghiệm du ngoạn sông Hàn yên tĩnh, thoáng mát mà không cần dịch vụ ăn tối sang trọng. Phù hợp cho gia đình và nhóm bạn.`,
    tours: [
      {
        name: "Tour Du Ngoạn Sông Hàn Buổi Tối",
        icon: "🌙",
        schedule: [
          "19:00: Đón khách tại bến.",
          "19:30: Khởi hành du ngoạn sông Hàn.",
          "20:30: Thưởng thức suất ăn tối.",
          "21:30: Cập bến.",
        ],
      },
    ],
    includes: ["1 suất cơm gà kèm trái cây", "Nước suối", "Bảo hiểm hành khách"],
    relatedSlugs: ["du-thuyen-duy-khang", "du-thuyen-my-xuan", "du-thuyen-4u"],
  },

  "du-thuyen-duy-khang": {
    slug: "du-thuyen-duy-khang",
    name: "Du Thuyền Duy Khang",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "Thoáng Mát – Yên Tĩnh – View Đẹp",
    originalPrice: "200.000 ₫",
    salePrice: "150.000 ₫",
    floors: 2,
    capacity: 92,
    mainImage: "/images/4u-6-300x188.jpg",
    gallery: ["/images/4u-6-300x188.jpg", "/images/banner_desktop.webp"],
    highlights: [
      "Du thuyền 2 tầng không ồn ào",
      "1 suất ăn tối cơm gà đi kèm",
      "Phù hợp gia đình, trẻ em",
      "Không gian yên tĩnh du ngoạn",
    ],
    description: `Du Thuyền Duy Khang mang đến trải nghiệm du ngoạn sông Hàn thuần túy, không bị ảnh hưởng bởi tiếng ồn. Lý tưởng cho gia đình muốn một buổi tối thư giãn trên sông.`,
    tours: [{ name: "Tour Du Ngoạn Sông Hàn", icon: "⛵", schedule: ["19:00: Khởi hành.", "21:00: Cập bến."] }],
    includes: ["1 suất ăn tối", "Nước suối", "Bảo hiểm"],
    relatedSlugs: ["du-thuyen-bao-anh", "du-thuyen-my-xuan", "du-thuyen-4u"],
  },

  "du-thuyen-my-xuan": {
    slug: "du-thuyen-my-xuan",
    name: "Du Thuyền Mỹ Xuân",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "Không Gian Rộng – Lịch Chạy Đều",
    originalPrice: "150.000 ₫",
    salePrice: "150.000 ₫",
    floors: 2,
    capacity: 90,
    mainImage: "/images/DU-THUYEN-MY-XUAN-300x225.jpg",
    gallery: ["/images/DU-THUYEN-MY-XUAN-300x225.jpg", "/images/banner_desktop.webp"],
    highlights: ["Không gian thoáng rộng 2 tầng", "Phục vụ tận tình", "Giá tốt nhất", "Lịch chạy đều đặn"],
    description: `Du Thuyền Mỹ Xuân với không gian rộng rãi 2 tầng, phục vụ tận tình và mức giá cạnh tranh. Phù hợp cho mọi đối tượng khách.`,
    tours: [{ name: "Tour Du Ngoạn Sông Hàn", icon: "⛵", schedule: ["19:00: Khởi hành.", "21:00: Cập bến."] }],
    includes: ["1 suất ăn tối", "Nước uống", "Bảo hiểm"],
    relatedSlugs: ["du-thuyen-bao-anh", "du-thuyen-duy-khang", "du-thuyen-4u"],
  },

  "du-thuyen-4u": {
    slug: "du-thuyen-4u",
    name: "Du Thuyền Sông Hàn 4U",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "4U – Trải Nghiệm Dành Cho Bạn",
    originalPrice: "225.000 ₫",
    salePrice: "185.000 ₫",
    floors: 2,
    capacity: 89,
    mainImage: "/images/4u-6-300x188.jpg",
    gallery: ["/images/4u-6-300x188.jpg", "/images/banner_desktop.webp"],
    highlights: ["Thiết kế hiện đại 2 tầng", "View tầng 2 đẹp hơn", "Suất ăn tối đi kèm", "Dịch vụ thân thiện"],
    description: `Du Thuyền 4U mang đến không gian trải nghiệm sông Hàn hiện đại, thoáng mát với tầng 2 có view 360 độ cực đẹp.`,
    tours: [{ name: "Tour Du Ngoạn Sông Hàn", icon: "🚤", schedule: ["19:00: Khởi hành.", "21:00: Cập bến."] }],
    includes: ["1 suất ăn tối", "Nước suối", "Bảo hiểm hành khách"],
    relatedSlugs: ["du-thuyen-bao-anh", "du-thuyen-my-xuan", "du-thuyen-sweettime"],
  },

  "du-thuyen-sweettime": {
    slug: "du-thuyen-sweettime",
    name: "Du Thuyền Sweet Time",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "Sweet Time – Khoảng Thời Gian Ngọt Ngào",
    originalPrice: "200.000 ₫",
    salePrice: "150.000 ₫",
    floors: 2,
    capacity: 90,
    mainImage: "/images/DU-THUYEN-SWEETTIME6-300x225.jpg",
    gallery: ["/images/DU-THUYEN-SWEETTIME6-300x225.jpg", "/images/banner_desktop.webp"],
    highlights: ["Không gian lãng mạn, ấm cúng", "Phù hợp cặp đôi, hẹn hò", "Suất ăn tối ngon miệng", "Giá tốt"],
    description: `Du Thuyền Sweet Time tạo ra những khoảnh khắc ngọt ngào và lãng mạn trên dòng sông Hàn. Lý tưởng cho các cặp đôi muốn một buổi hẹn hò đặc biệt.`,
    tours: [{ name: "Tour Lãng Mạn Sông Hàn", icon: "💕", schedule: ["19:00: Khởi hành.", "21:00: Cập bến."] }],
    includes: ["1 suất ăn tối", "Nước suối", "Bảo hiểm hành khách"],
    relatedSlugs: ["du-thuyen-bao-anh", "du-thuyen-4u", "du-thuyen-tay-bac"],
  },

  "du-thuyen-tay-bac": {
    slug: "du-thuyen-tay-bac",
    name: "Du Thuyền Tây Bắc",
    category: "regular",
    badge: "Du Thuyền Không Ăn Tối",
    tagline: "Tây Bắc – Hương Vị Riêng Trên Sông Hàn",
    originalPrice: "150.000 ₫",
    salePrice: "150.000 ₫",
    floors: 2,
    capacity: 90,
    mainImage: "/images/DU-THUYEN-TAY-BAC3-300x225.jpg",
    gallery: ["/images/DU-THUYEN-TAY-BAC3-300x225.jpg", "/images/banner_desktop.webp"],
    highlights: ["Du thuyền thoáng mát 2 tầng", "Sức chứa lớn phù hợp nhóm đông", "Giá bình dân", "Dịch vụ tốt"],
    description: `Du Thuyền Tây Bắc phù hợp cho các nhóm đông, gia đình lớn với không gian rộng rãi và giá cả phải chăng nhất trên sông Hàn.`,
    tours: [{ name: "Tour Du Ngoạn Sông Hàn", icon: "⛵", schedule: ["19:00: Khởi hành.", "21:00: Cập bến."] }],
    includes: ["1 suất ăn tối", "Nước suối", "Bảo hiểm"],
    relatedSlugs: ["du-thuyen-bao-anh", "du-thuyen-my-xuan", "du-thuyen-sweettime"],
  },
};
