const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const configs = [
    { key: "company_name", value: "CÔNG TY CỔ PHẦN THƯƠNG MẠI DỊCH VỤ XE GHÉP NAM ĐỊNH", description: "Tên công ty" },
    { key: "email", value: "info@xeghepnamdinh.vn", description: "Email liên hệ" },
    { key: "map_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8!2d105.81!3d21.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5!2sXe+Gh%C3%A9p+Nam+%C4%90%E1%BB%8Bnh!5e0!3m2!1svi!2s!4v1", description: "Google Maps embed URL" },
  ];

  for (const c of configs) {
    await p.siteConfig.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }

  console.log("Done - contact configs seeded");
  await p.$disconnect();
}

main();
