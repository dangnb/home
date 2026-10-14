import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập quản trị | Mộc Salon",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
