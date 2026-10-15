import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function seedDemoData(force = false) {
    console.log("🌱 Starting bilingual demo data seeding...");

    // 1. NGÔN NGỮ (Languages)
    const languages = [
        { code: "vi", name: "Tiếng Việt", isDefault: true, isActive: true },
        { code: "en", name: "English", isDefault: false, isActive: true },
    ];

    for (const lang of languages) {
        await prisma.language.upsert({
            where: { code: lang.code },
            update: { name: lang.name, isDefault: lang.isDefault, isActive: true },
            create: lang,
        });
    }
    console.log("✅ Languages seeded: vi & en");

    // 2. TÀI KHOẢN QUẢN TRỊ (Admin User)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                name: "WebCare Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
    }

    // 3. CẤU HÌNH HỆ THỐNG SONG NGỮ (Bilingual Settings)
    const settings = [
        { key: "siteName", value: "WebCare" },
        { key: "phone", value: "0984 929 693" },
        { key: "email", value: "info@webcare.vn" },
        { key: "address", value: "Khu Công nghiệp VSIP I, TP. Thuận An, Bình Dương" },
        { key: "address_en", value: "VSIP I Industrial Park, Thuan An City, Binh Duong Province, Vietnam" },

        // Hero section
        { key: "heroTitle", value: "GIẢI PHÁP CHĂM SÓC & VẬN HÀNH DOANH NGHIỆP" },
        { key: "heroTitle_en", value: "ENTERPRISE CARE & OPERATIONAL EXCELLENCE" },
        { key: "heroSubtitle", value: "WebCare - An Toàn, Chất Lượng & Bền Vững" },
        { key: "heroSubtitle_en", value: "WebCare - Safety, Quality & Sustainable Growth" },
        { key: "heroDesc", value: "Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn toàn diện, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu." },
        { key: "heroDesc_en", value: "Partnering with enterprises for sustainable growth through leading comprehensive consulting solutions, technical inspection, and professional services." },

        // About Us section
        { key: "aboutTitle", value: "Về Chúng Tôi" },
        { key: "aboutTitle_en", value: "About Us" },
        { key: "aboutSubtitle", value: "Chúng tôi là đối tác tin cậy trong sự phát triển bền vững của bạn" },
        { key: "aboutSubtitle_en", value: "We are your trusted partner in sustainable business growth" },
        { key: "aboutDesc1", value: "Với hơn 10 năm kinh nghiệm trong ngành, WebCare tự hào cung cấp các giải pháp tối ưu giúp hàng trăm doanh nghiệp tuân thủ pháp luật, bảo vệ người lao động và nâng cao năng suất." },
        { key: "aboutDesc1_en", value: "With over 10 years of industry experience, WebCare proudly delivers optimal solutions helping hundreds of enterprises achieve regulatory compliance, worker protection, and peak productivity." },
        { key: "aboutDesc2", value: "Đội ngũ chuyên gia và kỹ sư được đào tạo chuyên sâu của chúng tôi luôn tận tâm, sáng tạo và ứng dụng công nghệ hiện đại nhất để mang lại giá trị cao nhất cho khách hàng." },
        { key: "aboutDesc2_en", value: "Our team of certified experts and engineers is dedicated, innovative, and applies state-of-the-art technology to deliver maximum value to every client." },

        // Footer section
        { key: "footerDesc", value: "Công ty TNHH WebCare Việt Nam chuyên cung cấp các giải pháp quan trắc môi trường, kiểm định an toàn, chứng nhận hệ thống và đào tạo kỹ thuật toàn diện cho doanh nghiệp." },
        { key: "footerDesc_en", value: "WebCare Vietnam Co., Ltd specializes in comprehensive environmental monitoring, safety inspection, system certification, and technical training solutions for enterprises." },

        // Socials & Map
        { key: "facebook", value: "https://facebook.com/webcare.vn" },
        { key: "youtube", value: "https://youtube.com/@webcare.vn" },
        { key: "linkedin", value: "https://linkedin.com/company/webcare-vietnam" },
        { key: "mapIframe", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.427618995574!2d106.70295191533423!3d10.855047292268482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e1d5a7d5b1%3A0x6e9f9024f0e5b7b0!2sVSIP%20I!5e0!3m2!1sen!2svn!4v1622616854992!5m2!1sen!2svn" },
    ];

    for (const s of settings) {
        await prisma.setting.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
        });
    }
    console.log("✅ Settings seeded with bilingual keys");

    // 4. SLIDES BANNER CHÍNH (Hero Slides - Song ngữ)
    const existingSlides = await prisma.slide.count();
    if (existingSlides === 0 || force) {
        await prisma.slide.deleteMany({});
        const slidesData = [
            {
                imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
                linkUrl: "#services",
                order: 1,
                isActive: true,
                translations: JSON.stringify({
                    vi: {
                        title: "Kiểm Định Máy Móc & Thiết Bị Tự Động",
                        subtitle: "Tiêu chuẩn kiểm định cao cấp",
                        desc: "Hệ thống trang thiết bị hiện đại, đảm bảo quy trình kiểm định chính xác, khách quan và tin cậy tuyệt đối theo quy chuẩn quốc gia.",
                    },
                    en: {
                        title: "Automated Machinery & Equipment Inspection",
                        subtitle: "Premium Certified Standards",
                        desc: "State-of-the-art testing systems ensuring objective, precise, and fully compliant inspection procedures adhering to international standards.",
                    },
                }),
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop",
                linkUrl: "#services",
                order: 2,
                isActive: true,
                translations: JSON.stringify({
                    vi: {
                        title: "Quan Trắc & Đánh Giá Môi Trường Lao Động",
                        subtitle: "Bảo vệ sức khỏe người lao động",
                        desc: "Đo lường và phân tích chính xác vi khí hậu, tiếng ồn, bụi mịn, hơi khí độc hại tại các nhà xưởng, khu chế xuất và khu công nghiệp.",
                    },
                    en: {
                        title: "Workplace Environmental Monitoring & Assessment",
                        subtitle: "Protecting Occupational Health",
                        desc: "Accurate measurement and in-depth analysis of microclimate, noise, dust, and toxic emissions in industrial facilities.",
                    },
                }),
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop",
                linkUrl: "#services",
                order: 3,
                isActive: true,
                translations: JSON.stringify({
                    vi: {
                        title: "Chứng Nhận Hệ Thống Quản Lý ISO & Đào Tạo An Toàn",
                        subtitle: "Đội ngũ chuyên gia 10+ năm kinh nghiệm",
                        desc: "Tư vấn chứng nhận ISO 9001, 14001, 45001 và tổ chức các khóa huấn luyện an toàn vệ sinh lao động chuẩn hóa cho doanh nghiệp.",
                    },
                    en: {
                        title: "ISO Management System Certification & Safety Training",
                        subtitle: "Experienced Experts with 10+ Years",
                        desc: "Comprehensive consulting for ISO 9001, 14001, 45001 and standardized occupational health and safety training for enterprises.",
                    },
                }),
            },
        ];

        for (const slide of slidesData) {
            await prisma.slide.create({ data: slide });
        }
        console.log("✅ Hero Slides seeded");
    }

    // 5. DANH MỤC & MENU ĐIỀU HƯỚNG (Categories - Song ngữ)
    const existingCategories = await prisma.category.count();
    if (existingCategories === 0 || force) {
        // Xóa sạch để tạo bộ menu chuẩn nếu force = true
        if (force) {
            await prisma.service.deleteMany({});
            await prisma.category.deleteMany({});
        }

        // C1: Về WebCare
        const catAbout = await prisma.category.upsert({
            where: { slug: "ve-webcare" },
            update: {
                translations: JSON.stringify({
                    vi: { title: "Về WebCare" },
                    en: { title: "About WebCare" },
                }),
                isMenu: true,
                order: 1,
            },
            create: {
                slug: "ve-webcare",
                order: 1,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    vi: { title: "Về WebCare" },
                    en: { title: "About WebCare" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "gioi-thieu-chung" },
            update: { parentId: catAbout.id },
            create: {
                slug: "gioi-thieu-chung",
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: catAbout.id,
                translations: JSON.stringify({
                    vi: { title: "Giới thiệu chung" },
                    en: { title: "General Overview" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "tam-nhin-su-menh" },
            update: { parentId: catAbout.id },
            create: {
                slug: "tam-nhin-su-menh",
                order: 2,
                isActive: true,
                isMenu: true,
                parentId: catAbout.id,
                translations: JSON.stringify({
                    vi: { title: "Tầm nhìn & Sứ mệnh" },
                    en: { title: "Vision & Mission" },
                }),
            },
        });

        // C2: Kiểm định an toàn
        const catInspection = await prisma.category.upsert({
            where: { slug: "kiem-dinh-an-toan" },
            update: {
                translations: JSON.stringify({
                    vi: { title: "Kiểm định an toàn" },
                    en: { title: "Safety Inspection" },
                }),
                isMenu: true,
                order: 2,
            },
            create: {
                slug: "kiem-dinh-an-toan",
                order: 2,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    vi: { title: "Kiểm định an toàn" },
                    en: { title: "Safety Inspection" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "thiet-bi-ap-luc" },
            update: { parentId: catInspection.id },
            create: {
                slug: "thiet-bi-ap-luc",
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: catInspection.id,
                translations: JSON.stringify({
                    vi: { title: "Nồi hơi & Thiết bị áp lực" },
                    en: { title: "Boilers & Pressure Vessels" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "thiet-bi-nang" },
            update: { parentId: catInspection.id },
            create: {
                slug: "thiet-bi-nang",
                order: 2,
                isActive: true,
                isMenu: true,
                parentId: catInspection.id,
                translations: JSON.stringify({
                    vi: { title: "Thiết bị nâng hạ & Xe nâng" },
                    en: { title: "Lifting Gear & Forklifts" },
                }),
            },
        });

        // C3: Quan trắc môi trường
        const catEnvironment = await prisma.category.upsert({
            where: { slug: "quan-trac-moi-truong" },
            update: {
                translations: JSON.stringify({
                    vi: { title: "Quan trắc môi trường" },
                    en: { title: "Environmental Monitoring" },
                }),
                isMenu: true,
                order: 3,
            },
            create: {
                slug: "quan-trac-moi-truong",
                order: 3,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    vi: { title: "Quan trắc môi trường" },
                    en: { title: "Environmental Monitoring" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "moi-truong-lao-dong" },
            update: { parentId: catEnvironment.id },
            create: {
                slug: "moi-truong-lao-dong",
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: catEnvironment.id,
                translations: JSON.stringify({
                    vi: { title: "Môi trường lao động" },
                    en: { title: "Workplace Environment" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "khi-thai-nuoc-thai" },
            update: { parentId: catEnvironment.id },
            create: {
                slug: "khi-thai-nuoc-thai",
                order: 2,
                isActive: true,
                isMenu: true,
                parentId: catEnvironment.id,
                translations: JSON.stringify({
                    vi: { title: "Khí thải & Nước thải" },
                    en: { title: "Emission & Wastewater" },
                }),
            },
        });

        // C4: Chứng nhận hệ thống
        const catCert = await prisma.category.upsert({
            where: { slug: "chung-nhan-he-thong" },
            update: {
                translations: JSON.stringify({
                    vi: { title: "Chứng nhận hệ thống" },
                    en: { title: "System Certification" },
                }),
                isMenu: true,
                order: 4,
            },
            create: {
                slug: "chung-nhan-he-thong",
                order: 4,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    vi: { title: "Chứng nhận hệ thống" },
                    en: { title: "System Certification" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "chung-nhan-iso" },
            update: { parentId: catCert.id },
            create: {
                slug: "chung-nhan-iso",
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: catCert.id,
                translations: JSON.stringify({
                    vi: { title: "Chứng nhận ISO 9001 / 14001 / 45001" },
                    en: { title: "ISO 9001 / 14001 / 45001" },
                }),
            },
        });

        // C5: Đào tạo huấn luyện
        const catTraining = await prisma.category.upsert({
            where: { slug: "dao-tao-huan-luyen" },
            update: {
                translations: JSON.stringify({
                    vi: { title: "Huấn luyện an toàn" },
                    en: { title: "Safety Training" },
                }),
                isMenu: true,
                order: 5,
            },
            create: {
                slug: "dao-tao-huan-luyen",
                order: 5,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    vi: { title: "Huấn luyện an toàn" },
                    en: { title: "Safety Training" },
                }),
            },
        });

        await prisma.category.upsert({
            where: { slug: "an-toan-lao-dong" },
            update: { parentId: catTraining.id },
            create: {
                slug: "an-toan-lao-dong",
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: catTraining.id,
                translations: JSON.stringify({
                    vi: { title: "Huấn luyện Nhóm 1 - 6" },
                    en: { title: "Groups 1 - 6 Training" },
                }),
            },
        });

        console.log("✅ Categories & Submenus seeded");

        // 6. DỊCH VỤ CHI TIẾT (Services - Song ngữ)
        const servicesData = [
            // Dịch vụ cho Kiểm định an toàn
            {
                title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
                description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH.",
                imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 1,
                categoryId: catInspection.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Kiểm định Nồi hơi & Nồi đun nước nóng",
                        description: "Kiểm tra kỹ thuật an toàn định kỳ, bất thường nồi hơi và thiết bị sinh hơi theo QCVN 01:2008/BLĐTBXH.",
                    },
                    en: {
                        title: "Boilers & Water Heaters Inspection",
                        description: "Periodic technical safety inspection and compliance testing for industrial boilers under national regulations.",
                    },
                }),
            },
            {
                title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
                description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn.",
                imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 2,
                categoryId: catInspection.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Kiểm định Bình chịu áp lực & Bồn chứa khí",
                        description: "Thử thủy lực, siêu âm kiểm tra khuyết tật đường hàn và xác định áp suất làm việc tối đa an toàn.",
                    },
                    en: {
                        title: "Pressure Vessels & Gas Storage Tanks Inspection",
                        description: "Hydrostatic testing, weld ultrasonic inspection, and maximum safe operating pressure verification.",
                    },
                }),
            },
            {
                title: "Kiểm định Cần trục, Cổng trục & Xe nâng hàng",
                description: "Thử tải trọng tĩnh và động, kiểm tra hệ thống phanh an toàn, cơ cấu nâng hạ các thiết bị nâng công nghiệp.",
                imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 3,
                categoryId: catInspection.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Kiểm định Cần trục, Cổng trục & Xe nâng hàng",
                        description: "Thử tải trọng tĩnh và động, kiểm tra hệ thống phanh an toàn, cơ cấu nâng hạ các thiết bị nâng công nghiệp.",
                    },
                    en: {
                        title: "Industrial Cranes, Hoists & Forklifts Inspection",
                        description: "Static and dynamic load testing, safety brakes inspection, and mechanical lifting system audits.",
                    },
                }),
            },

            // Dịch vụ cho Quan trắc môi trường
            {
                title: "Quan trắc Môi trường lao động định kỳ",
                description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất.",
                imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 1,
                categoryId: catEnvironment.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Quan trắc Môi trường lao động định kỳ",
                        description: "Đo đạc vi khí hậu, tiếng ồn, ánh sáng, rung chấn, bụi mịn và hơi khí độc hại tại các phân xưởng sản xuất.",
                    },
                    en: {
                        title: "Periodic Workplace Environmental Monitoring",
                        description: "Comprehensive measurement of microclimate, noise levels, illumination, dust, and toxic fumes across factories.",
                    },
                }),
            },
            {
                title: "Đo kiểm Phân loại điều kiện lao động",
                description: "Đánh giá và lập hồ sơ phân loại điều kiện lao động nặng nhọc, độc hại, nguy hiểm theo Thông tư 29/2021/TT-BLĐTBXH.",
                imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 2,
                categoryId: catEnvironment.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Đo kiểm Phân loại điều kiện lao động",
                        description: "Đánh giá và lập hồ sơ phân loại điều kiện lao động nặng nhọc, độc hại, nguy hiểm theo Thông tư 29/2021/TT-BLĐTBXH.",
                    },
                    en: {
                        title: "Working Condition Hazard Classification",
                        description: "Professional profiling and assessment of hazardous, strenuous, and dangerous occupational conditions.",
                    },
                }),
            },
            {
                title: "Đo kiểm Khí thải & Nước thải công nghiệp",
                description: "Lấy mẫu và phân tích các chỉ tiêu lý hóa của nguồn thải nhà máy đạt chuẩn QCVN trước khi xả thải ra môi trường.",
                imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 3,
                categoryId: catEnvironment.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Đo kiểm Khí thải & Nước thải công nghiệp",
                        description: "Lấy mẫu và phân tích các chỉ tiêu lý hóa của nguồn thải nhà máy đạt chuẩn QCVN trước khi xả thải ra môi trường.",
                    },
                    en: {
                        title: "Industrial Emission & Wastewater Testing",
                        description: "Sampling and laboratory physicochemical analysis of factory emissions to meet strict regulatory discharge limits.",
                    },
                }),
            },

            // Dịch vụ cho Chứng nhận hệ thống
            {
                title: "Chứng nhận ISO 9001:2015 & ISO 14001:2015",
                description: "Tư vấn xây dựng, áp dụng và đánh giá cấp chứng chỉ Hệ thống Quản lý Chất lượng và Quản lý Môi trường quốc tế.",
                imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 1,
                categoryId: catCert.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Chứng nhận ISO 9001:2015 & ISO 14001:2015",
                        description: "Tư vấn xây dựng, áp dụng và đánh giá cấp chứng chỉ Hệ thống Quản lý Chất lượng và Quản lý Môi trường quốc tế.",
                    },
                    en: {
                        title: "ISO 9001:2015 & ISO 14001:2015 Certification",
                        description: "Consulting, implementation, and audit for international Quality and Environmental Management Systems.",
                    },
                }),
            },
            {
                title: "Chứng nhận ISO 45001:2018 (An toàn Sức khỏe)",
                description: "Tiêu chuẩn quốc tế về hệ thống quản lý an toàn và sức khỏe nghề nghiệp, giảm thiểu rủi ro tai nạn lao động.",
                imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 2,
                categoryId: catCert.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Chứng nhận ISO 45001:2018 (An toàn Sức khỏe)",
                        description: "Tiêu chuẩn quốc tế về hệ thống quản lý an toàn và sức khỏe nghề nghiệp, giảm thiểu rủi ro tai nạn lao động.",
                    },
                    en: {
                        title: "ISO 45001:2018 Occupational Health & Safety",
                        description: "World-class standard for occupational health and safety management, minimizing workplace accidents.",
                    },
                }),
            },

            // Dịch vụ cho Đào tạo huấn luyện
            {
                title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
                description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP.",
                imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 1,
                categoryId: catTraining.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Huấn luyện An toàn vệ sinh lao động (Nhóm 1 - 6)",
                        description: "Đào tạo nghiệp vụ an toàn định kỳ và cấp thẻ/chứng chỉ theo đúng quy định tại Nghị định 44/2016/NĐ-CP.",
                    },
                    en: {
                        title: "Occupational Safety & Health Training (Groups 1 - 6)",
                        description: "Standardized safety courses and official certification per governmental occupational safety regulations.",
                    },
                }),
            },
            {
                title: "Huấn luyện Sơ cấp cứu & Phòng cháy chữa cháy",
                description: "Thực hành băng bó cứu thương, hô hấp nhân tạo, kỹ năng thoát hiểm và sử dụng trang thiết bị chữa cháy tại chỗ.",
                imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
                linkUrl: "#",
                order: 2,
                categoryId: catTraining.id,
                translations: JSON.stringify({
                    vi: {
                        title: "Huấn luyện Sơ cấp cứu & Phòng cháy chữa cháy",
                        description: "Thực hành băng bó cứu thương, hô hấp nhân tạo, kỹ năng thoát hiểm và sử dụng trang thiết bị chữa cháy tại chỗ.",
                    },
                    en: {
                        title: "Workplace First Aid & Fire Fighting Drills",
                        description: "Hands-on emergency wound care, CPR, building evacuation drills, and practical firefighting equipment handling.",
                    },
                }),
            },
        ];

        for (const s of servicesData) {
            const exists = await prisma.service.findFirst({ where: { title: s.title } });
            if (!exists) {
                await prisma.service.create({ data: s });
            } else {
                await prisma.service.update({
                    where: { id: exists.id },
                    data: {
                        description: s.description,
                        translations: s.translations,
                        imageUrl: s.imageUrl,
                        categoryId: s.categoryId,
                    },
                });
            }
        }
        console.log("✅ 10 Bilingual Services seeded successfully");
    }

    console.log("🎉 Complete bilingual demo data ready!");
    return { success: true };
}
