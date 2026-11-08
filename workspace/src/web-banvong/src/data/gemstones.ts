/* cspell:disable */
export type ElementType = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
export type ElementKey = "kim" | "moc" | "thuy" | "hoa" | "tho";
export type CharmType = "tyhuu" | "piyao" | "lotus" | "luthong" | "none";

export interface StonePalette {
  id: string;
  name: string;
  element: ElementType;
  basePricePerBead: number;
  cLight: string;
  cMid: string;
  cDark: string;
  cGlow: string;
  inclusion:
    | "rutile-gold"
    | "rutile-red"
    | "rutile-black"
    | "jade-cloud"
    | "ice-vein"
    | "tigereye"
    | "moon-sheen"
    | "wood-grain"
    | "lapis-gold";
  swatchColor: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  stone: string;
  stoneKey: string;
  charm: CharmType;
  charmType: CharmType;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  certId: string;
  certCode: string;
  hardness: string;
  origin: string;
  grade: string;
  beadMm: number;
  defaultSize: number;
  sizes: number[];
  beadCount: number;
  menh: ElementKey;
  menhName: string;
  compatible: ElementKey[];
  elements: ElementType[];
  tuongSinhFor: ElementType;
  tuongHopFor: ElementType;
  purposes: string[];
  benefit: string;
  shortBenefit: string;
  description: string;
  energyScores: {
    taiLoc: number;
    binhAn: number;
    tinhDuyen: number;
    sucKhoe: number;
  };
}

export interface HeroSlide {
  stoneKey: string;
  charmType: CharmType;
  element: string;
  title: string;
  sub: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  stoneKey: string;
  charmType: CharmType;
  beadMm: number;
  beadCount: number;
  wristCm: number;
  price: number;
  qty: number;
  note?: string;
}

export const ELEMENT_COLORS: Record<ElementKey, string> = {
  kim: "#d6ad4b",
  moc: "#329b6c",
  thuy: "#3f95bf",
  hoa: "#d45648",
  tho: "#ba8041",
};

export const CHARM_PRICES: Record<string, number> = {
  none: 0,
  lotus: 350000,
  piyao: 650000,
  tyhuu: 650000,
  luthong: 450000,
};

export const CHARM_NAMES: Record<string, string> = {
  none: "Không phối Charm",
  lotus: "Charm Liên Hoa",
  piyao: "Charm Tỳ Hưu Chiêu Tài",
  tyhuu: "Charm Tỳ Hưu Chiêu Tài",
  luthong: "Charm Lu Thống",
};

export const STUDIO_STONES: Record<
  string,
  {
    name: string;
    menhName: string;
    pricePerBead: number;
    swatch: string;
  }
> = {
  jade: {
    name: "Ngọc Phỉ Thúy",
    menhName: "Mệnh Mộc · Hỏa",
    pricePerBead: 135000,
    swatch: "radial-gradient(circle at 32% 30%, #9ef2c8, #1c8c5e 65%, #093b25)",
  },
  rutile_gold: {
    name: "Thạch Anh Tóc Vàng",
    menhName: "Mệnh Kim · Thổ",
    pricePerBead: 115000,
    swatch: "radial-gradient(circle at 32% 30%, #fff4c2, #dfac42 65%, #6b480e)",
  },
  aquamarine: {
    name: "Đá Aquamarine",
    menhName: "Mệnh Thủy · Mộc",
    pricePerBead: 110000,
    swatch: "radial-gradient(circle at 32% 30%, #ccf2ff, #3694c7 65%, #0f3f61)",
  },
  garnet: {
    name: "Thạch Anh Tóc Đỏ",
    menhName: "Mệnh Hỏa · Thổ",
    pricePerBead: 120000,
    swatch: "radial-gradient(circle at 32% 30%, #ffc4b8, #c84332 65%, #57120a)",
  },
  tigereye: {
    name: "Mắt Hổ Vàng Tâm",
    menhName: "Mệnh Thổ · Kim",
    pricePerBead: 75000,
    swatch: "radial-gradient(circle at 32% 30%, #f7d294, #9e6324 65%, #361e07)",
  },
  amethyst: {
    name: "Thạch Anh Tím",
    menhName: "Mệnh Hỏa · Thổ",
    pricePerBead: 85000,
    swatch: "radial-gradient(circle at 32% 30%, #e5cef2, #6e4885 65%, #2a1836)",
  },
};

