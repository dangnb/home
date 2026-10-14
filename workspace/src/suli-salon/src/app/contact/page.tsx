import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/routes";

export default function RootContactPage() {
  redirect(getLocalizedPath(DEFAULT_LOCALE, "contact"));
}
