import { Product, Category } from '@/domain/entities/Product';
import { IProductRepository, GetProductsQuery, PagedProductsResult } from '@/domain/repositories/IProductRepository';
import { Sanitizer } from '../security/sanitizer';

// ===========================================
// Danh mục chính giống webtaphoa.vn
// ===========================================
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Góc Quê Nhà', slug: 'goc-que-nha', iconName: 'Home', itemCount: 120 },
  { id: 'cat-2', name: 'Góc Cao Tuổi', slug: 'goc-cao-tuoi', iconName: 'Heart', itemCount: 45 },
  { id: 'cat-3', name: 'Góc Mẹ Và Bé', slug: 'goc-me-va-be', iconName: 'Baby', itemCount: 98 },
  { id: 'cat-4', name: 'Góc Phái Đẹp', slug: 'goc-phai-dep', iconName: 'Sparkles', itemCount: 76 },
  { id: 'cat-5', name: 'Góc Nấu Ăn', slug: 'goc-nau-an', iconName: 'ChefHat', itemCount: 215 },
  { id: 'cat-6', name: 'Góc Thực Phẩm', slug: 'goc-thuc-pham', iconName: 'Coffee', itemCount: 320 },
  { id: 'cat-7', name: 'Góc Sạch Đẹp', slug: 'goc-sach-dep', iconName: 'SprayCan', itemCount: 142 },
  { id: 'cat-8', name: 'Góc Học Tập', slug: 'goc-hoc-tap', iconName: 'BookOpen', itemCount: 38 },
  { id: 'cat-9', name: 'Góc Điện Máy', slug: 'goc-dien-may', iconName: 'Zap', itemCount: 65 },
];

// ===========================================
// Subcategories theo webtaphoa.vn
// ===========================================
export interface SubCategory {
  id: string;
  parentId: string;
  name: string;
  slug: string;
}

