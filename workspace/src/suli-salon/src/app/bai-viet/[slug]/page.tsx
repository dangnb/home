import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getLocalizedPostPath } from "@/lib/i18n/routes";

export default async function RootPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(getLocalizedPostPath(DEFAULT_LOCALE, slug));
}
