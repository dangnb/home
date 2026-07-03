"use client";

import { confirmDelete, toastSuccess } from "@/lib/swalTheme";

export default function DeleteButton({ action }: { action: () => Promise<any> | void }) {
    return (
        <button
            type="button"
            className="admin-btn btn-danger"
            style={{ padding: "6px 12px" }}
            onClick={async () => {
                const result = await confirmDelete(
                    "Xóa nha sếp??",
                    "Sếp xóa xong là hệ thống bay màu mục này luôn khỏi tìm đó!"
                );

                if (result.isConfirmed) {
                    await action();
                    toastSuccess("Đã xóa bay hơi thành công!");
                }
            }}
        >
            <i className="ph ph-trash"></i>
        </button>
    );
}
