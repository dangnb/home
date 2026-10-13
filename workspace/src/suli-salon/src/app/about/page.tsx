import AboutPage from "@/components/AboutPage";
import { getSettings, getTeamMembers } from "@/lib/db";

export const metadata = {
    title: "Giới thiệu | Suli Salon",
    description: "Khám phá câu chuyện và giá trị của Suli Salon.",
};

export default async function About() {
    const settings = await getSettings();
    const team = await getTeamMembers();
    return <AboutPage settings={settings} team={team} />;
}
