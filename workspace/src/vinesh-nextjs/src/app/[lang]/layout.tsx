export const revalidate = 60;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    try {
        const activeLangs = await prisma.language.findMany({ where: { isActive: true }, select: { code: true } });
        const codes = new Set(['vi', 'en', ...activeLangs.map(l => l.code)]);
        return Array.from(codes).map(code => ({ lang: code }));
    } catch {
        return [{ lang: 'vi' }, { lang: 'en' }];
    }
}

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    const [activeLangs, menuCategories, settingsArray] = await Promise.all([
        prisma.language.findMany({ where: { isActive: true }, select: { code: true, name: true } }).catch(() => []),
        prisma.category.findMany({
            where: { isActive: true, isMenu: true, parentId: null },
            orderBy: { order: 'asc' },
            include: {
                children: { where: { isActive: true }, orderBy: { order: 'asc' } },
                services: { orderBy: { order: 'asc' } }
            }
        }).catch(() => []),
        prisma.setting.findMany({ select: { key: true, value: true } }).catch(() => [])
    ]);

    // Bộ menu danh mục mặc định dự phòng nếu cơ sở dữ liệu tạm thời chưa khởi tạo hoặc rỗng
    const defaultMenuCategories = [
        {
            id: "cat-about",
            slug: "ve-webcare",
            order: 1,
            isActive: true,
            isMenu: true,
            parentId: null,
            translations: JSON.stringify({
                vi: { title: "Về WebCare" },
                en: { title: "About WebCare" }
            }),
            children: [
                {
                    id: "cat-about-1",
                    slug: "gioi-thieu-chung",
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-about",
                    translations: JSON.stringify({
                        vi: { title: "Giới thiệu chung" },
                        en: { title: "General Overview" }
                    }),
                    children: [],
                    services: []
                },
                {
                    id: "cat-about-2",
                    slug: "tam-nhin-su-menh",
                    order: 2,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-about",
                    translations: JSON.stringify({
                        vi: { title: "Tầm nhìn & Sứ mệnh" },
                        en: { title: "Vision & Mission" }
                    }),
                    children: [],
                    services: []
                }
            ],
            services: []
        },
        {
            id: "cat-inspection",
            slug: "kiem-dinh-an-toan",
            order: 2,
            isActive: true,
            isMenu: true,
            parentId: null,
            translations: JSON.stringify({
                vi: { title: "Kiểm định an toàn" },
                en: { title: "Safety Inspection" }
            }),
            children: [
                {
                    id: "cat-insp-1",
                    slug: "thiet-bi-ap-luc",
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-inspection",
                    translations: JSON.stringify({
                        vi: { title: "Nồi hơi & Thiết bị áp lực" },
                        en: { title: "Boilers & Pressure Vessels" }
                    }),
                    children: [],
                    services: []
                },
                {
                    id: "cat-insp-2",
                    slug: "thiet-bi-nang",
                    order: 2,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-inspection",
                    translations: JSON.stringify({
                        vi: { title: "Thiết bị nâng hạ & Xe nâng" },
                        en: { title: "Lifting Gear & Forklifts" }
                    }),
                    children: [],
                    services: []
                }
            ],
            services: []
        },
        {
            id: "cat-environment",
            slug: "quan-trac-moi-truong",
            order: 3,
            isActive: true,
            isMenu: true,
            parentId: null,
            translations: JSON.stringify({
                vi: { title: "Quan trắc môi trường" },
                en: { title: "Environmental Monitoring" }
            }),
            children: [
                {
                    id: "cat-env-1",
                    slug: "moi-truong-lao-dong",
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-environment",
                    translations: JSON.stringify({
                        vi: { title: "Môi trường lao động" },
                        en: { title: "Workplace Environment" }
                    }),
                    children: [],
                    services: []
                },
                {
                    id: "cat-env-2",
                    slug: "khi-thai-nuoc-thai",
                    order: 2,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-environment",
                    translations: JSON.stringify({
                        vi: { title: "Khí thải & Nước thải" },
                        en: { title: "Emission & Wastewater" }
                    }),
                    children: [],
                    services: []
                }
            ],
            services: []
        },
        {
            id: "cat-certification",
            slug: "chung-nhan-he-thong",
            order: 4,
            isActive: true,
            isMenu: true,
            parentId: null,
            translations: JSON.stringify({
                vi: { title: "Chứng nhận hệ thống" },
                en: { title: "System Certification" }
            }),
            children: [
                {
                    id: "cat-cert-1",
                    slug: "chung-nhan-iso",
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-certification",
                    translations: JSON.stringify({
                        vi: { title: "Chứng nhận ISO 9001 / 14001 / 45001" },
                        en: { title: "ISO 9001 / 14001 / 45001" }
                    }),
                    children: [],
                    services: []
                }
            ],
            services: []
        },
        {
            id: "cat-training",
            slug: "dao-tao-huan-luyen",
            order: 5,
            isActive: true,
            isMenu: true,
            parentId: null,
            translations: JSON.stringify({
                vi: { title: "Huấn luyện an toàn" },
                en: { title: "Safety Training" }
            }),
            children: [
                {
                    id: "cat-train-1",
                    slug: "an-toan-lao-dong",
                    order: 1,
                    isActive: true,
                    isMenu: true,
                    parentId: "cat-training",
                    translations: JSON.stringify({
                        vi: { title: "Huấn luyện Nhóm 1 - 6" },
                        en: { title: "Groups 1 - 6 Training" }
                    }),
                    children: [],
                    services: []
                }
            ],
            services: []
        }
    ];

    const finalMenuCategories = (menuCategories && menuCategories.length > 0) ? menuCategories : defaultMenuCategories;

    // Luôn đảm bảo tối thiểu có cả 2 ngôn ngữ chuẩn vi và en
    const defaultLangs = [
        { code: 'vi', name: 'Tiếng Việt' },
        { code: 'en', name: 'English' }
    ];

    const supportedLangs = [...defaultLangs];
    for (const al of activeLangs) {
        const existingIdx = supportedLangs.findIndex(l => l.code.toLowerCase() === al.code.toLowerCase());
        if (existingIdx !== -1) {
            supportedLangs[existingIdx] = al;
        } else {
            supportedLangs.push(al);
        }
    }

    const isSupported = supportedLangs.some(l => l.code.toLowerCase() === lang.toLowerCase());
    if (!isSupported) return notFound();

    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    return (
        <div className="site-layout-wrapper">
            <Header settings={settings} lang={lang} languages={supportedLangs} menuCategories={finalMenuCategories} />
            {children}
            <Footer settings={settings} lang={lang} />
            <FloatingContact phone={settings.phone} zalo={settings.zalo} facebook={settings.facebook} lang={lang} />
        </div>
    );
}
