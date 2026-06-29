import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.user.updateMany({
        where: { email: 'admin@example.com' },
        data: { role: 'ADMIN' }
    });
    console.log('Updated user list successfully.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
