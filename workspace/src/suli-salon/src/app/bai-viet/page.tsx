import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/routes";

export default function RootPostsPage() {
  redirect(getLocalizedPath(DEFAULT_LOCALE, "posts"));
}