export const MOCK_SUBCATEGORIES: SubCategory[] = [
  // Góc Quê Nhà
  { id: 'sub-1-1', parentId: 'cat-1', name: 'Đặc Sản Bình Thuận', slug: 'dac-san-binh-thuan' },
  { id: 'sub-1-2', parentId: 'cat-1', name: 'Đặc Sản Đà Lạt', slug: 'dac-san-da-lat' },
  { id: 'sub-1-3', parentId: 'cat-1', name: 'Đặc Sản Tây Ninh', slug: 'dac-san-tay-ninh' },
  { id: 'sub-1-4', parentId: 'cat-1', name: 'Đặc Sản Bến Tre', slug: 'dac-san-ben-tre' },
  { id: 'sub-1-5', parentId: 'cat-1', name: 'Đặc Sản Vũng Tàu', slug: 'dac-san-vung-tau' },
  // Góc Cao Tuổi
  { id: 'sub-2-1', parentId: 'cat-2', name: 'Tã Người Già', slug: 'ta-nguoi-gia' },
  { id: 'sub-2-2', parentId: 'cat-2', name: 'Nghệ Viên', slug: 'nghe-vien' },
  { id: 'sub-2-3', parentId: 'cat-2', name: 'Sữa Dưỡng Sinh', slug: 'sua-duong-sinh' },
  { id: 'sub-2-4', parentId: 'cat-2', name: 'Nước Yến', slug: 'nuoc-yen' },
  { id: 'sub-2-5', parentId: 'cat-2', name: 'Mật Ong', slug: 'mat-ong' },
  // Góc Mẹ Và Bé
  { id: 'sub-3-1', parentId: 'cat-3', name: 'Sữa Dành Cho Bé', slug: 'sua-danh-cho-be' },
  { id: 'sub-3-2', parentId: 'cat-3', name: 'Tã Giấy Cho Bé', slug: 'ta-giay-cho-be' },
  { id: 'sub-3-3', parentId: 'cat-3', name: 'Sữa Tắm Gội Cho Bé', slug: 'sua-tam-goi-cho-be' },
  { id: 'sub-3-4', parentId: 'cat-3', name: 'Sữa Chua Dành Cho Bé', slug: 'sua-chua-danh-cho-be' },
  { id: 'sub-3-5', parentId: 'cat-3', name: 'Bánh Ăn Dặm', slug: 'banh-an-dam' },
  // Góc Phái Đẹp
  { id: 'sub-4-1', parentId: 'cat-4', name: 'Dầu Gội Nữ', slug: 'dau-goi-nu' },
  { id: 'sub-4-2', parentId: 'cat-4', name: 'Sữa Tắm Nữ', slug: 'sua-tam-nu' },
  { id: 'sub-4-3', parentId: 'cat-4', name: 'Băng Vệ Sinh', slug: 'bang-ve-sinh' },
  { id: 'sub-4-4', parentId: 'cat-4', name: 'Sữa Dưỡng Thể', slug: 'sua-duong-the' },
  // Góc Nấu Ăn
  { id: 'sub-5-1', parentId: 'cat-5', name: 'Dầu Ăn', slug: 'dau-an' },
  { id: 'sub-5-2', parentId: 'cat-5', name: 'Nước Mắm', slug: 'nuoc-mam' },
  { id: 'sub-5-3', parentId: 'cat-5', name: 'Nước Tương', slug: 'nuoc-tuong' },
  { id: 'sub-5-4', parentId: 'cat-5', name: 'Tương Sốt (Xốt)', slug: 'tuong-sot' },
  { id: 'sub-5-5', parentId: 'cat-5', name: 'Đường', slug: 'duong' },
  { id: 'sub-5-6', parentId: 'cat-5', name: 'Bột', slug: 'bot' },
  { id: 'sub-5-7', parentId: 'cat-5', name: 'Gạo', slug: 'gao' },
  // Góc Thực Phẩm
  { id: 'sub-6-1', parentId: 'cat-6', name: 'Bánh', slug: 'banh' },
  { id: 'sub-6-2', parentId: 'cat-6', name: 'Kẹo', slug: 'keo' },
  { id: 'sub-6-3', parentId: 'cat-6', name: 'Cà Phê', slug: 'ca-phe' },
  { id: 'sub-6-4', parentId: 'cat-6', name: 'Nước Ngọt', slug: 'nuoc-ngot' },
  { id: 'sub-6-5', parentId: 'cat-6', name: 'Sữa Nước', slug: 'sua-nuoc' },
  { id: 'sub-6-6', parentId: 'cat-6', name: 'Mì Cháo Phở Ăn Liền', slug: 'mi-chao-pho-an-lien' },
  { id: 'sub-6-7', parentId: 'cat-6', name: 'Trà Ngon', slug: 'tra-ngon' },
  { id: 'sub-6-8', parentId: 'cat-6', name: 'Nước Suối', slug: 'nuoc-suoi' },
  { id: 'sub-6-9', parentId: 'cat-6', name: 'Sữa Đặc', slug: 'sua-dac' },
  { id: 'sub-6-10', parentId: 'cat-6', name: 'Kem Lạnh', slug: 'kem-lanh' },
  // Góc Sạch Đẹp
  { id: 'sub-7-1', parentId: 'cat-7', name: 'Nước Giặt', slug: 'nuoc-giat' },
  { id: 'sub-7-2', parentId: 'cat-7', name: 'Nước Xả', slug: 'nuoc-xa' },
  { id: 'sub-7-3', parentId: 'cat-7', name: 'Nước Rửa Chén Bát', slug: 'nuoc-rua-chen-bat' },
  { id: 'sub-7-4', parentId: 'cat-7', name: 'Giấy Vệ Sinh', slug: 'giay-ve-sinh' },
  { id: 'sub-7-5', parentId: 'cat-7', name: 'Kem Đánh Răng', slug: 'kem-danh-rang' },
  { id: 'sub-7-6', parentId: 'cat-7', name: 'Nước Lau Nhà Cửa', slug: 'nuoc-lau-nha-cua' },
  // Góc Học Tập
  { id: 'sub-8-1', parentId: 'cat-8', name: 'Sách Tham Khảo', slug: 'sach-tham-khao' },
  { id: 'sub-8-2', parentId: 'cat-8', name: 'Văn Phòng Phẩm', slug: 'van-phong-pham' },
  { id: 'sub-8-3', parentId: 'cat-8', name: 'Đồ Dùng Học Sinh', slug: 'do-dung-hoc-sinh' },
  // Góc Điện Máy
  { id: 'sub-9-1', parentId: 'cat-9', name: 'Pin Bình Tích Điện', slug: 'pin-binh-tich-dien' },
  { id: 'sub-9-2', parentId: 'cat-9', name: 'Quạt Điện', slug: 'quat-dien' },
  { id: 'sub-9-3', parentId: 'cat-9', name: 'Dây Ổ Cắm Điện', slug: 'day-o-cam-dien' },
  { id: 'sub-9-4', parentId: 'cat-9', name: 'Bếp Gaz', slug: 'bep-gaz' },
  { id: 'sub-9-5', parentId: 'cat-9', name: 'Bếp Điện', slug: 'bep-dien' },
];