export const STONE_PALETTES: Record<string, StonePalette> = {
  rutileGold: {
    id: "rutileGold",
    name: "Thạch Anh Tóc Vàng 6A",
    element: "Kim",
    basePricePerBead: 115000,
    cLight: "#FFF6D6",
    cMid: "#DFAC42",
    cDark: "#6B480E",
    cGlow: "#FFE28A",
    inclusion: "rutile-gold",
    swatchColor: "#DFAC42",
  },
  rutile_gold: {
    id: "rutile_gold",
    name: "Thạch Anh Tóc Vàng 6A",
    element: "Kim",
    basePricePerBead: 115000,
    cLight: "#FFF6D6",
    cMid: "#DFAC42",
    cDark: "#6B480E",
    cGlow: "#FFE28A",
    inclusion: "rutile-gold",
    swatchColor: "#DFAC42",
  },
  imperialJade: {
    id: "imperialJade",
    name: "Ngọc Phỉ Thúy Băng Chủng",
    element: "Mộc",
    basePricePerBead: 135000,
    cLight: "#B6F7D8",
    cMid: "#1C8C5E",
    cDark: "#093B25",
    cGlow: "#7CE8B4",
    inclusion: "jade-cloud",
    swatchColor: "#1C8C5E",
  },
  jade: {
    id: "jade",
    name: "Ngọc Phỉ Thúy Băng Chủng",
    element: "Mộc",
    basePricePerBead: 135000,
    cLight: "#B6F7D8",
    cMid: "#1C8C5E",
    cDark: "#093B25",
    cGlow: "#7CE8B4",
    inclusion: "jade-cloud",
    swatchColor: "#1C8C5E",
  },
  aquamarine: {
    id: "aquamarine",
    name: "Đá Aquamarine Lam Ngọc",
    element: "Thủy",
    basePricePerBead: 110000,
    cLight: "#D8F5FF",
    cMid: "#3694C7",
    cDark: "#0F3F61",
    cGlow: "#99E2FF",
    inclusion: "ice-vein",
    swatchColor: "#3694C7",
  },
  rutileRed: {
    id: "rutileRed",
    name: "Thạch Anh Tóc Đỏ Chu Sa",
    element: "Hỏa",
    basePricePerBead: 120000,
    cLight: "#FFD2C9",
    cMid: "#C84332",
    cDark: "#57120A",
    cGlow: "#FF8A7A",
    inclusion: "rutile-red",
    swatchColor: "#C84332",
  },
  garnet: {
    id: "garnet",
    name: "Thạch Anh Tóc Đỏ Chu Sa",
    element: "Hỏa",
    basePricePerBead: 120000,
    cLight: "#FFD2C9",
    cMid: "#C84332",
    cDark: "#57120A",
    cGlow: "#FF8A7A",
    inclusion: "rutile-red",
    swatchColor: "#C84332",
  },
  tigerEyeGold: {
    id: "tigerEyeGold",
    name: "Đá Mắt Hổ Vàng Tâm Hổ",
    element: "Thổ",
    basePricePerBead: 65000,
    cLight: "#F7D294",
    cMid: "#9E6324",
    cDark: "#361E07",
    cGlow: "#E8B364",
    inclusion: "tigereye",
    swatchColor: "#9E6324",
  },
  tigereye: {
    id: "tigereye",
    name: "Đá Mắt Hổ Vàng Tâm Hổ",
    element: "Thổ",
    basePricePerBead: 65000,
    cLight: "#F7D294",
    cMid: "#9E6324",
    cDark: "#361E07",
    cGlow: "#E8B364",
    inclusion: "tigereye",
    swatchColor: "#9E6324",
  },
  amethyst: {
    id: "amethyst",
    name: "Thạch Anh Tím Amethyst",
    element: "Hỏa",
    basePricePerBead: 78000,
    cLight: "#E8D8F0",
    cMid: "#6E4885",
    cDark: "#2A1836",
    cGlow: "#B894CC",
    inclusion: "ice-vein",
    swatchColor: "#6E4885",
  },
  rutileBlack: {
    id: "rutileBlack",
    name: "Thạch Anh Tóc Đen Huyền Vũ",
    element: "Thủy",
    basePricePerBead: 105000,
    cLight: "#E3E6E8",
    cMid: "#4A525A",
    cDark: "#121518",
    cGlow: "#9BA4AD",
    inclusion: "rutile-black",
    swatchColor: "#4A525A",
  },
  moonstone: {
    id: "moonstone",
    name: "Đá Mặt Trăng Ánh Xanh",
    element: "Kim",
    basePricePerBead: 95000,
    cLight: "#FFFFFF",
    cMid: "#B9D6EB",
    cDark: "#5B7891",
    cGlow: "#80D4FF",
    inclusion: "moon-sheen",
    swatchColor: "#B9D6EB",
  },
  roseQuartz: {
    id: "roseQuartz",
    name: "Thạch Anh Hồng Madagascar",
    element: "Hỏa",
    basePricePerBead: 72000,
    cLight: "#FFEBF0",
    cMid: "#E3869B",
    cDark: "#7D3244",
    cGlow: "#FFB8C9",
    inclusion: "jade-cloud",
    swatchColor: "#E3869B",
  },
  agarwoodRed: {
    id: "agarwoodRed",
    name: "Trầm Hương Tốc Kiến",
    element: "Mộc",
    basePricePerBead: 98000,
    cLight: "#BA8C63",
    cMid: "#6E4726",
    cDark: "#2E1A0B",
    cGlow: "#D4A373",
    inclusion: "wood-grain",
    swatchColor: "#6E4726",
  },
  lapisLazuli: {
    id: "lapisLazuli",
    name: "Đá Lapis Lazuli Thanh Kim",
    element: "Thủy",
    basePricePerBead: 88000,
    cLight: "#78A6FF",
    cMid: "#1C4496",
    cDark: "#0A1B47",
    cGlow: "#E8C56B",
    inclusion: "lapis-gold",
    swatchColor: "#1C4496",
  },
  nephriteJade: {
    id: "nephriteJade",
    name: "Ngọc Bích Nephrite Tuyển Chọn",
    element: "Mộc",
    basePricePerBead: 125000,
    cLight: "#9CE0B8",
    cMid: "#236B46",
    cDark: "#0B2B1A",
    cGlow: "#6BC492",
    inclusion: "jade-cloud",
    swatchColor: "#236B46",
  },
};

export const STUDIO_STONE_KEYS = [
  "rutileGold",
  "imperialJade",
  "aquamarine",
  "rutileRed",
  "tigerEyeGold",
  "moonstone",
] as const;

export const HERO_STAGE_IDS = ["sp-01", "sp-02", "sp-03"] as const;

