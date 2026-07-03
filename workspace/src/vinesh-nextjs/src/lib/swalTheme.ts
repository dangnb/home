import Swal from "sweetalert2";

/**
 * Custom SweetAlert2 theme — Glassmorphism & Smooth Animations
 * Dùng chung cho toàn bộ dự án.
 */

// 🔥 Mixin cho Toast nổi nhẹ (thông báo nhanh)
export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    showClass: {
        popup: "swal-toast-show",
    },
    hideClass: {
        popup: "swal-toast-hide",
    },
    customClass: {
        popup: "swal-toast-custom",
        timerProgressBar: "swal-timer-bar",
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

// 🎯 Mixin cho Dialog confirm (xóa, cập nhật, đăng xuất...)
export const ConfirmDialog = Swal.mixin({
    showCancelButton: true,
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
        popup: "swal-popup-custom",
        title: "swal-title-custom",
        htmlContainer: "swal-text-custom",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
        actions: "swal-actions-custom",
        icon: "swal-icon-custom",
    },
    showClass: {
        popup: "swal-popup-show",
        backdrop: "swal-backdrop-show",
    },
    hideClass: {
        popup: "swal-popup-hide",
        backdrop: "swal-backdrop-hide",
    },
});

// ⚠️ Confirm xóa (nguy hiểm — đỏ)
export const confirmDelete = (title = "Xóa mục này?", text = "Hành động này không thể hoàn tác!") => {
    return ConfirmDialog.fire({
        title,
        text,
        icon: "warning",
        confirmButtonText: '<i class="ph ph-trash"></i> Xóa luôn',
        cancelButtonText: '<i class="ph ph-arrow-left"></i> Giữ lại',
        customClass: {
            popup: "swal-popup-custom",
            title: "swal-title-custom",
            htmlContainer: "swal-text-custom",
            confirmButton: "swal-confirm-btn swal-confirm-danger",
            cancelButton: "swal-cancel-btn",
            actions: "swal-actions-custom",
            icon: "swal-icon-custom",
        },
    });
};

// ❓ Confirm hành động chung (xanh)
export const confirmAction = (title: string, text: string, confirmText = "Xác nhận") => {
    return ConfirmDialog.fire({
        title,
        text,
        icon: "question",
        confirmButtonText: `<i class="ph ph-check-circle"></i> ${confirmText}`,
        cancelButtonText: '<i class="ph ph-x"></i> Hủy',
    });
};

// ✅ Toast thành công
export const toastSuccess = (title = "Thành công!") => {
    return Toast.fire({ icon: "success", title });
};

// ❌ Toast lỗi
export const toastError = (title = "Có lỗi xảy ra!") => {
    return Toast.fire({ icon: "error", title });
};

// ⏳ Loading popup (full-screen)
export const showLoading = (title = "Đang xử lý...") => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: {
            popup: "swal-loading-popup",
            title: "swal-loading-title",
        },
        showClass: {
            popup: "swal-popup-show",
            backdrop: "swal-backdrop-show",
        },
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const hideLoading = () => Swal.close();