// ===========================================
// Sản phẩm mock phong phú theo webtaphoa.vn
// ===========================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Sữa Tươi Tiệt Trùng Vinamilk 100% Có Đường 1L',
    slug: 'sua-tuoi-tiet-trung-vinamilk-100-co-duong-1l',
    price: 36000,
    originalPrice: 42000,
    discountPercent: 14,
    categoryId: 'cat-6',
    categoryName: 'Góc Thực Phẩm',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    unit: 'Hộp 1 Lít',
    stock: 120,
    rating: 4.9,
    soldCount: 1420,
    description: 'Sữa tươi tiệt trùng Vinamilk 100% được làm từ 100% sữa bò tươi nguyên chất giàu dưỡng chất, vitamin A, D3 và canxi giúp xương chắc khỏe.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-2',
    name: 'Nước Mắm Nam Ngư Đệ Nhị Chai 900ml',
    slug: 'nuoc-mam-nam-ngu-de-nhi-chai-900ml',
    price: 32000,
    originalPrice: 38000,
    discountPercent: 15,
    categoryId: 'cat-5',
    categoryName: 'Góc Nấu Ăn',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    unit: 'Chai 900ml',
    stock: 130,
    rating: 4.8,
    soldCount: 1750,
    description: 'Nước mắm Nam Ngư hương vị đậm đà chuẩn vị cơm nhà, sản xuất theo công nghệ hiện đại an toàn vệ sinh thực phẩm.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-3',
    name: 'Nước Giặt OMO Matic Cửa Trên 3.6kg',
    slug: 'nuoc-giat-omo-matic-cua-tren-3-6kg',
    price: 175000,
    originalPrice: 199000,
    discountPercent: 12,
    categoryId: 'cat-7',
    categoryName: 'Góc Sạch Đẹp',
    image: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=400&auto=format&fit=crop&q=80',
    unit: 'Túi 3.6 kg',
    stock: 60,
    rating: 4.9,
    soldCount: 1100,
    description: 'Nước giặt OMO Matic công thức xoáy bay vết bẩn cứng đầu chỉ trong 1 lần giặt, giữ quần áo bền màu thơm mát.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: true,
  },
  {
    id: 'prod-4',
    name: 'Dầu Ăn Đậu Nành Tường An Simply 1L',
    slug: 'dau-an-dau-nanh-tuong-an-simply-1l',
    price: 54000,
    originalPrice: 62000,
    discountPercent: 12,
    categoryId: 'cat-5',
    categoryName: 'Góc Nấu Ăn',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    unit: 'Chai 1 Lít',
    stock: 80,
    rating: 4.9,
    soldCount: 2310,
    description: 'Dầu ăn Simply 100% nguyên chất từ đậu nành, chứa Omega 3, 6, 9 tốt cho tim mạch.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: true,
  },
  {
    id: 'prod-5',
    name: 'Bánh Quy Chocopie Orion Hộp 12 Cái',
    slug: 'banh-quy-chocopie-orion-hop-12-cai',
    price: 52000,
    originalPrice: 58000,
    discountPercent: 10,
    categoryId: 'cat-6',
    categoryName: 'Góc Thực Phẩm',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    unit: 'Hộp 360g',
    stock: 150,
    rating: 4.9,
    soldCount: 3200,
    description: 'Bánh ChocoPie nhân dẻo marshmallow mềm mại phủ sô-cô-la thơm ngon.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-6',
    name: 'Cà Phê G7 3in1 Trung Nguyên Hộp 18 Gói',
    slug: 'ca-phe-g7-3in1-trung-nguyen-hop-18-goi',
    price: 58000,
    originalPrice: 65000,
    discountPercent: 10,
    categoryId: 'cat-6',
    categoryName: 'Góc Thực Phẩm',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    unit: 'Hộp 18 gói x 16g',
    stock: 110,
    rating: 4.9,
    soldCount: 2890,
    description: 'Cà phê G7 3in1 mang hương vị đậm đà đặc trưng, sảng khoái năng lượng cho ngày mới.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: true,
  },
  {
    id: 'prod-7',
    name: 'Mì Hảo Hảo Tôm Chua Cay Gói 75g',
    slug: 'mi-hao-hao-tom-chua-cay-goi-75g',
    price: 4500,
    originalPrice: 5500,
    discountPercent: 18,
    categoryId: 'cat-6',
    categoryName: 'Góc Thực Phẩm',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop&q=80',
    unit: 'Gói 75g',
    stock: 500,
    rating: 4.7,
    soldCount: 8950,
    description: 'Mì Hảo Hảo tôm chua cay - vị quen thuộc đậm đà, mì dai giòn sợi vàng.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-8',
    name: 'Đặc Sản Muối Tôm Tây Ninh Hũ 200g',
    slug: 'dac-san-muoi-tom-tay-ninh-hu-200g',
    price: 35000,
    originalPrice: 45000,
    discountPercent: 22,
    categoryId: 'cat-1',
    categoryName: 'Góc Quê Nhà',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    unit: 'Hũ 200g',
    stock: 85,
    rating: 4.8,
    soldCount: 630,
    description: 'Muối tôm Tây Ninh chính gốc, thơm cay đậm đà, ăn với trái cây cực ngon.',
    origin: 'Tây Ninh, Việt Nam',
    isFlashSale: true,
    isPopular: false,
  },
  {
    id: 'prod-9',
    name: 'Tã Bỉm Dán Bobby Siêu Thấm Size M 76 Miếng',
    slug: 'ta-bim-dan-bobby-sieu-tham-size-m',
    price: 289000,
    originalPrice: 339000,
    discountPercent: 15,
    categoryId: 'cat-3',
    categoryName: 'Góc Mẹ Và Bé',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
    unit: 'Gói 76 miếng',
    stock: 40,
    rating: 4.9,
    soldCount: 520,
    description: 'Tã bỉm Bobby siêu thấm hút, mềm mại, thoáng khí cho bé yêu.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-10',
    name: 'Dầu Gội Clear Men Deep Cleanse 650g',
    slug: 'dau-goi-clear-men-deep-cleanse-650g',
    price: 125000,
    originalPrice: 149000,
    discountPercent: 16,
    categoryId: 'cat-4',
    categoryName: 'Góc Phái Đẹp',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&auto=format&fit=crop&q=80',
    unit: 'Chai 650g',
    stock: 75,
    rating: 4.8,
    soldCount: 990,
    description: 'Dầu gội Clear Men làm sạch sâu, loại bỏ gàu tận gốc, mát lạnh suốt ngày.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: true,
  },
  {
    id: 'prod-11',
    name: 'Gạo ST25 Sóc Trăng Túi 5kg',
    slug: 'gao-st25-soc-trang-tui-5kg',
    price: 135000,
    originalPrice: 155000,
    discountPercent: 13,
    categoryId: 'cat-5',
    categoryName: 'Góc Nấu Ăn',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    unit: 'Túi 5 kg',
    stock: 200,
    rating: 4.9,
    soldCount: 4200,
    description: 'Gạo ST25 đạt giải gạo ngon nhất thế giới, hạt dài thơm dẻo.',
    origin: 'Sóc Trăng, Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-12',
    name: 'Kem Đánh Răng P/S Bảo Vệ 123 Trà Xanh 240g',
    slug: 'kem-danh-rang-ps-bao-ve-123-tra-xanh-240g',
    price: 32000,
    originalPrice: 38000,
    discountPercent: 15,
    categoryId: 'cat-7',
    categoryName: 'Góc Sạch Đẹp',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&auto=format&fit=crop&q=80',
    unit: 'Tuýp 240g',
    stock: 180,
    rating: 4.7,
    soldCount: 3100,
    description: 'Kem đánh răng P/S bảo vệ 123 với chiết xuất trà xanh thiên nhiên giúp răng chắc khỏe, hơi thở thơm mát.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: false,
  },
  {
    id: 'prod-13',
    name: 'Nước Ngọt Coca Cola Lon 330ml (Lốc 6)',
    slug: 'nuoc-ngot-coca-cola-lon-330ml-loc-6',
    price: 62000,
    originalPrice: 72000,
    discountPercent: 14,
    categoryId: 'cat-6',
    categoryName: 'Góc Thực Phẩm',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format&fit=crop&q=80',
    unit: 'Lốc 6 lon x 330ml',
    stock: 95,
    rating: 4.8,
    soldCount: 2450,
    description: 'Coca-Cola vị ngọt tươi mát sảng khoái, tiện lợi cho cả gia đình.',
    origin: 'Việt Nam',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-14',
    name: 'Giấy Vệ Sinh Pulppy Gói 12 Cuộn',
    slug: 'giay-ve-sinh-pulppy-goi-12-cuon',
    price: 68000,
    originalPrice: 79000,
    discountPercent: 14,
    categoryId: 'cat-7',
    categoryName: 'Góc Sạch Đẹp',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    unit: 'Gói 12 cuộn',
    stock: 120,
    rating: 4.6,
    soldCount: 1800,
    description: 'Giấy vệ sinh Pulppy mềm mịn, 3 lớp, tan nhanh trong nước.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: false,
  },
  {
    id: 'prod-15',
    name: 'Sữa Bột Ensure Gold 850g',
    slug: 'sua-bot-ensure-gold-850g',
    price: 620000,
    originalPrice: 690000,
    discountPercent: 10,
    categoryId: 'cat-2',
    categoryName: 'Góc Cao Tuổi',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    unit: 'Hộp 850g',
    stock: 30,
    rating: 4.9,
    soldCount: 780,
    description: 'Sữa Ensure Gold dinh dưỡng hoàn chỉnh với hệ dưỡng chất HMB giúp phục hồi và duy trì sức khỏe.',
    origin: 'Singapore',
    isFlashSale: true,
    isPopular: true,
  },
  {
    id: 'prod-16',
    name: 'Sách Giáo Khoa Toán Lớp 1 (Bộ mới)',
    slug: 'sach-giao-khoa-toan-lop-1-bo-moi',
    price: 28000,
    originalPrice: 32000,
    discountPercent: 12,
    categoryId: 'cat-8',
    categoryName: 'Góc Học Tập',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    unit: 'Cuốn',
    stock: 200,
    rating: 4.5,
    soldCount: 450,
    description: 'Sách giáo khoa Toán lớp 1 theo chương trình mới nhất của Bộ Giáo dục & Đào tạo.',
    origin: 'Việt Nam',
    isFlashSale: false,
    isPopular: false,
  },
];

