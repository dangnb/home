// Seed script for Four Seasons Fruits
// Creates categories, products, and an admin user

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@fourseasons.vn",
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log("✅ Admin user created (admin@fourseasons.vn / admin123)");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Trái cây nhập khẩu",
        slug: "trai-cay-nhap-khau",
        description: "Trái cây nhập khẩu từ các nước trên thế giới",
      },
    }),
    prisma.category.create({
      data: {
        name: "Trái cây nội địa",
        slug: "trai-cay-noi-dia",
        description: "Trái cây Việt Nam tươi ngon theo mùa",
      },
    }),
    prisma.category.create({
      data: {
        name: "Rau củ sạch",
        slug: "rau-cu-sach",
        description: "Rau củ hữu cơ, an toàn cho sức khỏe",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hạt dinh dưỡng",
        slug: "hat-dinh-duong",
        description: "Các loại hạt giàu dinh dưỡng",
      },
    }),
    prisma.category.create({
      data: {
        name: "Nước ép tươi",
        slug: "nuoc-ep-tuoi",
        description: "Nước ép trái cây tươi nguyên chất",
      },
    }),
    prisma.category.create({
      data: {
        name: "Combo quà tặng",
        slug: "combo-qua-tang",
        description: "Giỏ trái cây và combo quà tặng sang trọng",
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Create Products
  const products = [
    {
      name: "Nho Mỹ xanh không hạt",
      slug: "nho-my-xanh-khong-hat",
      description:
        "Nho xanh nhập khẩu từ Mỹ, không hạt, vị ngọt thanh mát. Giàu vitamin C và chất chống oxy hóa.",
      price: 189000,
      salePrice: 159000,
      stock: 50,
      unit: "kg",
      featured: true,
      isOnSale: true,
      categoryId: categories[0].id,
    },
    {
      name: "Táo Envy New Zealand",
      slug: "tao-envy-new-zealand",
      description:
        "Táo Envy nhập khẩu từ New Zealand, giòn ngọt, thơm đặc trưng. Phù hợp ăn trực tiếp hoặc làm salad.",
      price: 249000,
      stock: 30,
      unit: "kg",
      featured: true,
      isOnSale: false,
      categoryId: categories[0].id,
    },
    {
      name: "Cherry Úc đỏ",
      slug: "cherry-uc-do",
      description:
        "Cherry nhập khẩu từ Úc, quả to đều, vị ngọt đậm đà. Bảo quản lạnh để giữ độ tươi.",
      price: 450000,
      salePrice: 389000,
      stock: 20,
      unit: "kg",
      featured: true,
      isOnSale: true,
      categoryId: categories[0].id,
    },
    {
      name: "Xoài Cát Hòa Lộc",
      slug: "xoai-cat-hoa-loc",
      description:
        "Xoài cát Hòa Lộc chính vụ, thịt vàng ươm, ngọt lịm, thơm nức. Đặc sản miền Tây.",
      price: 120000,
      salePrice: 99000,
      stock: 80,
      unit: "kg",
      featured: true,
      isOnSale: true,
      categoryId: categories[1].id,
    },
    {
      name: "Bưởi da xanh Bến Tre",
      slug: "buoi-da-xanh-ben-tre",
      description:
        "Bưởi da xanh ruột hồng, vị ngọt thanh không đắng. Giàu vitamin C, tốt cho sức khỏe.",
      price: 65000,
      stock: 100,
      unit: "trái",
      featured: true,
      isOnSale: false,
      categoryId: categories[1].id,
    },
    {
      name: "Sầu riêng Ri6",
      slug: "sau-rieng-ri6",
      description:
        "Sầu riêng Ri6 cơm vàng, béo ngậy, ít xơ. Trái từ 2-3kg, chín cây tự nhiên.",
      price: 180000,
      stock: 40,
      unit: "kg",
      featured: true,
      isOnSale: false,
      categoryId: categories[1].id,
    },
    {
      name: "Măng cụt Lái Thiêu",
      slug: "mang-cut-lai-thieu",
      description:
        "Măng cụt Lái Thiêu vỏ mỏng, ruột trắng ngọt. Mùa thu hoạch từ tháng 5-7.",
      price: 95000,
      stock: 60,
      unit: "kg",
      featured: false,
      isOnSale: false,
      categoryId: categories[1].id,
    },
    {
      name: "Rau cải bó xôi hữu cơ",
      slug: "rau-cai-bo-xoi-huu-co",
      description:
        "Cải bó xôi (spinach) trồng hữu cơ, giàu sắt và vitamin. Phù hợp làm salad, smoothie.",
      price: 45000,
      stock: 200,
      unit: "bó",
      featured: false,
      isOnSale: false,
      categoryId: categories[2].id,
    },
    {
      name: "Cà chua cherry organic",
      slug: "ca-chua-cherry-organic",
      description:
        "Cà chua cherry trồng trong nhà kính, quả nhỏ đều, vị ngọt tự nhiên.",
      price: 55000,
      salePrice: 45000,
      stock: 150,
      unit: "hộp",
      featured: false,
      isOnSale: true,
      categoryId: categories[2].id,
    },
    {
      name: "Hạt óc chó Chile",
      slug: "hat-oc-cho-chile",
      description:
        "Hạt óc chó nhập khẩu từ Chile, giàu omega-3, tốt cho não bộ. Đã tách vỏ, ăn liền.",
      price: 320000,
      salePrice: 279000,
      stock: 45,
      unit: "hộp 500g",
      featured: true,
      isOnSale: true,
      categoryId: categories[3].id,
    },
    {
      name: "Hạt macadamia Úc",
      slug: "hat-macadamia-uc",
      description:
        "Hạt macadamia nhập khẩu từ Úc, béo bùi, giòn tan. Giàu chất béo tốt cho tim mạch.",
      price: 450000,
      stock: 30,
      unit: "hộp 500g",
      featured: true,
      isOnSale: false,
      categoryId: categories[3].id,
    },
    {
      name: "Nước ép cam tươi",
      slug: "nuoc-ep-cam-tuoi",
      description:
        "Nước ép cam tươi nguyên chất 100%, không đường, không chất bảo quản. Chai 500ml.",
      price: 45000,
      stock: 100,
      unit: "chai",
      featured: false,
      isOnSale: false,
      categoryId: categories[4].id,
    },
    {
      name: "Smoothie xanh detox",
      slug: "smoothie-xanh-detox",
      description:
        "Smoothie từ cải kale, táo xanh, dưa leo và gừng. Thanh lọc cơ thể, giàu vitamin.",
      price: 65000,
      salePrice: 55000,
      stock: 80,
      unit: "chai",
      featured: false,
      isOnSale: true,
      categoryId: categories[4].id,
    },
    {
      name: "Giỏ trái cây Premium",
      slug: "gio-trai-cay-premium",
      description:
        "Giỏ quà trái cây cao cấp gồm: nho, táo, lê, cherry, kiwi. Đóng gói sang trọng, phù hợp biếu tặng.",
      price: 850000,
      salePrice: 750000,
      stock: 15,
      unit: "giỏ",
      featured: true,
      isOnSale: true,
      categoryId: categories[5].id,
    },
    {
      name: "Combo trái cây gia đình",
      slug: "combo-trai-cay-gia-dinh",
      description:
        "Combo 5kg trái cây hỗn hợp cho gia đình: cam, táo, chuối, nho, ổi. Tiết kiệm 20%.",
      price: 350000,
      salePrice: 299000,
      stock: 25,
      unit: "combo",
      featured: false,
      isOnSale: true,
      categoryId: categories[5].id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products created`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("   Admin login: admin@fourseasons.vn / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
