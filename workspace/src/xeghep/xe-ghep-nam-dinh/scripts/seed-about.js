const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  await p.siteConfig.upsert({
    where: { key: "about_content" },
    update: {},
    create: {
      key: "about_content",
      value: '<h3>Dịch vụ xe ghép Nam Định là gì?</h3><p>Dịch vụ xe ghép Nam Định (còn gọi là đi chung xe) hiểu đơn giản là bạn sẽ thuê và đi chung một chuyến xe với một hoặc vài khách khác để tiết kiệm chi phí thuê xe. Số lượng khách trên xe chỉ khoảng 2 – 5 người, không chen chúc như xe khách.</p><h3>Ưu điểm của xe ghép</h3><ul><li>Đón tận nhà, trả tận nơi - không cần ra bến xe</li><li>Xe rộng rãi, thoải mái, ít bị say xe</li><li>Tiết kiệm đến 40-50% chi phí so với taxi riêng</li><li>Đi thẳng từ điểm đón đến điểm đến, không dừng đón khách liên tục</li><li>Phù hợp cho người ốm, người già, trẻ nhỏ</li></ul><h3>Về chúng tôi</h3><p>Xe Ghép Nam Định (xeghepnamdinh.vn) với kinh nghiệm quản lý và điều phối xe ghép chuyên tuyến Hà Nội – Nam Định trong suốt 5 năm qua. Chúng tôi cam kết mang đến dịch vụ chất lượng tốt nhất, đa dạng loại xe với giá cả hợp lý, giúp quý khách hàng cảm thấy thoải mái và an toàn trong suốt chuyến đi.</p>',
      description: "Nội dung trang giới thiệu",
    },
  });
  console.log("Done - about_content seeded");
  await p.$disconnect();
}

main();
