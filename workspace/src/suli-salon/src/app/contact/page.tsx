import ContactPage from "@/components/ContactPage";
import { getSettings } from "@/lib/db";

export const metadata = {
    title: "Contact Us | Suli Salon",
    description: "Get in touch with Suli Salon.",
};

export default async function Contact() {
    const settings = await getSettings();
    return <ContactPage settings={settings} />;
}
