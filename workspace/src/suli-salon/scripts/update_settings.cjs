const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newSettings = {
  siteName: "Mộc Salon",
  tagline: "Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp",
  hotline: "0988 123 456",
  hotline2: "024 3988 8888",
  email: "contact@mocsalon.vn",
  address: "Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
  workingHours: "Thứ Hai – Thứ Bảy: 09:00 – 20:00, Chủ Nhật: 09:00 – 18:00",
  facebook: "https://facebook.com/mocsalon.vietnam",
  tiktok: "https://tiktok.com/@mocsalon.official",
  zalo: "https://zalo.me/0988123456",
  instagram: "https://instagram.com/mocsalon.official",
  seoTitle: "Mộc Salon – Nghệ thuật móng tinh tế & Chăm sóc móng cao cấp",
  seoDescription: "Mộc Salon chuyên dịch vụ làm móng nghệ thuật, chăm sóc móng cao cấp, sơn gel, nail art và spa thư giãn. Đặt lịch ngay hôm nay.",
  seoKeywords: "mộc salon, moc salon, làm móng nghệ thuật, nail salon hà nội, chăm sóc móng, sơn gel, nail art, pedicure",
  copyright: "© 2025 Mộc Salon – Bảo lưu mọi quyền",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4854580214644!2d105.85023437596956!3d21.01325128830906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8826555555%3A0x6b6e4e0b0e515d9!2zUGjhu5EgSHXhur8sIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lp!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn",
  mapLat: "21.0132",
  mapLng: "105.8502"
};

async function update() {
  for (const [key, value] of Object.entries(newSettings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log("Successfully updated settings in database!");
}

update()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
