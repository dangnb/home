import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const langs = [
        { code: "vi", name: "Tiếng Việt", isDefault: true, isActive: true },
        { code: "en", name: "English", isDefault: false, isActive: true },
    ];
    for (const l of langs) {
        await prisma.language.upsert({
            where: { code: l.code },
            update: {},
            create: l
        });
    }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