export const HERO_SLIDES: HeroSlide[] = [
  {
    stoneKey: "rutileGold",
    charmType: "tyhuu",
    element: "Hợp mệnh Kim, Thổ",
    title: "Thạch Anh Tóc Vàng Đồng Trục",
    sub: "Hạt 10 ly tự nhiên Brazil, mật độ tóc dày ánh kim, phối charm Tỳ Hưu",
    price: 2850000,
  },
  {
    stoneKey: "imperialJade",
    charmType: "lotus",
    element: "Hợp mệnh Mộc, Hỏa",
    title: "Ngọc Phỉ Thúy Băng Chủng Liên Hoa",
    sub: "Ngọc tự nhiên Myanmar loại A chưa xử lý, chất ngọc trong mát dịu cổ tay",
    price: 3650000,
  },
  {
    stoneKey: "aquamarine",
    charmType: "luthong",
    element: "Hợp mệnh Thủy, Mộc",
    title: "Đá Aquamarine Lam Ngọc Tự Nhiên",
    sub: "Sắc xanh biển trong vắt, phối Lu Thống đá cùng phôi viền vàng",
    price: 2150000,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "sp-01",
    name: "Vòng Thạch Anh Tóc Vàng 6A Đồng Trục Kim Quang Phối Tỳ Hưu",
    subtitle: "6A VIP Đồng Trục · Charm Tỳ Hưu",
    category: "Thạch Anh Tóc",
    stone: "Thạch Anh Tóc Vàng",
    stoneKey: "rutileGold",
    charm: "tyhuu",
    charmType: "tyhuu",
    price: 2850000,
    oldPrice: 3400000,
    rating: 5.0,
    reviews: 142,
    certId: "LIULAB-98241",
    certCode: "LIULAB-98241",
    hardness: "7.0 / 10 Mohs",
    origin: "Brazil",
    grade: "6A VIP Đồng Trục",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12, 14],
    beadCount: 17,
    menh: "kim",
    menhName: "Mệnh Kim · Thổ",
    compatible: ["kim", "tho", "thuy"],
    elements: ["Kim", "Thổ"],
    tuongSinhFor: "Thủy",
    tuongHopFor: "Kim",
    purposes: ["Tài lộc", "Sự nghiệp"],
    benefit:
      "Chiêu tài lộc cực đại, củng cố bản lĩnh quyết đoán và thu hút vận may kinh doanh.",
    shortBenefit:
      "Chiêu tài lộc cực đại, củng cố bản lĩnh quyết đoán và thu hút vận may kinh doanh.",
    description:
      "Tuyển chọn từ những tinh thể Thạch Anh Tóc Vàng Brazil có mật độ sợi Rutile dày đặc, ánh kim rực rỡ dưới nắng. Phối cùng Tỳ Hưu Thiên Lộc chế tác tinh xảo giúp chiêu tài giữ lộc cho gia chủ.",
    energyScores: { taiLoc: 99, binhAn: 88, tinhDuyen: 82, sucKhoe: 90 },
  },
  {
    id: "sp-02",
    name: "Vòng Ngọc Phỉ Thúy Băng Chủng Tự Nhiên Charm Liên Hoa",
    subtitle: "Ngọc A Tự Nhiên · Charm Liên Hoa",
    category: "Ngọc Quý",
    stone: "Ngọc Phỉ Thúy",
    stoneKey: "imperialJade",
    charm: "lotus",
    charmType: "lotus",
    price: 3650000,
    oldPrice: 4200000,
    rating: 4.9,
    reviews: 98,
    certId: "PNJ-77319",
    certCode: "PNJ-77319",
    hardness: "6.5 - 7.0 Mohs",
    origin: "Myanmar (Miến Điện)",
    grade: "Ngọc A Tự Nhiên",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 18,
    menh: "moc",
    menhName: "Mệnh Mộc · Hỏa",
    compatible: ["moc", "hoa", "thuy"],
    elements: ["Mộc", "Hỏa"],
    tuongSinhFor: "Hỏa",
    tuongHopFor: "Mộc",
    purposes: ["Bình an", "Tài lộc"],
    benefit:
      "Dưỡng tâm an thần, cân bằng sinh khí, mang lại vẻ đẹp thanh cao và phúc trạch lâu dài.",
    shortBenefit:
      "Dưỡng tâm an thần, cân bằng sinh khí, mang lại vẻ đẹp thanh cao và phúc trạch lâu dài.",
    description:
      "Ngọc Phỉ Thúy (Jadeite) chuẩn Type A thiên nhiên 100% từ Myanmar với chất ngọc trong mướt, lên nước bóng mượt khi đeo lâu ngày.",
    energyScores: { taiLoc: 92, binhAn: 99, tinhDuyen: 90, sucKhoe: 98 },
  },
  {
    id: "sp-03",
    name: "Vòng Đá Aquamarine Lam Ngọc Biển Sâu Phối Lu Thống",
    subtitle: "5A Trong Mướt · Charm Lu Thống",
    category: "Đá Bán Quý",
    stone: "Đá Aquamarine",
    stoneKey: "aquamarine",
    charm: "luthong",
    charmType: "luthong",
    price: 2150000,
    oldPrice: 2550000,
    rating: 4.9,
    reviews: 116,
    certId: "LIULAB-66402",
    certCode: "LIULAB-66402",
    hardness: "7.5 - 8.0 Mohs",
    origin: "Brazil",
    grade: "5A Trong Mướt",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 17,
    menh: "thuy",
    menhName: "Mệnh Thủy · Mộc",
    compatible: ["thuy", "moc", "kim"],
    elements: ["Thủy", "Mộc"],
    tuongSinhFor: "Mộc",
    tuongHopFor: "Thủy",
    purposes: ["Sự nghiệp", "Bình an"],
    benefit:
      "Tăng khả năng giao tiếp thuyết phục, làm dịu căng thẳng và mang lại bình an khi di chuyển.",
    shortBenefit:
      "Tăng khả năng giao tiếp thuyết phục, làm dịu căng thẳng và mang lại bình an khi di chuyển.",
    description:
      "Mang sắc xanh thanh khiết của đại dương, viên đá giúp khai thông luân xa cổ họng, phù hợp cho người làm kinh doanh, đàm phán và ngoại giao.",
    energyScores: { taiLoc: 89, binhAn: 96, tinhDuyen: 88, sucKhoe: 92 },
  },
  {
    id: "sp-04",
    name: "Vòng Thạch Anh Tóc Đỏ Chu Sa 5A Charm Liên Hoa Vàng",
    subtitle: "5A Tóc Mịn Đều · Charm Liên Hoa",
    category: "Thạch Anh Tóc",
    stone: "Thạch Anh Tóc Đỏ",
    stoneKey: "rutileRed",
    charm: "lotus",
    charmType: "lotus",
    price: 2490000,
    oldPrice: 2950000,
    rating: 5.0,
    reviews: 87,
    certId: "LIULAB-51908",
    certCode: "LIULAB-51908",
    hardness: "7.0 / 10 Mohs",
    origin: "Brazil",
    grade: "5A Tóc Mịn Đều",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 17,
    menh: "hoa",
    menhName: "Mệnh Hỏa · Thổ",
    compatible: ["hoa", "tho", "moc"],
    elements: ["Hỏa", "Thổ"],
    tuongSinhFor: "Thổ",
    tuongHopFor: "Hỏa",
    purposes: ["Tình duyên", "Tài lộc"],
    benefit:
      "Tăng cường khí huyết, thu hút nhân duyên tốt đẹp và khơi dậy nguồn năng lượng nhiệt huyết.",
    shortBenefit:
      "Tăng cường khí huyết, thu hút nhân duyên tốt đẹp và khơi dậy nguồn năng lượng nhiệt huyết.",
    description:
      "Sợi tóc đỏ đồng ánh kim bên trong tinh thể thạch anh giúp lưu thông khí huyết, tôn vinh khí chất quyến rũ và thu hút quý nhân cho người mệnh Hỏa, mệnh Thổ.",
    energyScores: { taiLoc: 93, binhAn: 89, tinhDuyen: 98, sucKhoe: 94 },
  },
  {
    id: "sp-05",
    name: "Vòng Đá Mắt Hổ Vàng Tâm Hổ VIP Phối Tỳ Hưu Chiêu Tài",
    subtitle: "VIP Ánh Lụa Sắc Nét · Charm Tỳ Hưu",
    category: "Đá Mắt Hổ & Trầm",
    stone: "Đá Mắt Hổ Vàng",
    stoneKey: "tigerEyeGold",
    charm: "tyhuu",
    charmType: "tyhuu",
    price: 1290000,
    oldPrice: 1650000,
    rating: 4.8,
    reviews: 215,
    certId: "PNJ-33910",
    certCode: "PNJ-33910",
    hardness: "7.0 / 10 Mohs",
    origin: "Nam Phi",
    grade: "VIP Ánh Lụa Sắc Nét",
    beadMm: 12,
    defaultSize: 12,
    sizes: [10, 12, 14],
    beadCount: 17,
    menh: "tho",
    menhName: "Mệnh Thổ · Kim",
    compatible: ["tho", "kim", "hoa"],
    elements: ["Thổ", "Kim"],
    tuongSinhFor: "Kim",
    tuongHopFor: "Thổ",
    purposes: ["Tài lộc", "Sự nghiệp"],
    benefit:
      "Tăng sự tự tin, dũng khí vượt thử thách, trừ tà khí và giữ vững tài sản.",
    shortBenefit:
      "Tăng sự tự tin, dũng khí vượt thử thách, trừ tà khí và giữ vững tài sản.",
    description:
      "Đá Mắt Hổ Vàng Tâm Nam Phi với hiệu ứng ánh lụa chạy sống động trên từng viên đá, biểu tượng của quyền uy và bản lĩnh vững vàng.",
    energyScores: { taiLoc: 95, binhAn: 93, tinhDuyen: 80, sucKhoe: 90 },
  },
  {
    id: "sp-06",
    name: "Vòng Thạch Anh Tóc Đen Huyền Vũ Phẩm Cấp 6A Nguyên Bản",
    subtitle: "6A Nước Trong Tóc Đậm · Nguyên Bản",
    category: "Thạch Anh Tóc",
    stone: "Thạch Anh Tóc Đen",
    stoneKey: "rutileBlack",
    charm: "none",
    charmType: "none",
    price: 2350000,
    oldPrice: 2800000,
    rating: 4.9,
    reviews: 74,
    certId: "LIULAB-81204",
    certCode: "LIULAB-81204",
    hardness: "7.0 / 10 Mohs",
    origin: "Brazil",
    grade: "6A Nước Trong Tóc Đậm",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12, 14],
    beadCount: 17,
    menh: "thuy",
    menhName: "Mệnh Thủy · Mộc",
    compatible: ["thuy", "moc", "kim"],
    elements: ["Thủy", "Mộc"],
    tuongSinhFor: "Mộc",
    tuongHopFor: "Thủy",
    purposes: ["Bình an", "Sự nghiệp"],
    benefit:
      "Hóa giải tiểu nhân thị phi, bảo vệ trường năng lượng và mang lại sự minh mẫn.",
    shortBenefit:
      "Hóa giải tiểu nhân thị phi, bảo vệ trường năng lượng và mang lại sự minh mẫn.",
    description:
      "Chứa các tinh thể Tourmaline đen hình kim đan xen trong nền thạch anh trắng trong suốt, tạo nên lá chắn phong thủy mạnh mẽ.",
    energyScores: { taiLoc: 88, binhAn: 99, tinhDuyen: 82, sucKhoe: 95 },
  },
  {
    id: "sp-07",
    name: "Vòng Thạch Anh Tím Amethyst Uruguay Charm Hoa Sen",
    subtitle: "5A Tím Đậm Tự Nhiên · Charm Hoa Sen",
    category: "Đá Bán Quý",
    stone: "Thạch Anh Tím",
    stoneKey: "amethyst",
    charm: "lotus",
    charmType: "lotus",
    price: 1680000,
    oldPrice: 1990000,
    rating: 4.9,
    reviews: 109,
    certId: "PNJ-44821",
    certCode: "PNJ-44821",
    hardness: "7.0 / 10 Mohs",
    origin: "Uruguay",
    grade: "5A Tím Đậm Tự Nhiên",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 17,
    menh: "hoa",
    menhName: "Mệnh Hỏa · Thổ",
    compatible: ["hoa", "tho", "moc"],
    elements: ["Hỏa", "Thổ"],
    tuongSinhFor: "Thổ",
    tuongHopFor: "Hỏa",
    purposes: ["Sự nghiệp", "Bình an"],
    benefit:
      "Khai mở trí tuệ, cải thiện giấc ngủ sâu và thu hút quý nhân nâng đỡ công danh.",
    shortBenefit:
      "Khai mở trí tuệ, cải thiện giấc ngủ sâu và thu hút quý nhân nâng đỡ công danh.",
    description:
      "Thạch Anh Tím Uruguay nổi tiếng với sắc độ trầm sâu, tần số năng lượng cao giúp tĩnh tâm, tập trung trí lực và an giấc.",
    energyScores: { taiLoc: 87, binhAn: 97, tinhDuyen: 91, sucKhoe: 96 },
  },
  {
    id: "sp-08",
    name: "Vòng Đá Mặt Trăng Moonstone Ánh Xanh Cầu Vồng 5A",
    subtitle: "5A Xà Cừ Xanh Lam · Charm Liên Hoa",
    category: "Đá Bán Quý",
    stone: "Đá Mặt Trăng",
    stoneKey: "moonstone",
    charm: "lotus",
    charmType: "lotus",
    price: 1950000,
    oldPrice: 2350000,
    rating: 5.0,
    reviews: 92,
    certId: "LIULAB-70312",
    certCode: "LIULAB-70312",
    hardness: "6.0 - 6.5 Mohs",
    origin: "Sri Lanka",
    grade: "5A Xà Cừ Xanh Lam",
    beadMm: 8,
    defaultSize: 8,
    sizes: [8, 10],
    beadCount: 21,
    menh: "kim",
    menhName: "Mệnh Kim · Thủy",
    compatible: ["kim", "thuy", "tho"],
    elements: ["Kim", "Thủy"],
    tuongSinhFor: "Thủy",
    tuongHopFor: "Kim",
    purposes: ["Tình duyên", "Bình an"],
    benefit:
      "Gắn kết tình cảm đôi lứa, cân bằng cảm xúc dịu dàng và đánh thức trực giác nhạy bén.",
    shortBenefit:
      "Gắn kết tình cảm đôi lứa, cân bằng cảm xúc dịu dàng và đánh thức trực giác nhạy bén.",
    description:
      "Mỗi viên Moonstone ẩn chứa ánh xà cừ xanh lam tựa ánh trăng phản chiếu mặt hồ, là viên đá hộ mệnh của tình cảm viên mãn.",
    energyScores: { taiLoc: 85, binhAn: 95, tinhDuyen: 99, sucKhoe: 91 },
  },
  {
    id: "sp-09",
    name: "Vòng Trầm Hương Tốc Kiến Tự Nhiên Phối Lu Thống Ngọc",
    subtitle: "Trầm Tốc Tự Nhiên 14 Năm · Lu Thống",
    category: "Đá Mắt Hổ & Trầm",
    stone: "Trầm Hương Tốc Kiến",
    stoneKey: "agarwoodRed",
    charm: "luthong",
    charmType: "luthong",
    price: 2250000,
    oldPrice: 2700000,
    rating: 4.9,
    reviews: 134,
    certId: "LIULAB-59011",
    certCode: "LIULAB-59011",
    hardness: "Gỗ Trầm Tích Dầu",
    origin: "Khánh Hòa, Việt Nam",
    grade: "Trầm Tốc Tự Nhiên 14 Năm",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12, 14],
    beadCount: 17,
    menh: "moc",
    menhName: "Mệnh Mộc · Hỏa",
    compatible: ["moc", "hoa", "thuy"],
    elements: ["Mộc", "Hỏa", "Thổ"],
    tuongSinhFor: "Hỏa",
    tuongHopFor: "Mộc",
    purposes: ["Bình an", "Tài lộc"],
    benefit:
      "Hương trầm dịu ngọt định tâm, xua tan uế khí, kích hoạt tài vận hanh thông.",
    shortBenefit:
      "Hương trầm dịu ngọt định tâm, xua tan uế khí, kích hoạt tài vận hanh thông.",
    description:
      "Chế tác từ phôi Trầm Hương Tốc Kiến tự nhiên rừng Khánh Hòa, vân dầu rõ nét, tỏa hương thơm thanh ngọt tự nhiên theo thân nhiệt người đeo.",
    energyScores: { taiLoc: 94, binhAn: 99, tinhDuyen: 87, sucKhoe: 97 },
  },
  {
    id: "sp-10",
    name: "Vòng Thạch Anh Hồng Madagascar Ánh Sao Charm Liên Hoa",
    subtitle: "5A Hồng Phấn Trong · Charm Liên Hoa",
    category: "Đá Bán Quý",
    stone: "Thạch Anh Hồng",
    stoneKey: "roseQuartz",
    charm: "lotus",
    charmType: "lotus",
    price: 1450000,
    oldPrice: 1790000,
    rating: 4.8,
    reviews: 128,
    certId: "PNJ-29405",
    certCode: "PNJ-29405",
    hardness: "7.0 / 10 Mohs",
    origin: "Madagascar",
    grade: "5A Hồng Phấn Trong",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 18,
    menh: "hoa",
    menhName: "Mệnh Hỏa · Thổ",
    compatible: ["hoa", "tho", "moc"],
    elements: ["Hỏa", "Thổ"],
    tuongSinhFor: "Thổ",
    tuongHopFor: "Hỏa",
    purposes: ["Tình duyên", "Bình an"],
    benefit:
      "Thu hút nhân duyên tốt lành, hóa giải mâu thuẫn gia đạo và mở rộng mối quan hệ khách hàng.",
    shortBenefit:
      "Thu hút nhân duyên tốt lành, hóa giải mâu thuẫn gia đạo và mở rộng mối quan hệ khách hàng.",
    description:
      "Thạch Anh Hồng vùng Madagascar có độ trong suốt và sắc hồng phấn dịu dàng, nuôi dưỡng sự gắn kết và mang lại thiện cảm từ người đối diện.",
    energyScores: { taiLoc: 86, binhAn: 93, tinhDuyen: 99, sucKhoe: 90 },
  },
  {
    id: "sp-11",
    name: "Vòng Đá Lapis Lazuli Thanh Kim Hoàng Gia Phối Tỳ Hưu",
    subtitle: "5A Điểm Vẩy Vàng Pyrite · Charm Tỳ Hưu",
    category: "Đá Bán Quý",
    stone: "Đá Lapis Lazuli",
    stoneKey: "lapisLazuli",
    charm: "tyhuu",
    charmType: "tyhuu",
    price: 1890000,
    oldPrice: 2250000,
    rating: 4.9,
    reviews: 63,
    certId: "LIULAB-61982",
    certCode: "LIULAB-61982",
    hardness: "5.5 - 6.0 Mohs",
    origin: "Afghanistan",
    grade: "5A Điểm Vẩy Vàng Pyrite",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 17,
    menh: "thuy",
    menhName: "Mệnh Thủy · Mộc",
    compatible: ["thuy", "moc", "kim"],
    elements: ["Thủy", "Mộc"],
    tuongSinhFor: "Mộc",
    tuongHopFor: "Thủy",
    purposes: ["Sự nghiệp", "Tài lộc"],
    benefit:
      "Tôn vinh trí tuệ minh triết, thăng tiến quyền lực và thu hút vượng khí tài chính.",
    shortBenefit:
      "Tôn vinh trí tuệ minh triết, thăng tiến quyền lực và thu hút vượng khí tài chính.",
    description:
      "Sắc xanh lam thẫm điểm xuyết những hạt Pyrite lấp lánh như bầu trời đêm. Thanh Kim Thạch từ lâu là biểu tượng của sự minh triết.",
    energyScores: { taiLoc: 93, binhAn: 94, tinhDuyen: 85, sucKhoe: 91 },
  },
  {
    id: "sp-12",
    name: "Vòng Ngọc Bích Nephrite Tuyển Chọn Nguyên Khối 10 Ly",
    subtitle: "6A Xanh Lục Bảo Đồng Đều · Nguyên Khối",
    category: "Ngọc Quý",
    stone: "Ngọc Bích Nephrite",
    stoneKey: "nephriteJade",
    charm: "none",
    charmType: "none",
    price: 3150000,
    oldPrice: 3750000,
    rating: 5.0,
    reviews: 81,
    certId: "PNJ-88512",
    certCode: "PNJ-88512",
    hardness: "6.0 - 6.5 Mohs",
    origin: "Canada",
    grade: "6A Xanh Lục Bảo Đồng Đều",
    beadMm: 10,
    defaultSize: 10,
    sizes: [8, 10, 12],
    beadCount: 17,
    menh: "moc",
    menhName: "Mệnh Mộc · Hỏa",
    compatible: ["moc", "hoa", "thuy"],
    elements: ["Mộc", "Hỏa"],
    tuongSinhFor: "Hỏa",
    tuongHopFor: "Mộc",
    purposes: ["Bình an", "Tài lộc"],
    benefit:
      "Tăng cường sinh lực, hộ mệnh bình an và tích tụ phúc khí thịnh vượng cho gia tộc.",
    shortBenefit:
      "Tăng cường sinh lực, hộ mệnh bình an và tích tụ phúc khí thịnh vượng cho gia tộc.",
    description:
      "Ngọc Bích Nephrite tự nhiên có độ dai kết cấu cao nhất trong các loài ngọc, sắc xanh lục ấm áp, bóng mịn như lụa, thích hợp làm vật phẩm truyền đời.",
    energyScores: { taiLoc: 95, binhAn: 99, tinhDuyen: 89, sucKhoe: 99 },
  },
];

