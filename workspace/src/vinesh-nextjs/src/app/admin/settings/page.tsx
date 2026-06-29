import prisma from "@/lib/prisma";
import { updateSettings } from "../actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
    const settingsArray = await prisma.setting.findMany();
    const settings = settingsArray.reduce((acc: Record<string, string>, current: { key: string; value: string }) => {
        acc[current.key] = current.value;
        return acc;
    }, {});

    // Fetch languages from DB
    const langRecords = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const languages = langRecords.map(l => l.code);
    // Ensure "vi" is always at top if present
    languages.sort((a, b) => a === 'vi' ? -1 : b === 'vi' ? 1 : 0);

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Cấu hình Đa Ngôn Ngữ & SEO</h1>
            </div>

            <SettingsForm settings={settings} languages={languages} action={updateSettings} />
        </div>
    );
}