// ===========================================
// Mock Repository Implementation
// ===========================================
export class MockProductRepository implements IProductRepository {
  async getProducts(query?: GetProductsQuery): Promise<PagedProductsResult> {
    let filtered = [...MOCK_PRODUCTS];

    if (query?.searchQuery) {
      const sanitized = Sanitizer.sanitizeQuery(query.searchQuery).toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(sanitized) ||
        p.description.toLowerCase().includes(sanitized) ||
        p.categoryName.toLowerCase().includes(sanitized)
      );
    }

    if (query?.categoryId) {
      filtered = filtered.filter(p => p.categoryId === query.categoryId);
    }

    if (query?.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (query?.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (query?.sortBy === 'discount') {
      filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else {
      filtered.sort((a, b) => b.soldCount - a.soldCount);
    }

    const page = query?.page || 1;
    const pageSize = query?.pageSize || 12;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      totalCount,
      page,
      totalPages: totalPages || 1,
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }

  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    return MOCK_PRODUCTS.filter(p => p.isFlashSale);
  }

  async getPopularProducts(): Promise<Product[]> {
    return MOCK_PRODUCTS.filter(p => p.isPopular);
  }

  async getSubcategoriesByParent(parentId: string): Promise<SubCategory[]> {
    return MOCK_SUBCATEGORIES.filter(s => s.parentId === parentId);
  }
}