const THIEN_CAN = [
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
];
const DIA_CHI = [
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
];

const NAP_AM_TABLE: { element: ElementType; name: string }[] = [
  { element: "Kim", name: "Hải Trung Kim (Vàng trong biển)" },
  { element: "Hỏa", name: "Lô Trung Hỏa (Lửa trong lò)" },
  { element: "Mộc", name: "Đại Lâm Mộc (Gỗ rừng già)" },
  { element: "Thổ", name: "Lộ Bàng Thổ (Đất ven đường)" },
  { element: "Kim", name: "Kiếm Phong Kim (Vàng mũi kiếm)" },
  { element: "Hỏa", name: "Sơn Đầu Hỏa (Lửa trên núi)" },
  { element: "Thủy", name: "Giản Hạ Thủy (Nước dưới khe)" },
  { element: "Thổ", name: "Thành Đầu Thổ (Đất tường thành)" },
  { element: "Kim", name: "Bạch Lạp Kim (Vàng chân đèn)" },
  { element: "Mộc", name: "Dương Liễu Mộc (Gỗ cây dương)" },
  { element: "Thủy", name: "Tuyền Trung Thủy (Nước trong suối)" },
  { element: "Thổ", name: "Ốc Thượng Thổ (Đất mái nhà)" },
  { element: "Hỏa", name: "Tích Lịch Hỏa (Lửa sấm sét)" },
  { element: "Mộc", name: "Tùng Bách Mộc (Gỗ tùng bách)" },
  { element: "Thủy", name: "Trường Lưu Thủy (Nước chảy mạnh)" },
  { element: "Kim", name: "Sa Trung Kim (Vàng trong cát)" },
  { element: "Hỏa", name: "Sơn Hạ Hỏa (Lửa dưới chân núi)" },
  { element: "Mộc", name: "Bình Địa Mộc (Gỗ đồng bằng)" },
  { element: "Thổ", name: "Bích Thượng Thổ (Đất trên vách)" },
  { element: "Kim", name: "Kim Bạch Kim (Vàng pha bạc)" },
  { element: "Hỏa", name: "Phú Đăng Hỏa (Lửa đèn chụp)" },
  { element: "Thủy", name: "Thiên Hà Thủy (Nước trên trời)" },
  { element: "Thổ", name: "Đại Trạch Thổ (Đất nền nhà)" },
  { element: "Kim", name: "Thoa Xuyến Kim (Vàng trang sức)" },
  { element: "Mộc", name: "Tang Đố Mộc (Gỗ cây dâu)" },
  { element: "Thủy", name: "Đại Khê Thủy (Nước khe lớn)" },
  { element: "Thổ", name: "Sa Trung Thổ (Đất pha cát)" },
  { element: "Hỏa", name: "Thiên Thượng Hỏa (Lửa trên trời)" },
  { element: "Mộc", name: "Thạch Lựu Mộc (Gỗ cây lựu đá)" },
  { element: "Thủy", name: "Đại Hải Thủy (Nước biển lớn)" },
];

