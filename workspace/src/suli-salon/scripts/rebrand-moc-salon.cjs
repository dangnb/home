const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const brandSettings = {
  siteName: "Mộc Salon",
  tagline: "Nghệ thuật móng tinh tế",
  seoTitle: "Mộc Salon – Nghệ thuật móng tinh tế",
  seoDescription:
    "Dịch vụ chăm sóc móng cao cấp, sơn gel, nail art và pedicure. Đặt lịch ngay tại Mộc Salon.",
  copyright: "© 2026 Mộc Salon – Bảo lưu mọi quyền",
  bannerTitle: "Mộc Salon\nNghệ thuật móng tinh tế",
  aboutSubheadline:
    "Mộc Salon mang đến trải nghiệm chăm sóc móng chỉn chu, kết hợp kỹ thuật tinh tế với không gian thư giãn dành riêng cho bạn.",
};

async function main() {
  await prisma.$transaction(
    Object.entries(brandSettings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );

  console.log(`✓ Updated ${Object.keys(brandSettings).length} Mộc Salon settings.`);
  console.log("Contact details, social links, and domain settings were not changed.");
}

main()
  .catch((error) => {
    console.error("Unable to update the Mộc Salon settings.", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
