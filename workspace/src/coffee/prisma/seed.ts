import bcrypt from "bcryptjs";
import { PrismaClient, type ProductBadge } from "@prisma/client";
import { products } from "../src/lib/products";
import { parseVndPrice } from "../src/lib/format";

const prisma = new PrismaClient();

const newsPosts = [
  {
    slug: "bi-quyet-chon-ca-phe-sang",
    title: "Bí quyết chọn ly cà phê hợp buổi sáng",
    excerpt: "Một vài gợi ý nhỏ để bạn bắt đầu ngày mới với hương vị tỉnh táo nhưng vẫn dịu dàng.",
    content:
      "Buổi sáng cần một ly cà phê đủ đậm để đánh thức sự tập trung, nhưng không nên quá gắt. Nếu bạn thích vị truyền thống, cà phê sữa đá là lựa chọn an toàn. Nếu cần sự nhẹ nhàng, latte kem muối hoặc cold brew sẽ giữ năng lượng ổn định hơn.\n\nỞ Mộc Coffee, tụi mình rang vừa để giữ hậu vị caramel và hạn chế cảm giác đắng khét. Bạn có thể thêm shot espresso khi cần tỉnh táo hơn, hoặc chọn ít ngọt để cảm nhận rõ vị hạt.",
  },
  {
    slug: "khong-gian-lam-viec-tai-moc",
    title: "Một góc làm việc nhiều ánh sáng tại Mộc",
    excerpt: "Không chỉ là nơi uống cà phê, Mộc Coffee còn là góc nhỏ cho những buổi làm việc sáng tạo.",
    content:
      "Không gian mở, ổ cắm gần bàn và playlist nhẹ là những chi tiết tụi mình chăm chút để bạn có thể ngồi lâu mà vẫn thoải mái. Buổi sáng phù hợp cho deep work, còn chiều tối là thời điểm lý tưởng để gặp bạn bè hoặc brainstorm nhóm.\n\nMenu có cold brew, trà trái cây và bánh ngọt nướng mới để bạn đổi vị trong ngày.",
  },
  {
    slug: "mon-moi-matcha-dua-nuong",
    title: "Món mới: Matcha dừa nướng cho team không uống cà phê",
    excerpt: "Matcha Nhật thanh vị, sữa dừa béo nhẹ và topping dừa nướng thơm giòn.",
    content:
      "Matcha dừa nướng được tạo ra cho những ngày bạn muốn một món xanh mát nhưng vẫn có chút béo thơm. Tụi mình dùng matcha vị thanh, kết hợp sữa dừa và dừa nướng để tạo mùi thơm hiện đại.\n\nMón này hợp nhất khi uống ít đá, ít ngọt và thêm kem cheese nếu bạn thích vị béo rõ hơn.",
  },
];

const jobPostings = [
  {
    slug: "barista-full-time",
    title: "Barista full-time",
    location: "Quận 1, TP.HCM",
    employmentType: "Full-time",
    description: "Pha chế đồ uống, kiểm soát chất lượng ly và cùng team phát triển món mới.",
    requirements: "Yêu thích cà phê, giao tiếp tốt, có thể làm xoay ca. Có kinh nghiệm là lợi thế.",
  },
  {
    slug: "nhan-vien-phuc-vu-part-time",
    title: "Nhân viên phục vụ",
    location: "Quận 1, TP.HCM",
    employmentType: "Part-time",
    description: "Đón khách, tư vấn menu, giữ không gian quán luôn gọn gàng và thân thiện.",
    requirements: "Nhanh nhẹn, thân thiện, ưu tiên sinh viên có lịch làm linh hoạt.",
  },
  {
    slug: "content-creator-part-time",
    title: "Content creator",
    location: "Hybrid",
    employmentType: "Part-time",
    description: "Chụp ảnh, quay short video và kể câu chuyện Mộc Coffee trên mạng xã hội.",
    requirements: "Có gu hình ảnh, biết quay dựng cơ bản, yêu thích F&B lifestyle.",
  },
];

function mapBadge(badge?: string): ProductBadge | null {
  if (badge === "Nổi bật") return "FEATURED";
  if (badge === "Bán chạy") return "BEST_SELLER";
  if (badge === "Mới") return "NEW";
  return null;
}

async function main() {
  const password = process.env.ADMIN_PASSWORD || "change-me-before-production";
  const email = process.env.ADMIN_EMAIL || "admin@moccoffee.local";
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Mộc Coffee Admin",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  for (const [index, product] of products.entries()) {
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        description: product.description,
        longDescription: product.longDescription,
        price: parseVndPrice(product.price),
        badge: mapBadge(product.badge),
        tone: product.tone,
        sortOrder: index,
      },
      create: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        description: product.description,
        longDescription: product.longDescription,
        price: parseVndPrice(product.price),
        badge: mapBadge(product.badge),
        tone: product.tone,
        sortOrder: index,
      },
    });

    await prisma.productTastingNote.deleteMany({ where: { productId: savedProduct.id } });
    await prisma.productAddOn.deleteMany({ where: { productId: savedProduct.id } });

    await prisma.productTastingNote.createMany({
      data: product.tastingNotes.map((value, noteIndex) => ({ productId: savedProduct.id, value, sortOrder: noteIndex })),
    });
    await prisma.productAddOn.createMany({
      data: product.addOns.map((name, addOnIndex) => ({ productId: savedProduct.id, name, sortOrder: addOnIndex })),
    });

    for (const review of product.reviews) {
      await prisma.review.upsert({
        where: { id: `${savedProduct.slug}-${review.name}` },
        update: {},
        create: {
          id: `${savedProduct.slug}-${review.name}`,
          productId: savedProduct.id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          status: "APPROVED",
        },
      });
    }
  }

  for (const [index, post] of newsPosts.entries()) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: { ...post, status: "PUBLISHED", publishedAt: new Date(), authorId: admin.id },
      create: { ...post, status: "PUBLISHED", publishedAt: new Date(Date.now() - index * 86400000), authorId: admin.id },
    });
  }

  for (const [index, job] of jobPostings.entries()) {
    await prisma.jobPosting.upsert({
      where: { slug: job.slug },
      update: { ...job, sortOrder: index, isActive: true },
      create: { ...job, sortOrder: index, isActive: true },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
