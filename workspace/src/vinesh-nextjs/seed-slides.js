const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSlides() {
    const data = [
        {
            imageUrl: '/assets/hero.png',
            order: 1,
            translations: JSON.stringify({
                vi: {
                    title: 'AN TOÀN - SỨC KHỎE - MÔI TRƯỜNG',
                    subtitle: 'Giải pháp tổng thể',
                    desc: 'Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.'
                },
                en: {
                    title: 'SAFETY - HEALTH - ENVIRONMENT',
                    subtitle: 'Comprehensive Solutions',
                    desc: 'Accompanying enterprises to develop sustainably with leading inspection, certification and safety training services.'
                }
            }),
            linkUrl: '/vi#services',
            isActive: true
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
            order: 2,
            translations: JSON.stringify({
                vi: {
                    title: 'KIỂM ĐỊNH MÁY MÓC TỰ ĐỘNG',
                    subtitle: 'Chất lượng hàng đầu',
                    desc: 'Hệ thống máy móc hiện đại, đảm bảo kết quả an toàn chính xác và tin cậy tuyệt đối.'
                },
                en: {
                    title: 'STANDARD MACHINE INSPECTION',
                    subtitle: 'Top Quality Solutions',
                    desc: 'Modern machinery system, ensuring the most accurate and reliable results.'
                }
            }),
            linkUrl: '/vi#services',
            isActive: true
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop',
            order: 3,
            translations: JSON.stringify({
                vi: {
                    title: 'ĐỘI NGŨ CHUYÊN GIA TẬN TÂM',
                    subtitle: 'Kinh nghiệm & Uy tín',
                    desc: 'Hàng ngàn giờ nỗ lực mang lại sự an tâm tuyệt đối cho khách hàng và đối tác.'
                },
                en: {
                    title: 'DEDICATED EXPERT TEAM',
                    subtitle: 'Experience & Prestige',
                    desc: 'Thousands of effort hours bringing absolute peace of mind to customers.'
                }
            }),
            linkUrl: '/vi#services',
            isActive: true
        }
    ];

    for (const item of data) {
        await prisma.slide.create({ data: item });
    }

    console.log('Slides created successfully!');
}

seedSlides()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
