import ContactPage from "@/components/ContactPage";
import { getSettings } from "@/lib/db";

export const metadata = {
    title: "Liên hệ | Suli Salon",
    description: "Liên hệ Suli Salon để được tư vấn và đặt lịch.",
};

export default async function Contact() {
    const settings = await getSettings();
    return <ContactPage settings={settings} />;
}
