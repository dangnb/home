import ContactPage from "@/components/ContactPage";
import { getSettings } from "@/lib/db";

export const metadata = {
    title: "Liên hệ | Mộc Salon",
    description: "Liên hệ Mộc Salon để được tư vấn và đặt lịch.",
};

export default async function Contact() {
    const settings = await getSettings();
    return <ContactPage settings={settings} />;
}
