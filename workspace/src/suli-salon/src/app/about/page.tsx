import AboutPage from "@/components/AboutPage";
import { getSettings, getTeamMembers } from "@/lib/db";

export const metadata = {
    title: "About Us | Suli Salon",
    description: "Learn about Suli Salon's story.",
};

export default async function About() {
    const settings = await getSettings();
    const team = await getTeamMembers();
    return <AboutPage settings={settings} team={team} />;
}
