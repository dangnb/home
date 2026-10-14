// scripts/seed-bilingual.cjs – Bilingual Seed Runner for Mộc Salon (Vietnamese & English)
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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
      password: bcrypt.hashSync(adminPassword, 12),
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
      label: "Tin Tức & Xu Hướng | News & Trends",
      slug: "tin-tuc",
      description: "Cập nhật những xu hướng và phong cách nail mới nhất | Latest nail art trends and salon updates",
      order: 6,
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
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      order: 0,
    },
    {
      title: "Sơn Gel Mắt Mèo Ánh Trăng | Moonlight Cat-Eye Gel",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800",
      order: 1,
    },
    {
      title: "Pháp Cổ Điển Hiện Đại | Modern Minimalist French",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      order: 2,
    },
    {
      title: "Nail Art Đính Pha Lê Lấp Lánh | Sparkling Crystal Embellishments",
      category: "Nghệ Thuật Vẽ Móng | Nail Art",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800",
      order: 3,
    },
    {
      title: "Nối Móng Gel Dáng Hạnh Nhân | Almond Soft Gel Extensions",
      category: "Nối Móng & Đắp Bột | Extensions",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      order: 4,
    },
    {
      title: "Ombre Tráng Gương Ngọc Trai | Glazed Pearl Chrome Ombré",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800",
      order: 5,
    },
    {
      title: "Chăm Sóc & Massage Gót Hồng Spa | Relaxing Foot Spa & Pedicure",
      category: "Chăm Sóc Móng Chân | Pedicure",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
      order: 6,
    },
    {
      title: "Bộ Sưu Tập Nude Thanh Lịch | Timeless Nude Palette",
      category: "Móng Gel Cao Cấp | Gel Nails",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800",
      order: 7,
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
      content: "<h2>1. Tráng Gương Ngọc Trai (Glazed Chrome Nails)</h2><p>Lấy cảm hứng từ ánh sáng dịu dàng của xà cừ và ngọc trai thiên nhiên, phong cách móng tráng gương đem lại cảm giác sang trọng, thanh khiết và cực kỳ tôn da.</p><h2>2. Vân Đá Cẩm Thạch Huyền Bí (Ethereal Marble Veins)</h2><p>Từng đường vân đá uyển chuyển kết hợp cùng nhũ vàng ánh kim tạo nên vẻ đẹp độc bản cho từng đầu ngón tay.</p><h2>3. Phong Cách Pháp Hiện Đại (Modern Micro French)</h2><p>Đường viền đầu móng siêu mảnh với tone màu pastel hoặc vàng kim loại mang lại nét thanh lịch, phù hợp cho cả nơi công sở lẫn tiệc tối.</p><h2>4. Đính Pha Lê Tối Giản (Minimalist Crystal Accents)</h2><p>Không quá cầu kỳ nhưng vừa đủ để thu hút mọi ánh nhìn với các viên pha lê Swarovski lấp lánh nhẹ nhàng.</p><!-- bilingual-split --><h2>1. Glazed Chrome Nails</h2><p>Inspired by the gentle glow of natural mother-of-pearl, glazed chrome nails radiate effortless sophistication, luminous clarity, and universal skin-tone enhancement.</p><h2>2. Ethereal Marble Veins</h2><p>Fluid, organic mineral swirls accented with subtle liquid-gold flakes create a one-of-a-kind bespoke masterpiece on every fingertip.</p><h2>3. Modern Micro French</h2><p>An ultra-fine tip line rendered in soft pastels or metallic champagne offers modern poise, effortlessly transitioning from daytime boardroom to evening soiree.</p><h2>4. Minimalist Crystal Accents</h2><p>Delicate Swarovski crystals placed with intentional restraint bring subtle brilliance to every gesture without overwhelming the natural hand silhouette.</p>",
      categoryId: "kinh-nghiem",
      thumbnail: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      status: "published",
    },
    {
      title: "Bí Quyết Chăm Sóc Móng Chắc Khỏe Sau Khi Sơn Gel | Expert Guide to Keeping Nails Healthy After Gel Polish",
      slug: "bi-quyet-cham-soc-mong-chac-khoe-sau-son-gel",
      excerpt: "Những lời khuyên từ chuyên gia Mộc Salon giúp bạn bảo vệ màng sừng keratin và duy trì bộ móng chắc khỏe, sáng hồng. | Expert tips from Mộc Salon specialists on protecting natural keratin and maintaining strong, healthy nails.",
      content: "<h2>Tại Sao Móng Cần Được Nuôi Dưỡng?</h2><p>Dù sơn gel mang lại vẻ đẹp bền lâu, móng tay tự nhiên vẫn cần độ ẩm và dưỡng chất để không bị giòn gãy.</p><h2>Các Thói Quen Quan Trọng:</h2><ul><li>Thoa dầu dưỡng viền móng (Cuticle Oil) mỗi ngày trước khi đi ngủ.</li><li>Không tự ý bóc hoặc cạy lớp sơn gel khi móng bắt đầu dài ra.</li><li>Sử dụng găng tay khi tiếp xúc với hóa chất tẩy rửa gia dụng.</li><li>Uống đủ nước và bổ sung Biotin, Vitamin E trong chế độ ăn.</li></ul><!-- bilingual-split --><h2>Why Natural Nails Need Daily Nourishment</h2><p>While gel polish provides durable beauty, your natural nail bed requires continuous hydration and nutrients to prevent brittle splitting.</p><h2>Essential Home Care Habits:</h2><ul><li>Apply nourishing cuticle oil every night before resting.</li><li>Never peel or pick gel polish away as it removes protective dorsal layers.</li><li>Wear protective gloves when handling household detergents.</li><li>Stay hydrated and incorporate Biotin and Vitamin E into your diet.</li></ul>",
      categoryId: "kinh-nghiem",
      thumbnail: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800",
      status: "published",
    },
    {
      title: "Quy Trình Tiệt Trùng Y Tế Chuẩn 5 Sao Tại Mộc Salon | 5-Star Medical-Grade Sterilization at Mộc Salon",
      slug: "quy-trinh-tiet-trung-y-te-moc-salon",
      excerpt: "Sự an toàn và an tâm tuyệt đối của khách hàng là ưu tiên hàng đầu trong mọi dịch vụ tại Mộc Salon. | Your health, hygiene, and complete peace of mind are the cornerstone of every treatment at Mộc Salon.",
      content: "<h2>Cam Kết An Toàn Tuyệt Đối</h2><p>Tại Mộc Salon, mỗi khách hàng đều xứng đáng được chăm sóc trong điều kiện vệ sinh vô trùng nghiêm ngặt nhất.</p><h2>Quy Trình 4 Bước Chuẩn Y Khoa:</h2><ul><li><strong>Bước 1:</strong> Ngâm rửa và làm sạch cặn bẩn bằng dung dịch sát khuẩn chuyên dụng.</li><li><strong>Bước 2:</strong> Rửa sóng siêu âm làm sạch sâu từng khớp nối kìm và dụng cụ.</li><li><strong>Bước 3:</strong> Đóng túi tiệt trùng có chỉ thị màu kiểm soát nhiệt độ.</li><li><strong>Bước 4:</strong> Khử khuẩn bằng nồi hấp áp suất cao chuẩn autoclave và bảo quản trong tủ cực tím UV.</li></ul><!-- bilingual-split --><h2>Our Commitment to Absolute Hygiene</h2><p>At Mộc Salon, we believe that true luxury begins with spotless medical-grade hygiene and unconditional client safety.</p><h2>Our 4-Step Clinical Protocol:</h2><ul><li><strong>Step 1:</strong> Ultrasonic wash and pre-cleaning in medical disinfectant solution.</li><li><strong>Step 2:</strong> High-frequency ultrasonic cavitation targeting precision instrument joints.</li><li><strong>Step 3:</strong> Sealed biological indicator pouches with heat-sensitive validation markers.</li><li><strong>Step 4:</strong> High-pressure medical autoclave steam sterilization and UV cabinet storage.</li></ul>",
      categoryId: "tin-tuc",
      thumbnail: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
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
  const settings = {
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
