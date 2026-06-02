export type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  badge?: "Nổi bật" | "Bán chạy" | "Mới";
  tone: string;
  tastingNotes: string[];
  addOns: string[];
  reviews: Review[];
};

export const products: Product[] = [
  {
    slug: "ca-phe-sua-da-moc",
    name: "Cà phê sữa đá Mộc",
    category: "Cà phê",
    description: "Đậm vị robusta, sữa béo vừa đủ và hậu vị caramel quen thuộc.",
    longDescription:
      "Ly signature dành cho những buổi sáng cần tỉnh táo nhưng vẫn muốn cảm giác mềm mại, dễ uống. Espresso rang vừa được lắc lạnh cùng sữa đặc theo công thức riêng của quán.",
    price: "39.000đ",
    badge: "Nổi bật",
    tone: "from-amber-200 via-orange-100 to-stone-100",
    tastingNotes: ["Robusta rang vừa", "Sữa đặc béo nhẹ", "Hậu vị caramel"],
    addOns: ["Kem muối", "Shot espresso", "Trân châu cà phê"],
    reviews: [
      {
        name: "Minh Anh",
        rating: 5,
        comment: "Vị cà phê đậm nhưng không gắt, uống buổi sáng rất đã.",
        date: "22/05/2026",
      },
      {
        name: "Hoàng Nam",
        rating: 5,
        comment: "Ly signature đúng kiểu dễ nghiện, sữa vừa miệng.",
        date: "24/05/2026",
      },
    ],
  },
  {
    slug: "latte-kem-muoi",
    name: "Latte kem muối",
    category: "Cà phê",
    description: "Espresso thơm, sữa tươi mịn và lớp kem muối béo mặn nhẹ.",
    longDescription:
      "Phiên bản latte trẻ trung với lớp kem muối đánh mịn, cân bằng giữa vị espresso, sữa tươi và chút mặn nhẹ ở cuối vị.",
    price: "55.000đ",
    badge: "Bán chạy",
    tone: "from-yellow-100 via-orange-100 to-amber-200",
    tastingNotes: ["Espresso Arabica", "Kem muối", "Sữa tươi thanh"],
    addOns: ["Extra foam", "Shot espresso", "Sốt caramel"],
    reviews: [
      {
        name: "Thu Uyên",
        rating: 5,
        comment: "Kem muối mịn, thơm và chụp hình lên màu rất đẹp.",
        date: "20/05/2026",
      },
      {
        name: "Gia Huy",
        rating: 4,
        comment: "Ngon, nếu thích đậm có thể thêm shot là perfect.",
        date: "26/05/2026",
      },
    ],
  },
  {
    slug: "cold-brew-cam-sa",
    name: "Cold brew cam sả",
    category: "Cà phê lạnh",
    description: "Cold brew ủ chậm kết hợp cam vàng và sả thơm mát.",
    longDescription:
      "Một lựa chọn sáng khoái cho ngày nóng: cold brew ủ lạnh 18 giờ, hòa cùng cam vàng và mùi sả nhẹ để giữ vị cà phê sạch, thanh và hiện đại.",
    price: "59.000đ",
    badge: "Mới",
    tone: "from-orange-200 via-lime-100 to-emerald-100",
    tastingNotes: ["Ủ lạnh 18 giờ", "Cam vàng", "Sả tươi"],
    addOns: ["Ít ngọt", "Thêm cam", "Đá viên cà phê"],
    reviews: [
      {
        name: "Bảo Trân",
        rating: 5,
        comment: "Mùi cam sả rất fresh, không bị ngọt quá.",
        date: "25/05/2026",
      },
    ],
  },
  {
    slug: "matcha-dua-nuong",
    name: "Matcha dừa nướng",
    category: "Matcha",
    description: "Matcha Nhật, sữa dừa thơm và topping dừa nướng giòn nhẹ.",
    longDescription:
      "Dành cho team không uống cà phê: matcha vị thanh, sữa dừa béo nhẹ và dừa nướng tạo mùi thơm rất bắt trend.",
    price: "57.000đ",
    badge: "Nổi bật",
    tone: "from-green-200 via-emerald-100 to-stone-100",
    tastingNotes: ["Matcha Nhật", "Sữa dừa", "Dừa nướng"],
    addOns: ["Kem cheese", "Ít đá", "Thạch cà phê"],
    reviews: [
      {
        name: "Khánh Linh",
        rating: 5,
        comment: "Matcha thơm, không tanh, dừa nướng cực hợp.",
        date: "21/05/2026",
      },
    ],
  },
  {
    slug: "tra-dao-cam-sa",
    name: "Trà đào cam sả",
    category: "Trà trái cây",
    description: "Trà đen ủ thơm, đào giòn, cam vàng và sả tươi.",
    longDescription:
      "Món quốc dân được làm theo phong cách nhẹ nhàng hơn: trà rõ vị, trái cây tươi và mùi sả vừa đủ để uống cả buổi vẫn dễ chịu.",
    price: "49.000đ",
    badge: "Bán chạy",
    tone: "from-orange-100 via-rose-100 to-yellow-100",
    tastingNotes: ["Trà đen", "Đào miếng", "Cam vàng"],
    addOns: ["Thêm đào", "Ít ngọt", "Hạt chia"],
    reviews: [
      {
        name: "Phương Nhi",
        rating: 5,
        comment: "Trà thơm, đào nhiều, uống giải nhiệt siêu ổn.",
        date: "23/05/2026",
      },
    ],
  },
  {
    slug: "croissant-bo-hanh-nhan",
    name: "Croissant bơ hạnh nhân",
    category: "Bánh ngọt",
    description: "Vỏ giòn, ruột mềm bơ thơm cùng lớp hạnh nhân rang.",
    longDescription:
      "Món bánh ăn kèm cà phê được nướng mới mỗi ngày, phù hợp cho bữa sáng nhanh hoặc buổi chiều cần chút năng lượng.",
    price: "45.000đ",
    badge: "Mới",
    tone: "from-amber-100 via-yellow-100 to-stone-100",
    tastingNotes: ["Bơ Pháp", "Hạnh nhân", "Vỏ giòn"],
    addOns: ["Sốt chocolate", "Mật ong", "Combo latte"],
    reviews: [
      {
        name: "Quốc Bảo",
        rating: 4,
        comment: "Bánh giòn thơm, đi với latte rất hợp.",
        date: "19/05/2026",
      },
    ],
  },
];

export const featuredProducts = products.filter((product) => product.badge === "Nổi bật");
export const bestSellingProducts = products.filter((product) => product.badge === "Bán chạy");
export const newProducts = products.filter((product) => product.badge === "Mới");

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}
