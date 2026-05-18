import { generateSEO } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import ContactContent from "@/components/contact/ContactContent";

export const metadata = generateSEO({
  title: "Liên Hệ - Xe Ghép Nam Định – Đặt xe nhanh 24/7",
  description: "Thông tin liên hệ Xe Ghép Nam Định. Hotline: 0379.803.990. Địa chỉ: Số 2A Văn Cao, Tây Hồ, Hà Nội.",
  url: "https://xeghepnamdinh.vn/lien-he",
});

export const dynamic = "force-dynamic";

async function getContactConfig() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const configMap: Record<string, string> = {};
    configs.forEach((c) => {
      configMap[c.key] = c.value;
    });
    return configMap;
  } catch {
    return {};
  }
}

export default async function ContactPage() {
  const config = await getContactConfig();

  return <ContactContent config={config} />;
}
