// prisma/seed.ts – Bilingual Seed Data for Mộc Salon (Vietnamese & English)
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Mộc Salon bilingual database...");

  // ── 1. Admin User ──────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mocsalon.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Quản Trị Viên | Salon Manager",
    },
    create: {
      email: adminEmail,
      password: hashSync(adminPassword, 12),
      name: "Quản Trị Viên | Salon Manager",
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${adminEmail} / ${adminPassword}`);

  // ── 2. Languages ──────────────────────────
  const languages = [
    { code: "vi", name: "Tiếng Việt", isDefault: true, isActive: true },
    { code: "en", name: "English", isDefault: false, isActive: true },
  ];
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: { name: lang.name, isDefault: lang.isDefault, isActive: lang.isActive },
      create: lang,
    });
  }
  console.log("✅ Languages: Vietnamese (default) & English configured");

  // ── 3. Categories ─────────────────────────
  const categories = [
    {
      id: "manicure",
      label: "Chăm Sóc Móng Tay | Manicure Care",
      slug: "manicure",
      description: "Cắt da định hình, massage tay thảo mộc và sơn gel cao cấp | Cuticle grooming, nail shaping, botanical hand massage & luxury gel polish",
      order: 0,
    },
    {
      id: "pedicure",
      label: "Chăm Sóc Móng Chân & Spa | Pedicure & Foot Spa",
      slug: "pedicure",
      description: "Ngâm chân thảo dược ấm, tẩy da chết gót hồng và massage bấm huyệt | Warm herbal foot bath, heel smoothing peel & acupressure reflexology",
      order: 1,
    },
    {
      id: "nail-art",
      label: "Nghệ Thuật Vẽ Móng | Nail Art Design",
      slug: "nail-art",
      description: "Thiết kế móng nghệ thuật vẽ tay độc bản phong cách Nhật – Hàn | Bespoke hand-painted nail art inspired by Japanese & Korean aesthetics",
      order: 2,
    },
    {
      id: "extensions",
      label: "Nối Móng & Đắp Bột | Nail Extensions & Tips",
      slug: "extensions",
      description: "Nối móng úp gel mềm nhẹ êm và đắp bột tạo form thanh thoát | Soft gel tips, sculpted acrylics & overlay extensions for slender nails",
      order: 3,
    },
    {
      id: "care",
      label: "Phục Hồi & Dưỡng Chuyên Sâu | Nail Repair & Treatment",
      slug: "nail-care",
      description: "Liệu pháp phục hồi móng giòn yếu, ủ sáp paraffin tái tạo da | Intensive keratin recovery, warm paraffin hydration & restorative therapy",
      order: 4,
    },
    {
      id: "kinh-nghiem",
      label: "Kinh Nghiệm & Bí Quyết | Tips & Expertise",
      slug: "kinh-nghiem",
      description: "Bí quyết chăm sóc và giữ gìn móng khỏe đẹp từ chuyên gia | Expert tips for maintaining healthy and beautiful nails",
      order: 5,
    },
    {
      id: "tin-tuc",
      label: "Tin Tức & Salon | News & Salon",
      slug: "tin-tuc",
      description: "Cập nhật những hoạt động và thông báo mới nhất từ Mộc Salon | Latest salon news and announcements",
      order: 6,
    },
    {
      id: "xu-huong",
      label: "Xu Hướng Nail Art | Nail Trends",
      slug: "xu-huong",
      description: "Cập nhật những xu hướng và phong cách nail thời thượng nhất | Latest nail art trends and styles",
      order: 7,
    },
    {
      id: "cham-soc",
      label: "Chăm Sóc & Dưỡng Móng | Nail Care",
      slug: "cham-soc",
      description: "Liệu trình và bí quyết dưỡng móng khỏe đẹp toàn diện | Comprehensive nail care and wellness guides",
      order: 8,
    },
    {
      id: "uu-dai",
      label: "Ưu Đãi Đặc Quyền | Special Offers",
      slug: "uu-dai",
      description: "Chương trình tri ân, voucher và đặc quyền cho khách hàng thân thiết | Exclusive rewards and seasonal promotions",
      order: 9,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { label: cat.label, slug: cat.slug, description: cat.description, order: cat.order },
      create: cat,
    });
  }
  console.log(`✅ Categories: ${categories.length} bilingual categories seeded`);

  // ── 4. Services ────────────────────────────
  const services = [
    {
      slug: "classic-manicure",
      name: "Chăm Sóc Móng Cổ Điển | Classic Manicure",
      categoryId: "manicure",
      description: "Cắt da định hình móng, massage tay tinh dầu thư giãn và sơn phủ dưỡng bảo vệ móng tự nhiên. | Essential manicure with cuticle care, nail shaping, relaxing essential oil massage & restorative base coat.",
      duration: 45,
      price: "250.000 VNĐ | $10",
      promoPrice: null,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      order: 0,
    },
    {
      slug: "gel-manicure",
      name: "Sơn Gel Cao Cấp Chuẩn Hàn | Korean Premium Gel Manicure",
      categoryId: "manicure",
      description: "Sơn gel nhập khẩu chính hãng không chì, độ bóng gương hoàn hảo, bền màu từ 3 đến 4 tuần không bong tróc. | Authentic lead-free Korean gel polish with mirror gloss, guaranteed chip-free durability for 3-4 weeks.",
      duration: 60,
      price: "380.000 VNĐ | $16",
      promoPrice: "320.000 VNĐ | $14",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800",
      order: 1,
    },
    {
      slug: "luxury-pedicure",
      name: "Spa Chân Thảo Mộc Sang Trọng | Luxury Herbal Pedicure Spa",
      categoryId: "pedicure",
      description: "Ngâm chân muối khoáng thảo dược ấm, tẩy da chết gót hồng, đắp mặt nạ ủ dưỡng và massage thư giãn bấm huyệt. | Warm herbal foot bath, heel smoothing peel, hydrating botanical mask & soothing acupressure reflexology.",
      duration: 75,
      price: "480.000 VNĐ | $20",
      promoPrice: "420.000 VNĐ | $18",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      order: 2,
    },
    {
      slug: "nail-art-design",
      name: "Thiết Kế Móng Nghệ Thuật Độc Bản | Bespoke Nail Art Design",
      categoryId: "nail-art",
      description: "Vẽ họa tiết thủ công tỉ mỉ theo yêu cầu: vân đá cẩm thạch huyền bí, tráng gương ngọc trai, hoa nổi 3D tinh xảo. | Custom hand-crafted designs: ethereal marble veins, chrome mirror glaze, and delicate 3D floral accents.",
      duration: 90,
      price: "550.000 VNĐ | $23",
      promoPrice: null,
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800",
      order: 3,
    },
    {
      slug: "acrylic-extensions",
      name: "Đắp Móng Bột Tạo Dáng Thanh Thoát | Sculpted Acrylic Extensions",
      categoryId: "extensions",
      description: "Kỹ thuật đắp bột form móng chuẩn tỷ lệ vàng, tạo cảm giác ngón tay thon dài tự nhiên, chắc chắn và bền đẹp. | Golden-ratio sculpted acrylics crafting elongated, naturally tapered fingers with lasting strength.",
      duration: 110,
      price: "650.000 VNĐ | $27",
      promoPrice: "590.000 VNĐ | $25",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      order: 4,
    },
    {
      slug: "gel-extensions",
      name: "Nối Móng Úp Gel Nhẹ Êm | Soft Gel Extension Tips",
      categoryId: "extensions",
      description: "Móng úp gel mềm thế hệ mới, mỏng nhẹ ôm sát móng thật, không cộm, không đau và bảo vệ móng tối đa. | Next-gen soft gel tips, ultra-lightweight and flush with natural nail beds for painless comfort.",
      duration: 90,
      price: "590.000 VNĐ | $25",
      promoPrice: null,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800",
      order: 5,
    },
    {
      slug: "nail-repair",
      name: "Phục Hồi Móng Hư Tổn Keratin | Intensive Keratin Nail Recovery",
      categoryId: "care",
      description: "Liệu pháp chuyên sâu dành cho móng mỏng yếu, nứt gãy sau nhiều lần hóa chất, tái tạo cấu trúc móng khỏe mạnh. | Deep intensive therapy replenishing structural keratin for brittle, thinned, or damaged natural nails.",
      duration: 35,
      price: "220.000 VNĐ | $9",
      promoPrice: null,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      order: 6,
    },
    {
      slug: "paraffin-treatment",
      name: "Ủ Sáp Paraffin Trẻ Hóa Da Tay | Warm Paraffin Hand Rejuvenation",
      categoryId: "care",
      description: "Ủ sáp paraffin đào ấm áp giàu collagen, cấp ẩm tầng sâu, làm mềm mịn và xóa mờ các nếp nhăn mu bàn tay. | Warm peach paraffin wax infusion with collagen, deeply hydrating and smoothing hand wrinkles.",
      duration: 30,
      price: "260.000 VNĐ | $11",
      promoPrice: null,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      order: 7,
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        name: svc.name,
        categoryId: svc.categoryId,
        description: svc.description,
        duration: svc.duration,
        price: svc.price,
        promoPrice: svc.promoPrice,
        image: svc.image,
        order: svc.order,
      },
      create: { ...svc, gallery: "[]", isActive: true },
    });
  }
  console.log(`✅ Services: ${services.length} bilingual services seeded`);

  // ── 5. Price Lists ─────────────────────────
  const priceLists = [
    {
      category: "Chăm Sóc Móng Tay | Manicure",
      items: [
        { name: "Cắt Da & Định Hình Form Móng | Cuticle Grooming & Shaping", duration: "25 phút | 25 mins", price: "150.000 VNĐ | $6" },
        { name: "Sơn Móng Cổ Điển Dưỡng OPI | Classic Polish (OPI)", duration: "35 phút | 35 mins", price: "190.000 VNĐ | $8" },
        { name: "Sơn Gel Hàn Quốc Bền Màu | Korean High-Gloss Gel Polish", duration: "50 phút | 50 mins", price: "320.000 VNĐ | $14" },
        { name: "Sơn Gel Mắt Mèo Kim Cương | Diamond Cat-Eye Gel", duration: "60 phút | 60 mins", price: "390.000 VNĐ | $16" },
        { name: "Tháo Gel & Phủ Dưỡng Bảo Vệ | Gel Removal & Protective Coat", duration: "25 phút | 25 mins", price: "90.000 VNĐ | $4" },
      ],
    },
    {
      category: "Chăm Sóc Móng Chân | Pedicure",
      items: [
        { name: "Chăm Sóc Móng Chân Tiêu Chuẩn | Express Pedicure", duration: "30 phút | 30 mins", price: "220.000 VNĐ | $9" },
        { name: "Chà Gót Hồng & Tẩy Da Chết Muối Biển | Sea Salt Heel Callus Smoothing", duration: "45 phút | 45 mins", price: "320.000 VNĐ | $13" },
        { name: "Pedicure Spa Thảo Dược Trị Liệu | Herbal Wellness Pedicure Spa", duration: "75 phút | 75 mins", price: "480.000 VNĐ | $20" },
        { name: "Sơn Gel Chân Chống Trầy Xước | Long-Wear Gel Pedicure", duration: "60 phút | 60 mins", price: "380.000 VNĐ | $16" },
      ],
    },
    {
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      items: [
        { name: "Vẽ Họa Tiết Đơn Giản (Mỗi Ngón) | Minimalist Line Art (per nail)", duration: "10 phút | 10 mins", price: "30.000 VNĐ | $1.5" },
        { name: "Vẽ Vân Đá Cẩm Thạch / Ombre (Full Bộ) | Marble Veins / Gradient Ombré (Full Set)", duration: "60 phút | 60 mins", price: "350.000 VNĐ | $15" },
        { name: "Đính Pha Lê Swarovski & Phụ Kiện | Swarovski Crystal Embellishments", duration: "30 phút | 30 mins", price: "150.000 VNĐ | $6" },
        { name: "Thiết Kế Móng Nghệ Thuật Custom | Custom Haute Nail Art Design", duration: "90 phút | 90 mins", price: "550.000 VNĐ | $23" },
      ],
    },
    {
      category: "Nối Móng & Đắp Bột | Extensions",
      items: [
        { name: "Nối Móng Úp Tip Gel Hàn Quốc | Korean Soft Gel Extensions", duration: "75 phút | 75 mins", price: "490.000 VNĐ | $21" },
        { name: "Đắp Móng Bột Tự Nhiên / Ombre | Sculpted Acrylic / French Ombré", duration: "100 phút | 100 mins", price: "650.000 VNĐ | $27" },
        { name: "Dặm Chân Móng (Refill) | Refill Infill Service", duration: "60 phút | 60 mins", price: "350.000 VNĐ | $15" },
        { name: "Tháo Móng Nối & Dưỡng Keratin | Extension Removal & Keratin Care", duration: "35 phút | 35 mins", price: "150.000 VNĐ | $6" },
      ],
    },
    {
      category: "Dưỡng & Phục Hồi | Nail Care",
      items: [
        { name: "Ủ Nóng Paraffin Phục Hồi Da Tay | Warm Paraffin Hand Hydration", duration: "30 phút | 30 mins", price: "260.000 VNĐ | $11" },
        { name: "Liệu Trình Phục Hồi Móng Yếu IBX | IBX Repair & Strengthen Treatment", duration: "40 phút | 40 mins", price: "320.000 VNĐ | $14" },
        { name: "Massage Thư Giãn Tay Bấm Huyệt | Acupressure Hand Massage", duration: "20 phút | 20 mins", price: "180.000 VNĐ | $8" },
      ],
    },
  ];

  for (const [i, pl] of priceLists.entries()) {
    await prisma.priceList.upsert({
      where: { category: pl.category },
      update: { items: JSON.stringify(pl.items), order: i },
      create: { category: pl.category, items: JSON.stringify(pl.items), order: i },
    });
  }
  console.log(`✅ Price Lists: ${priceLists.length} bilingual categories seeded`);

  // ── 6. Team Members ────────────────────────
  const teamMembers = [
    {
      name: "Linh Trần (Master Linh)",
      role: "Nghệ Nhân Móng Trưởng & Đồng Sáng Lập | Head Nail Artist & Co-Founder",
      bio: "Hơn 8 năm tâm huyết với nghệ thuật móng, theo đuổi trường phái tối giản tinh tế và phong cách thanh lịch hiện đại. | Over 8 years mastering nail artistry, embracing mindful minimalism and timeless modern elegance.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600",
      order: 0,
      isActive: true,
    },
    {
      name: "Mai Anh (Senior Stylist)",
      role: "Chuyên Viên Vẽ Nghệ Thuật | Senior Nail Art Specialist",
      bio: "Từng nét cọ là một câu chuyện cảm xúc, mang đến cho bạn bộ móng độc bản và cuốn hút nhất. | Every brush stroke tells a story, giving each guest a truly bespoke and captivating set.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      order: 1,
      isActive: true,
    },
    {
      name: "Thu Trang (Spa & Care Expert)",
      role: "Chuyên Gia Spa & Trị Liệu Móng | Foot Spa & Nail Care Therapist",
      bio: "Chăm sóc đôi bàn tay và gót hồng với trọn vẹn sự nhẹ nhàng, tỉ mỉ và thư thái chuẩn spa. | Caring for your hands and feet with gentle precision, warm botanicals, and deep spa serenity.",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600",
      order: 2,
      isActive: true,
    },
  ];

  await prisma.teamMember.deleteMany({});
  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`✅ Team Members: ${teamMembers.length} bilingual artists seeded`);

  // ── 7. Gallery Items ───────────────────────
  const galleryItems = [
    {
      title: "Vân Đá Cẩm Thạch Thạch Anh | Rose Quartz & Marble Veins",
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
      order: 0,
    },
    {
      title: "Sơn Gel Mắt Mèo Ánh Trăng | Moonlight Cat-Eye Gel",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
      order: 1,
    },
    {
      title: "Pháp Cổ Điển Hiện Đại | Modern Minimalist French",
      category: "Chăm Sóc Móng Tay | Manicure",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
      order: 2,
    },
    {
      title: "Nail Art Đính Pha Lê Lấp Lánh | Sparkling Crystal Embellishments",
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
      order: 3,
    },
    {
      title: "Nối Móng Gel Dáng Hạnh Nhân | Almond Soft Gel Extensions",
      category: "Nối Móng & Đắp Bột | Extensions",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      order: 4,
    },
    {
      title: "Ombre Tráng Gương Ngọc Trai | Glazed Pearl Chrome Ombré",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      order: 5,
    },
    {
      title: "Chăm Sóc & Massage Gót Hồng Spa | Relaxing Foot Spa & Pedicure",
      category: "Chăm Sóc Móng Chân | Pedicure",
      image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80",
      order: 6,
    },
    {
      title: "Bộ Sưu Tập Nude Thanh Lịch | Timeless Nude Palette",
      category: "Chăm Sóc Móng Tay | Manicure",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
      order: 7,
    },
    {
      title: "Gel Thạch Ánh Nhũ Kim Tuyến | Shimmer Jelly Gel Art",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80",
      order: 8,
    },
    {
      title: "Họa Tiết Hoa Cúc Thảo Mộc | Botanical Floral Nail Art",
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
      order: 9,
    },
    {
      title: "Đắp Bột Ombre Nhẹ Nhàng | Soft Powder Ombre Sculpt",
      category: "Nối Móng & Đắp Bột | Extensions",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80",
      order: 10,
    },
    {
      title: "Liệu Trình Ngâm Chân Cánh Hoa Thảo Dược | Herbal Floral Foot Soak",
      category: "Chăm Sóc Móng Chân | Pedicure",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      order: 11,
    },
    {
      title: "Sơn Móng Nghệ Thuật Pastel Nhật Bản | Japanese Pastel Craft",
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      image: "https://images.unsplash.com/photo-1600091166971-7f9faad6a1ce?auto=format&fit=crop&w=1200&q=80",
      order: 12,
    },
    {
      title: "Tạo Dáng Móng Thang & Tráng Gương | Coffin Shape Mirror Chrome",
      category: "Nối Móng & Đắp Bột | Extensions",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      order: 13,
    },
    {
      title: "Mẫu Móng Thiết Kế Độc Bản Mộc Salon | Signature Mộc Bespoke Nails",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg",
      order: 14,
    },
    {
      title: "Trị Liệu Dưỡng Ẩm Chuyên Sâu Cắt Da Spa | Deep Hydrating Spa Pedicure",
      category: "Chăm Sóc Móng Chân | Pedicure",
      image: "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg",
      order: 15,
    },
  ];

  await prisma.galleryItem.deleteMany({});
  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: { ...item, isActive: true } });
  }
  console.log(`✅ Gallery Items: ${galleryItems.length} bilingual items seeded`);

  // ── 8. Blog Posts ──────────────────────────
  const posts = [
    {
      title: "Top 5 Xu Hướng Móng Nghệ Thuật Được Yêu Thích Nhất 2025 | Top 5 Trending Nail Art Styles for 2025",
      slug: "xu-huong-mong-nghe-thuat-2025",
      excerpt: "Khám phá những phong cách nail art dẫn đầu xu hướng năm 2025: từ tráng gương ngọc trai thanh lịch đến vân đá cẩm thạch huyền bí. | Explore the leading nail art trends of 2025: from understated glazed chrome to ethereal marble textures.",
      content: "<h2>1. Tráng Gương Ngọc Trai (Glazed Chrome Nails)</h2><p>Lấy cảm hứng từ ánh sáng dịu dàng của xà cừ và ngọc trai thiên nhiên, phong cách móng tráng gương đem lại cảm giác sang trọng, thanh khiết và cực kỳ tôn da.</p><h2>2. Vân Đá Cẩm Thạch Huyền Bí (Ethereal Marble Veins)</h2><p>Từng đường vân đá uyển chuyển kết hợp cùng nhũ vàng ánh kim tạo nên vẻ đẹp độc bản cho từng đầu ngón tay.</p><h2>3. Phong Cách Pháp Hiện Đại (Modern Micro French)</h2><p>Đường viền đầu móng siêu mảnh với tone màu pastel hoặc vàng kim loại mang lại nét thanh lịch, phù hợp cho cả nơi công sở lẫn tiệc tối.</p><h2>4. Móng Mắt Mèo Ánh Kim (Magnetic Cat-Eye Velvet)</h2><p>Hiệu ứng hạt từ tính chuyển động dưới góc nhìn đa chiều mang đến chiều sâu huyền ảo tựa dải ngân hà.</p><h2>5. Đính Pha Lê Tối Giản (Minimalist Crystal Accents)</h2><p>Không quá cầu kỳ nhưng vừa đủ để thu hút mọi ánh nhìn với các viên pha lê Swarovski lấp lánh nhẹ nhàng.</p><!-- bilingual-split --><h2>1. Glazed Chrome Nails</h2><p>Inspired by the gentle glow of natural mother-of-pearl, glazed chrome nails radiate effortless sophistication, luminous clarity, and universal skin-tone enhancement.</p><h2>2. Ethereal Marble Veins</h2><p>Fluid, organic mineral swirls accented with subtle liquid-gold flakes create a one-of-a-kind bespoke masterpiece on every fingertip.</p><h2>3. Modern Micro French</h2><p>An ultra-fine tip line rendered in soft pastels or metallic champagne offers modern poise, effortlessly transitioning from daytime boardroom to evening soiree.</p><h2>4. Magnetic Cat-Eye Velvet</h2><p>Multidimensional magnetic particles shift dynamically with every hand gesture, capturing ambient light to create a velvety, celestial depth.</p><h2>5. Minimalist Crystal Accents</h2><p>Delicate Swarovski crystals placed with intentional restraint bring subtle brilliance to every gesture without overwhelming the natural hand silhouette.</p>",
      categoryId: "xu-huong",
      thumbnail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Bí Quyết Chăm Sóc Móng Chắc Khỏe Sau Khi Sơn Gel | Expert Guide to Keeping Nails Healthy After Gel Polish",
      slug: "bi-quyet-cham-soc-mong-chac-khoe-sau-son-gel",
      excerpt: "Những lời khuyên từ chuyên gia Mộc Salon giúp bạn bảo vệ màng sừng keratin và duy trì bộ móng chắc khỏe, sáng hồng. | Expert tips from Mộc Salon specialists on protecting natural keratin and maintaining strong, healthy nails.",
      content: "<h2>Tại Sao Móng Cần Được Nuôi Dưỡng?</h2><p>Dù sơn gel mang lại vẻ đẹp bền lâu, móng tay tự nhiên vẫn cần độ ẩm và dưỡng chất để không bị giòn gãy.</p><h2>Các Thói Quen Quan Trọng:</h2><ul><li>Thoa dầu dưỡng viền móng (Cuticle Oil) mỗi ngày trước khi đi ngủ.</li><li>Không tự ý bóc hoặc cạy lớp sơn gel khi móng bắt đầu dài ra.</li><li>Sử dụng găng tay khi tiếp xúc với hóa chất tẩy rửa gia dụng.</li><li>Uống đủ nước và bổ sung Biotin, Vitamin E trong chế độ ăn.</li></ul><!-- bilingual-split --><h2>Why Natural Nails Need Daily Nourishment</h2><p>While gel polish provides durable beauty, your natural nail bed requires continuous hydration and nutrients to prevent brittle splitting.</p><h2>Essential Home Care Habits:</h2><ul><li>Apply nourishing cuticle oil every night before resting.</li><li>Never peel or pick gel polish away as it removes protective dorsal layers.</li><li>Wear protective gloves when handling household detergents.</li><li>Stay hydrated and incorporate Biotin and Vitamin E into your diet.</li></ul>",
      categoryId: "cham-soc",
      thumbnail: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Quy Trình Tiệt Trùng Y Tế Chuẩn 5 Sao Tại Mộc Salon | 5-Star Medical-Grade Sterilization at Mộc Salon",
      slug: "quy-trinh-tiet-trung-y-te-moc-salon",
      excerpt: "Sự an toàn và an tâm tuyệt đối của khách hàng là ưu tiên hàng đầu trong mọi dịch vụ tại Mộc Salon. | Your health, hygiene, and complete peace of mind are the cornerstone of every treatment at Mộc Salon.",
      content: "<h2>Cam Kết An Toàn Tuyệt Đối</h2><p>Tại Mộc Salon, mỗi khách hàng đều xứng đáng được chăm sóc trong điều kiện vệ sinh vô trùng nghiêm ngặt nhất.</p><h2>Quy Trình 4 Bước Chuẩn Y Khoa:</h2><ul><li><strong>Bước 1:</strong> Ngâm rửa và làm sạch cặn bẩn bằng dung dịch sát khuẩn chuyên dụng.</li><li><strong>Bước 2:</strong> Rửa sóng siêu âm làm sạch sâu từng khớp nối kìm và dụng cụ.</li><li><strong>Bước 3:</strong> Đóng túi tiệt trùng có chỉ thị màu kiểm soát nhiệt độ.</li><li><strong>Bước 4:</strong> Khử khuẩn bằng nồi hấp áp suất cao chuẩn autoclave và bảo quản trong tủ cực tím UV.</li></ul><!-- bilingual-split --><h2>Our Commitment to Absolute Hygiene</h2><p>At Mộc Salon, we believe that true luxury begins with spotless medical-grade hygiene and unconditional client safety.</p><h2>Our 4-Step Clinical Protocol:</h2><ul><li><strong>Step 1:</strong> Ultrasonic wash and pre-cleaning in medical disinfectant solution.</li><li><strong>Step 2:</strong> High-frequency ultrasonic cavitation targeting precision instrument joints.</li><li><strong>Step 3:</strong> Sealed biological indicator pouches with heat-sensitive validation markers.</li><li><strong>Step 4:</strong> High-pressure medical autoclave steam sterilization and UV cabinet storage.</li></ul>",
      categoryId: "tin-tuc",
      thumbnail: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Bí Quyết Chọn Dáng Móng Tôn Dáng Bàn Tay Thon Dài | How to Choose the Perfect Nail Shape for Your Hands",
      slug: "cach-chon-dang-mong-phu-hop-voi-ban-tay",
      excerpt: "Dáng tròn, vuông, oval, hạnh nhân hay dáng thang? Khám phá cách chọn dáng móng chuẩn xác để tôn lên nét thon gọn tự nhiên của bàn tay bạn. | Almond, oval, square, or coffin? Discover how to find the most flattering nail shape to elongate and enhance your natural hand silhouette.",
      content: "<h2>Dáng Móng Có Quyết Định Đến Vẻ Đẹp Của Bàn Tay?</h2><p>Cũng như kiểu tóc tôn lên đường nét khuôn mặt, một phom móng phù hợp có thể tạo hiệu ứng thị giác giúp ngón tay trông thon thả, dài và thanh thoát hơn rõ rệt.</p><h2>Dáng Móng Theo Từng Kiểu Bàn Tay:</h2><ul><li><strong>Ngón tay ngắn, bản móng rộng:</strong> Hợp dáng Oval hoặc Hạnh nhân (Almond) giúp kéo dài ngón tay.</li><li><strong>Ngón tay thon dài:</strong> Dáng Vuông bo góc (Squoval) tạo nét hiện đại, thanh lịch.</li><li><strong>Móng mỏng yếu:</strong> Dáng Tròn tự nhiên hạn chế tối đa gãy mẻ góc.</li><li><strong>Phong cách cá tính:</strong> Dáng Thang (Coffin/Ballerina) thời thượng.</li></ul><!-- bilingual-split --><h2>The Impact of Silhouette on Hand Aesthetics</h2><p>Just as a flattering hairstyle frames your facial contour, the right nail architecture visually elongates fingers and balances hand proportions.</p><h2>Recommendations by Hand Profile:</h2><ul><li><strong>Shorter Fingers:</strong> Soft Almond or Oval visually extends hand lines.</li><li><strong>Slender Fingers:</strong> Squoval or crisp square adds poise and structure.</li><li><strong>Delicate Nails:</strong> Natural Round offers superior chip resistance.</li><li><strong>High Fashion:</strong> Coffin or Ballerina provides expansive artistry canvas.</li></ul>",
      categoryId: "kinh-nghiem",
      thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Nghệ Thuật Spa Pedicure: Thư Giãn Đôi Chân Với Thảo Dược Đông Y | The Art of Herbal Foot Spa Pedicure for Total Rejuvenation",
      slug: "nghe-thuat-spa-pedicure-thu-gian-dong-y",
      excerpt: "Liệu trình ngâm chân thảo mộc kết hợp massage bấm huyệt giải tỏa mệt mỏi và nuôi dưỡng làn da gót hồng mịn màng. | A soothing blend of herbal bath soaks, acupressure foot massage, and deep heel hydration for holistic wellness.",
      content: "<h2>Đôi Chân - Nơi Nâng Niu Toàn Bộ Cơ Thể</h2><p>Liệu trình Spa Pedicure tại Mộc Salon không chỉ đơn thuần là làm sạch móng mà là một nghi thức phục hồi năng lượng toàn diện.</p><h2>Quy Trình Chăm Sóc Đẳng Cấp:</h2><ul><li>Bồn ngâm gừng tươi, quế chi, hoa hồng và muối khoáng biển sâu.</li><li>Tẩy tế bào chết đường mía & mật ong nguyên chất.</li><li>Ủ dưỡng chất bơ hạt mỡ phục hồi gót sen mềm mịn.</li><li>Massage bấm huyệt Dũng Tuyền, Thái Xung giải tỏa căng thẳng.</li></ul><!-- bilingual-split --><h2>Honouring the Foundation of Your Body</h2><p>The Signature Spa Pedicure at Mộc Salon transcends routine nail grooming into an indulgent therapeutic sanctuary.</p><h2>Signature Treatment Highlights:</h2><ul><li>Warming herbal infusion of ginger root, cinnamon, and sea salts.</li><li>Organic cane sugar and raw honey smoothing exfoliation.</li><li>Deep heel repair mask enriched with pure shea butter.</li><li>Targeted acupressure reflexology for restorative physical relief.</li></ul>",
      categoryId: "cham-soc",
      thumbnail: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Bí Mật Kỹ Thuật Vẽ Vân Đá Cẩm Thạch & Thạch Anh Hồng | The Art of Handcrafted Marble & Rose Quartz Nail Art",
      slug: "bi-mat-ve-mong-van-da-cam-thach-rose-quartz",
      excerpt: "Tìm hiểu cách các nghệ nhân Mộc Salon tạo nên từng tầng vân đá cẩm thạch sống động, kết hợp lá vàng 24k mang lại phong thủy thịnh vượng. | Discover how Mộc Salon artisans layer translucent pigments and 24k gold leaf to create mesmerizing, gemstone-inspired nail designs.",
      content: "<h2>Nghệ Thuật Mô Phỏng Đá Quý Trên Móng</h2><p>Vân đá cẩm thạch (Marble Nails) và thạch anh hồng (Rose Quartz) luôn giữ vị trí độc tôn bởi vẻ đẹp kiêu sa và ý nghĩa phong thủy tốt lành.</p><h2>Kỹ Thuật Tạo Tầng Đa Chiều Độc Bản:</h2><ul><li>Lớp nền thạch hồng phấn phớt nhẹ tạo độ trong trẻo tự nhiên.</li><li>Cọ nét siêu mảnh tán loang từng đường vân trắng sữa và xám khói bằng cồn loang Nhật Bản.</li><li>Điểm xuyết lá vàng 24K siêu mỏng ở các điểm giao thoa.</li><li>Phủ top gel bóng gương dày dặn tạo khúc xạ ánh sáng lấp lánh.</li></ul><!-- bilingual-split --><h2>Recreating Nature's Gemstones on Fingertips</h2><p>Marble and Rose Quartz nail art maintain an iconic status in haute nail couture due to their ethereal translucent depth and harmonious energy.</p><h2>The Multi-Layer Dimensional Technique:</h2><ul><li>Blush-pink jelly foundation establishes deep glass-like clarity.</li><li>Ultra-fine liner brushes diffuse milky mineral veins using Japanese blending alcohols.</li><li>Wisps of 24K genuine gold leaf accent fracture lines for celestial luminescence.</li><li>Plush high-refraction top gel locks in the design with crystal shine.</li></ul>",
      categoryId: "xu-huong",
      thumbnail: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Sơn Gel Có Làm Hư Tổn Móng? Góc Nhìn Chuyên Gia | Does Gel Polish Damage Nails? Expert Truths & Myth Busting",
      slug: "son-gel-hu-ton-mong-that-hay-hieu-lam",
      excerpt: "Giải đáp những thắc mắc phổ biến về tác động của đèn LED/UV, độ bám dính của gel và cách tháo sơn an toàn bảo vệ móng gốc. | Addressing common misconceptions about UV/LED curing, nail thinning, and safe removal techniques to protect natural nail integrity.",
      content: "<h2>Sự Thật Về Sơn Gel Và Sức Khỏe Móng</h2><p>Nhiều khách hàng lo ngại sơn gel thường xuyên sẽ khiến móng bị mỏng giòn. Tuy nhiên, bản thân sơn gel cao cấp không làm hại móng nếu được thao tác đúng cách.</p><h2>3 Hiểu Lầm Phổ Biến Nhất:</h2><ul><li><strong>Móng có cần thở?</strong> Phiến móng bên ngoài là tế bào sừng chết, được nuôi dưỡng từ ma trận móng bên dưới da.</li><li><strong>Đèn LED có làm đen tay?</strong> Đèn LED bước sóng chuẩn tại Mộc Salon hơ trong 30-60 giây an toàn tuyệt đối.</li><li><strong>Điều gì làm tổn thương móng thật sự?</strong> 90% tổn hại do tự ý cạy bóc sơn gel hoặc mài móng sai cách tại nhà.</li></ul><!-- bilingual-split --><h2>The Scientific Reality of Gel Polish</h2><p>High-quality gel does not cause damage when applied and removed with precision care.</p><h2>3 Common Myths Debunked:</h2><ul><li><strong>Nails Need to Breathe:</strong> The nail plate is dead keratin; all cellular nourishment originates from the vascular matrix underneath.</li><li><strong>LED Curing Lamps Age Skin:</strong> Certified dual-wavelength LED lamps emit negligible radiation during brief 30–60 second cures.</li><li><strong>Causes of Nail Thinning:</strong> Over 90% of trauma stems from forcefully peeling polish off at home rather than gentle professional soaking.</li></ul>",
      categoryId: "kinh-nghiem",
      thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
    {
      title: "Chương Trình Đặc Quyền Hội Viên & Ưu Đãi Tháng Mới | VIP Membership Privileges & Seasonal Exclusive Offers",
      slug: "dac-quyen-khach-hang-than-thiet-moc-salon",
      excerpt: "Trải nghiệm những ưu đãi tích điểm, quà tặng sinh nhật và dịch vụ chăm sóc móng cao cấp dành riêng cho hội viên thân thiết của Mộc Salon. | Exclusive tier privileges, birthday celebrations, and complimentary treatments tailored for cherished members of Mộc Salon.",
      content: "<h2>Tri Ân Khách Hàng Thân Thiết Của Mộc Salon</h2><p>Mộc Salon trân trọng từng khoảnh khắc bạn trao gửi niềm tin làm đẹp. Chương trình Thẻ Hội Viên Đặc Quyền mang đến những ưu đãi bất ngờ suốt cả năm.</p><h2>Các Hạng Thành Viên & Đặc Quyền:</h2><ul><li><strong>Hạng Bạc (Silver Member):</strong> Giảm ngay 10% từ lần ghé thăm thứ hai; tặng massage tay tháng sinh nhật.</li><li><strong>Hạng Vàng (Gold Member):</strong> Giảm 15% tổng hóa đơn, ưu tiên đặt lịch khung giờ vàng cuối tuần.</li><li><strong>Hạng Kim Cương (Diamond VIP):</strong> Giảm 20% trọn đời, miễn phí 100% tháo sơn gel và cắt da định kỳ.</li></ul><!-- bilingual-split --><h2>Celebrating Our Cherished Guests</h2><p>Our Privileged Membership Program presents thoughtful surprises, bespoke perks, and generous savings all year round.</p><h2>Membership Tiers & Exclusive Benefits:</h2><ul><li><strong>Silver Tier:</strong> 10% savings on all services; complimentary revitalizing hand massage during birthday month.</li><li><strong>Gold Tier:</strong> 15% privileges across all bookings with peak weekend priority.</li><li><strong>Diamond VIP Tier:</strong> 20% lifetime savings with complimentary gel soak-off and hygiene manicures on every visit.</li></ul>",
      categoryId: "uu-dai",
      thumbnail: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.categoryId,
        thumbnail: post.thumbnail,
        status: post.status,
      },
      create: post,
    });
  }
  console.log(`✅ Blog Posts: ${posts.length} bilingual beauty articles seeded`);

  // ── 9. Sample Appointment ──────────────────
  await prisma.appointment.deleteMany({ where: { phone: "0988 654 321" } });
  await prisma.appointment.create({
    data: {
      customerName: "Minh Anh (Elena)",
      phone: "0988 654 321",
      email: "minhanh.elena@gmail.com",
      serviceName: "Sơn Gel Cao Cấp Chuẩn Hàn | Korean Premium Gel Manicure",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      note: "Tông màu nude ngọc trai, phối vân đá nhẹ nhàng | Prefer pearlescent nude with subtle marble accents",
      status: "confirmed",
    },
  });
  console.log("✅ Sample appointment created for Minh Anh (Elena)");

  // ── 10. Hero Slides ────────────────────────
  const slides = [
    {
      title: "Mộc Salon – Nghệ Thuật Móng Tinh Tế | Mộc Salon – Refined Nail Artistry",
      subtitle: "Không gian thư giãn nhẹ nhàng, chăm sóc móng cao cấp | Serene ambiance, luxury bespoke nail care",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600",
      order: 0,
      isActive: true,
    },
    {
      title: "Sơn Gel & Nail Art Chuẩn Nhật – Hàn | Japanese & Korean Nail Artistry",
      subtitle: "Độ bóng gương hoàn hảo, bền đẹp dài lâu cùng thời gian | Mirror gloss perfection, lasting beauty and elegance",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1600",
      order: 1,
      isActive: true,
    },
    {
      title: "Spa Chân & Trị Liệu Thảo Mộc | Foot Spa & Botanical Therapy",
      subtitle: "100% dụng cụ tiệt trùng y tế, bảo vệ sức khỏe trọn vẹn | 100% medical-grade sterilization for total peace of mind",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1600",
      order: 2,
      isActive: true,
    },
  ];

  await prisma.slide.deleteMany({});
  for (const slide of slides) {
    await prisma.slide.create({ data: slide });
  }
  console.log(`✅ Hero Slides: ${slides.length} bilingual slides seeded`);

  // ── 11. Settings ───────────────────────────
  const settings: Record<string, string> = {
    siteName: "Mộc Salon",
    tagline: "Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp | Refined Nail Artistry & Luxury Care",
    hotline: "0988 123 456",
    hotline2: "024 3988 8888",
    email: "contact@mocsalon.vn",
    address: "Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội | 123 Pho Hue St, Hang Bai Ward, Hoan Kiem Dist, Hanoi",
    workingHours: "Thứ Hai – Thứ Bảy: 09:00 – 20:00, Chủ Nhật: 09:00 – 18:00 | Mon – Sat: 09:00 – 20:00, Sun: 09:00 – 18:00",
    facebook: "https://facebook.com/mocsalon.vietnam",
    instagram: "https://instagram.com/mocsalon.official",
    tiktok: "https://tiktok.com/@mocsalon.official",
    zalo: "https://zalo.me/0988123456",
    seoTitle: "Mộc Salon – Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp | Refined Nail Artistry",
    seoDescription: "Mộc Salon chuyên dịch vụ làm móng nghệ thuật, chăm sóc móng cao cấp, sơn gel, nail art và spa thư giãn. Đặt lịch ngay hôm nay. | Premium nail artistry, luxury manicure, pedicure, and soothing spa treatments.",
    seoKeywords: "mộc salon, moc salon, nail salon hà nội, làm móng nghệ thuật, chăm sóc móng, sơn gel, nail art, pedicure",
    bannerBadge: "⭐ Không gian làm đẹp thư giãn hàng đầu | ⭐ Premier Relaxing Beauty Sanctuary",
    bannerTitle: "Mộc Salon\nNghệ thuật móng tinh tế | Mộc Salon\nRefined Nail Artistry",
    bannerSubtitle: "Chăm sóc móng cao cấp, tôn vinh vẻ đẹp tự nhiên và phong cách riêng của bạn | Premium nail care, celebrating your natural elegance and personal style",
    bannerStats: JSON.stringify([
      { value: "8+", label: "Năm kinh nghiệm | Years of Experience" },
      { value: "5000+", label: "Khách hàng hài lòng | Happy Guests" },
      { value: "100%", label: "Tiệt trùng y tế | Sterilized Tools" },
      { value: "5★", label: "Đánh giá chất lượng | 5-Star Reviews" },
    ]),
    aboutHeadline: "Tỉ mỉ trong từng nét đẹp | Meticulous in Every Detail",
    aboutSubheadline: "Mộc Salon mang đến trải nghiệm chăm sóc móng chỉn chu, kết hợp kỹ thuật tinh tế với không gian thư giãn dành riêng cho bạn. | Mộc Salon delivers thoughtful nail care, uniting delicate craftsmanship with a serene sanctuary tailored for you.",
    aboutValues: JSON.stringify([
      { title: "Tỉ mỉ | Meticulous", description: "Mỗi đường nét và bước chăm sóc đều được thực hiện cẩn trọng. | Every curve and stroke is performed with gentle, uncompromising care." },
      { title: "Vệ sinh y tế | Clinical Hygiene", description: "Dụng cụ được tiệt trùng autoclave chuẩn y khoa để bạn luôn an tâm. | All instruments undergo medical autoclave sterilization for total peace of mind." },
      { title: "Thư giãn | Serene Sanctuary", description: "Không gian nhẹ nhàng ấm cúng để bạn tận hưởng trọn vẹn thời gian làm đẹp. | A tranquil ambiance designed for you to unwind and savour your beauty ritual." },
    ]),
    footerTaglines: JSON.stringify([
      "✨ Không gian thư giãn, phong cách mộc tự nhiên | Serene sanctuary with natural warmth",
      "💅 Kỹ thuật nail art chuẩn Nhật – Hàn | Japanese & Korean nail artistry",
      "🌿 100% dụng cụ tiệt trùng y tế & sơn dưỡng chính hãng | 100% autoclave sterilized & genuine polish",
    ]),
    copyright: "© 2025 Mộc Salon – Bảo lưu mọi quyền | © 2025 Mộc Salon – All rights reserved",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✅ Settings: ${Object.keys(settings).length} bilingual settings seeded`);

  console.log("\n🎉 Bilingual Seed Complete! Mộc Salon is ready in Vietnamese & English.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
