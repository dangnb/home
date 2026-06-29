"use client";

import Swal from "sweetalert2";

export default function DeleteButton({ action }: { action: () => Promise<any> | void }) {
    return (
        <button
            type="button"
            className="admin-btn btn-danger"
            style={{ padding: "6px 12px" }}
            onClick={async () => {
                const result = await Swal.fire({
                    title: 'Xóa nha sếp??',
                    text: "Sếp xóa xong là hệ thống bay màu mục này luôn khỏi tìm đó!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'Tôi chắc, Xóa luôn!',
                    cancelButtonText: 'Giữ lại'
                });

                if (result.isConfirmed) {
                    await action();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Đã xóa bay hơi thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }}
        >
            <i className="ph ph-trash"></i>
        </button>
    );
}
