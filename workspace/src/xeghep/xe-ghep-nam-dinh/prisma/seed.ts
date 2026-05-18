import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@xeghepnamdinh.vn" },
    update: {},
    create: {
      email: "admin@xeghepnamdinh.vn",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create default configs
  const configs = [
    { key: "site_name", value: "Xe Ghép Nam Định", description: "Tên website" },
    { key: "hotline", value: "0379803990", description: "Số hotline chính" },
    { key: "hotline_2", value: "0345076789", description: "Số hotline phụ" },
    { key: "zalo_link", value: "https://zalo.me/0379803990", description: "Link Zalo" },
    { key: "address_1", value: "Ngã tư bưu điện, TT Giao Thủy, Nam Định", description: "Trụ sở" },
    { key: "address_2", value: "Số 2A Văn Cao, P. Thụy Khê, Q. Tây Hồ, Hà Nội", description: "VP Hà Nội" },
    { key: "facebook_pixel", value: "", description: "Facebook Pixel ID" },
    { key: "google_analytics", value: "", description: "Google Analytics ID" },
    { key: "tiktok_pixel", value: "", description: "TikTok Pixel ID" },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log("Created default configs");

  // Create default services
  const services = [
    { name: "Xe Ghép Hà Nội Nam Định", price: "250.000đ", unit: "/Ghế", order: 1 },
    { name: "Taxi Hà Nội Nam Định 4 Chỗ", price: "900.000đ", unit: "/Xe", order: 2 },
    { name: "Taxi Hà Nội Nam Định 7 Chỗ", price: "1.100.000đ", unit: "/Xe", order: 3 },
    { name: "Xe Ghép Nam Định Nội Bài", price: "450.000đ", unit: "/Ghế", order: 4 },
    { name: "Taxi Nội Bài Nam Định 4 Chỗ", price: "1.100.000đ", unit: "/Xe", order: 5 },
    { name: "Taxi Nội Bài Nam Định 7 Chỗ", price: "1.300.000đ", unit: "/Xe", order: 6 },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  console.log("Created default services");

  // Create default price table
  const prices = [
    { route: "Xe Ghép Hà Nội Giao Thuỷ", price: "250.000đ", unit: "/Người", order: 1 },
    { route: "Xe Ghép Hà Nội Xuân Trường", price: "250.000đ", unit: "/Người", order: 2 },
    { route: "Xe Ghép Hà Nội Hải Hậu", price: "250.000đ", unit: "/Người", order: 3 },
    { route: "Xe Ghép Hà Nội Trực Ninh", price: "250.000đ", unit: "/Người", order: 4 },
    { route: "Xe Ghép Hà Nội Nam Trực", price: "250.000đ", unit: "/Người", order: 5 },
    { route: "Xe Ghép Hà Nội Nghĩa Hưng", price: "250.000đ", unit: "/Người", order: 6 },
    { route: "Xe Ghép Hà Nội Ý Yên", price: "250.000đ", unit: "/Người", order: 7 },
    { route: "Xe Ghép Hà Nội Vụ Bản", price: "250.000đ", unit: "/Người", order: 8 },
    { route: "Xe Ghép Hà Nội Mỹ Lộc", price: "250.000đ", unit: "/Người", order: 9 },
  ];

  for (const price of prices) {
    await prisma.priceTable.create({ data: price });
  }

  console.log("Created default price table");
  console.log("\n✅ Seed completed!");
  console.log("Admin login: admin@xeghepnamdinh.vn / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
