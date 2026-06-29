import { PrismaClient } from "@prisma/client";

// Mở rộng globalThis để thêm thuộc tính prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