export interface ElementRelation {
  tuongSinhElement: ElementType;
  tuongSinhLabel: string;
  tuongSinhColors: { name: string; hex: string }[];
  banMenhLabel: string;
  banMenhColors: { name: string; hex: string }[];
  khacLabel: string;
  recommendedStones: string;
}

export const ELEMENT_RELATIONS: Record<ElementType, ElementRelation> = {
  Kim: {
    tuongSinhElement: "Thổ",
    tuongSinhLabel: "Hành Thổ (Thổ sinh Kim · Đại Cát)",
    tuongSinhColors: [
      { name: "Vàng Nâu", hex: "#B88938" },
      { name: "Hổ Phách", hex: "#D49B35" },
    ],
    banMenhLabel: "Hành Kim (Tương Hợp Bản Mệnh)",
    banMenhColors: [
      { name: "Trắng Ánh Kim", hex: "#EAE6DF" },
      { name: "Vàng Kim", hex: "#F2C94C" },
    ],
    khacLabel: "Nên hạn chế màu Đỏ, Hồng, Tím (Hỏa khắc Kim)",
    recommendedStones:
      "Thạch Anh Tóc Vàng, Đá Mắt Hổ Vàng Nâu, Đá Mặt Trăng Moonstone",
  },
  Mộc: {
    tuongSinhElement: "Thủy",
    tuongSinhLabel: "Hành Thủy (Thủy sinh Mộc · Đại Cát)",
    tuongSinhColors: [
      { name: "Xanh Lam Biển", hex: "#2D88C4" },
      { name: "Đen Huyền", hex: "#222831" },
    ],
    banMenhLabel: "Hành Mộc (Tương Hợp Bản Mệnh)",
    banMenhColors: [
      { name: "Xanh Ngọc Phỉ Thúy", hex: "#1C8C5E" },
      { name: "Nâu Gỗ Trầm", hex: "#6E4726" },
    ],
    khacLabel: "Nên hạn chế màu Trắng, Ánh Bạc (Kim khắc Mộc)",
    recommendedStones:
      "Ngọc Phỉ Thúy, Ngọc Bích Nephrite, Đá Aquamarine, Thạch Anh Tóc Đen",
  },
  Thủy: {
    tuongSinhElement: "Kim",
    tuongSinhLabel: "Hành Kim (Kim sinh Thủy · Đại Cát)",
    tuongSinhColors: [
      { name: "Trắng Xà Cừ", hex: "#F0F4F8" },
      { name: "Vàng Ánh Kim", hex: "#DFAC42" },
    ],
    banMenhLabel: "Hành Thủy (Tương Hợp Bản Mệnh)",
    banMenhColors: [
      { name: "Xanh Aquamarine", hex: "#3694C7" },
      { name: "Đen Huyền Vũ", hex: "#1E242B" },
      { name: "Xanh Thanh Kim", hex: "#1C4496" },
    ],
    khacLabel: "Nên hạn chế màu Nâu Đất, Vàng Sẫm (Thổ khắc Thủy)",
    recommendedStones:
      "Đá Aquamarine, Thạch Anh Tóc Đen, Đá Mặt Trăng Moonstone, Thạch Anh Tóc Vàng",
  },
  Hỏa: {
    tuongSinhElement: "Mộc",
    tuongSinhLabel: "Hành Mộc (Mộc sinh Hỏa · Đại Cát)",
    tuongSinhColors: [
      { name: "Xanh Ngọc Lục", hex: "#1C8C5E" },
      { name: "Nâu Trầm Hương", hex: "#7A502E" },
    ],
    banMenhLabel: "Hành Hỏa (Tương Hợp Bản Mệnh)",
    banMenhColors: [
      { name: "Đỏ Chu Sa", hex: "#C84332" },
      { name: "Hồng Đào", hex: "#E3869B" },
    ],
    khacLabel: "Nên hạn chế màu Đen, Xanh Nước Biển (Thủy khắc Hỏa)",
    recommendedStones:
      "Thạch Anh Tóc Đỏ, Ngọc Phỉ Thúy, Thạch Anh Tím, Thạch Anh Hồng",
  },
  Thổ: {
    tuongSinhElement: "Hỏa",
    tuongSinhLabel: "Hành Hỏa (Hỏa sinh Thổ · Đại Cát)",
    tuongSinhColors: [
      { name: "Đỏ Chu Sa", hex: "#C84332" },
      { name: "Hồng Phấn", hex: "#E3869B" },
    ],
    banMenhLabel: "Hành Thổ (Tương Hợp Bản Mệnh)",
    banMenhColors: [
      { name: "Vàng Nâu Mắt Hổ", hex: "#9E6324" },
      { name: "Vàng Kim Thổ", hex: "#D4A03E" },
    ],
    khacLabel: "Nên hạn chế màu Xanh Lục Đậm (Mộc khắc Thổ)",
    recommendedStones:
      "Đá Mắt Hổ Vàng Nâu, Thạch Anh Tóc Vàng, Thạch Anh Tóc Đỏ, Thạch Anh Tím",
  },
};

