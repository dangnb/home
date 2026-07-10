const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const g = await prisma.galleryItem.findMany();
  console.log("GALLERY:");
  console.log(JSON.stringify(g, null, 2));
}
main().finally(() => prisma.$disconnect());
