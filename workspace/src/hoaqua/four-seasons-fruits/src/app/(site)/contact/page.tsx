// Contact Page - Displays store contact info from settings

import { getStoreSettings } from "@/actions/settings-actions";
import { ContactContent } from "./contact-content";

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return <ContactContent settings={settings} />;
}