const ELEMENT_TO_KEY: Record<ElementType, ElementKey> = {
  Kim: "kim",
  Mộc: "moc",
  Thủy: "thuy",
  Hỏa: "hoa",
  Thổ: "tho",
};

export interface DestinyEntry {
  canChi: string;
  menh: ElementKey;
  menhName: string;
  napAm: string;
  desc: string;
  tuongSinhElement: string;
  sinhColors: { name: string; hex: string }[];
  hopColors: { name: string; hex: string }[];
  khacNote: string;
}

export const DESTINY_TABLE: DestinyEntry[] = NAP_AM_TABLE.map((item, idx) => {
  const yearA = 1984 + idx * 2;
  const yearB = yearA + 1;
  const canChiA = `${THIEN_CAN[yearA % 10]} ${DIA_CHI[yearA % 12]}`;
  const canChiB = `${THIEN_CAN[yearB % 10]} ${DIA_CHI[yearB % 12]}`;
  const rel = ELEMENT_RELATIONS[item.element];
  return {
    canChi: `${canChiA} / ${canChiB}`,
    menh: ELEMENT_TO_KEY[item.element],
    menhName: `Mệnh ${item.element}`,
    napAm: item.name,
    desc: `Người mang nạp âm ${item.name} hợp đeo các dòng đá ${rel.recommendedStones} để kích hoạt cát khí, cân bằng năng lượng và thu hút quý nhân.`,
    tuongSinhElement: rel.tuongSinhLabel,
    sinhColors: rel.tuongSinhColors,
    hopColors: rel.banMenhColors,
    khacNote: rel.khacLabel,
  };
});

