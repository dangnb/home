import { Metadata } from "next";
import NewPageForm from "./NewPageForm";

export const metadata: Metadata = {
    title: "Tạo Trang mới - Admin",
};

export default function NewPage() {
    return <NewPageForm />;
}
