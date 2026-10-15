import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Languages
    const languages = [
        { code: 'vi', name: 'Tiếng Việt', isDefault: true, isActive: true },
        { code: 'en', name: 'English', isDefault: false, isActive: true },
    ];

    for (const lang of languages) {
        await prisma.language.upsert({
            where: { code: lang.code },
            update: { name: lang.name, isDefault: lang.isDefault, isActive: lang.isActive },
            create: lang,
        });
    }
    console.log('✅ Languages seeded: vi, en');

    // 2. Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
        console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // 3. Settings
    const settings = [
        { key: 'heroTitle', value: 'GIẢI PHÁP CHĂM SÓC & VẬN HÀNH DOANH NGHIỆP' },
        { key: 'heroSubtitle', value: 'Giải pháp tổng thể WebCare' },
        { key: 'heroDesc', value: 'Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu.' },
        { key: 'siteName', value: 'WebCare' },
        { key: 'phone', value: '0984 929 693' },
        { key: 'email', value: 'info@webcare.vn' },
        { key: 'address', value: 'Khu Công nghệ cao, TP. Hồ Chí Minh' },
    ];

    for (const s of settings) {
        await prisma.setting.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
        });
    }
    console.log('✅ Settings seeded');

    // 4. Categories (with isMenu: true)
    await prisma.category.upsert({
        where: { slug: 've-webcare' },
        update: {
            isMenu: true,
            isActive: true,
            translations: JSON.stringify({
                vi: { title: 'Về WebCare' },
                en: { title: 'About WebCare' },
            }),
        },
        create: {
            slug: 've-webcare',
            order: 1,
            isActive: true,
            isMenu: true,
            translations: JSON.stringify({
                vi: { title: 'Về WebCare' },
                en: { title: 'About WebCare' },
            }),
        },
    });

    const c2 = await prisma.category.upsert({
        where: { slug: 'san-pham-dich-vu' },
        update: { isMenu: true, isActive: true },
        create: {
            slug: 'san-pham-dich-vu',
            order: 2,
            isActive: true,
            isMenu: true,
            translations: JSON.stringify({
                vi: { title: 'Sản phẩm & Dịch vụ' },
                en: { title: 'Products & Services' },
            }),
        },
    });

    await prisma.category.upsert({
        where: { slug: 'tin-tuc' },
        update: { isMenu: true, isActive: true },
        create: {
            slug: 'tin-tuc',
            order: 3,
            isActive: true,
            isMenu: true,
            translations: JSON.stringify({
                vi: { title: 'Tin tức & Sự kiện' },
                en: { title: 'News & Events' },
            }),
        },
    });
    console.log('✅ Categories seeded');

    // 5. Services
    const services = [
        {
            title: 'Quan trắc môi trường lao động',
            imageUrl: '/assets/service1.png',
            linkUrl: '#',
            order: 1,
            categoryId: c2.id,
        },
        {
            title: 'Phân loại lao động',
            imageUrl: '/assets/service2.png',
            linkUrl: '#',
            order: 2,
            categoryId: c2.id,
        },
        {
            title: 'Hợp chuẩn – hợp quy',
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop',
            linkUrl: '#',
            order: 3,
            categoryId: c2.id,
        },
        {
            title: 'Huấn luyện an toàn, vệ sinh',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop',
            linkUrl: '#',
            order: 4,
            categoryId: c2.id,
        },
    ];

    for (const s of services) {
        const exists = await prisma.service.findFirst({ where: { title: s.title } });
        if (!exists) {
            await prisma.service.create({ data: s });
        }
    }
    console.log('✅ Services seeded');

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