export function calculateFengShuiByYear(
  year: number | string,
  gender: string = "female"
) {
  const y = typeof year === "number" ? year : parseInt(year, 10) || 1996;
  const can = THIEN_CAN[y % 10];
  const chi = DIA_CHI[y % 12];
  const canChi = `${can} ${chi}`;

  let offset = (y - 1984) % 60;
  if (offset < 0) offset += 60;
  const pairIndex = Math.floor(offset / 2);
  const napAm = NAP_AM_TABLE[pairIndex];
  const relation = ELEMENT_RELATIONS[napAm.element];

  return {
    year: y,
    canChi,
    genderLabel: gender === "male" ? "Nam Mệnh" : "Nữ Mệnh",
    element: napAm.element,
    napAmName: napAm.name,
    relation,
  };
}

export function formatVND(amount: number): string {
  const n = Math.round(Number(amount) || 0);
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
}

export function getCycleInfo(beadCount: number) {
  const rem = beadCount % 4;
  if (rem === 1) {
    return {
      cycle: "Sinh" as const,
      badgeText: "Cung Sinh (Đại Cát)",
      isGood: true,
    };
  }
  if (rem === 2) {
    return {
      cycle: "Lão" as const,
      badgeText: "Cung Lão (Tốt · Bền Bỉ)",
      isGood: true,
    };
  }
  if (rem === 3) {
    return {
      cycle: "Bệnh" as const,
      badgeText: "Cung Bệnh (Nên +2 hạt về Cung Sinh)",
      isGood: false,
    };
  }
  return {
    cycle: "Tử" as const,
    badgeText: "Cung Tử (Nên +1 hạt về Cung Sinh)",
    isGood: false,
  };
}

export function getSinhCycleStatus(beadCount: number) {
  const rem = beadCount % 4;
  if (rem === 1) {
    return {
      step: "sinh" as const,
      title: "Cung Sinh (Đại Cát)",
      isGood: true,
    };
  }
  if (rem === 2) {
    return {
      step: "lao" as const,
      title: "Cung Lão (Phúc Trạch)",
      isGood: true,
    };
  }
  if (rem === 3) {
    return {
      step: "benh" as const,
      title: "Cung Bệnh (Nên +2 hạt)",
      isGood: false,
    };
  }
  return {
    step: "tu" as const,
    title: "Cung Tử (Nên +1 hạt)",
    isGood: false,
  };
}

export function suggestSinhBeadCount(wristCm: number, beadMm: number): number {
  const innerCircMm = wristCm * 10 + beadMm * Math.PI;
  const rawCount = Math.round(innerCircMm / beadMm);
  const sinhNumbers = [13, 17, 21, 25];
  let closest = 17;
  let minDiff = Infinity;
  for (const s of sinhNumbers) {
    const diff = Math.abs(s - rawCount);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }
  return closest;
}
