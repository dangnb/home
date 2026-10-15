// src/lib/confirmDialog.ts
import Swal from "sweetalert2";

interface ConfirmOptions {
  title?: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
}

/**
 * Hiển thị hộp thoại xác nhận sang trọng (thay thế hoàn toàn window.confirm thô của browser)
 */
export async function confirmAction({
  title = "Xác nhận hành động",
  text,
  confirmButtonText = "Đồng ý",
  cancelButtonText = "Hủy bỏ",
  isDanger = true,
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: isDanger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonColor: isDanger ? "#99352A" : "#967840",
    cancelButtonColor: "#857567",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    background: "#FDFBF7",
    color: "#2C2219",
    backdrop: "rgba(20, 16, 12, 0.65)",
    customClass: {
      popup: "luxury-swal-popup",
      title: "luxury-swal-title",
      htmlContainer: "luxury-swal-text",
      confirmButton: "luxury-swal-confirm-btn",
      cancelButton: "luxury-swal-cancel-btn",
    },
    showClass: {
      popup: "swal2-show luxury-swal-animate-in",
      backdrop: "swal2-backdrop-show",
    },
    hideClass: {
      popup: "swal2-hide luxury-swal-animate-out",
      backdrop: "swal2-backdrop-hide",
    },
  });

  return result.isConfirmed;
}

/**
 * Hiển thị thông báo thành công sang trọng
 */
export async function notifySuccess(title: string, text?: string): Promise<void> {
  await Swal.fire({
    title,
    text,
    icon: "success",
    timer: 2200,
    showConfirmButton: false,
    background: "#FDFBF7",
    color: "#2C2219",
    backdrop: "rgba(20, 16, 12, 0.45)",
    customClass: {
      popup: "luxury-swal-popup",
      title: "luxury-swal-title",
      htmlContainer: "luxury-swal-text",
    },
    showClass: {
      popup: "swal2-show luxury-swal-animate-in",
      backdrop: "swal2-backdrop-show",
    },
    hideClass: {
      popup: "swal2-hide luxury-swal-animate-out",
      backdrop: "swal2-backdrop-hide",
    },
  });
}

/**
 * Hiển thị thông báo lỗi sang trọng
 */
export async function notifyError(title: string, text?: string): Promise<void> {
  await Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#99352A",
    confirmButtonText: "Đóng",
    background: "#FDFBF7",
    color: "#2C2219",
    backdrop: "rgba(20, 16, 12, 0.45)",
    customClass: {
      popup: "luxury-swal-popup",
      title: "luxury-swal-title",
      htmlContainer: "luxury-swal-text",
      confirmButton: "luxury-swal-confirm-btn",
    },
    showClass: {
      popup: "swal2-show luxury-swal-animate-in",
      backdrop: "swal2-backdrop-show",
    },
    hideClass: {
      popup: "swal2-hide luxury-swal-animate-out",
      backdrop: "swal2-backdrop-hide",
    },
  });
}

/**
 * Hiển thị thông tin hoặc cảnh báo sang trọng
 */
export async function notifyInfo(title: string, text?: string): Promise<void> {
  await Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonColor: "#967840",
    confirmButtonText: "Đã hiểu",
    background: "#FDFBF7",
    color: "#2C2219",
    backdrop: "rgba(20, 16, 12, 0.45)",
    customClass: {
      popup: "luxury-swal-popup",
      title: "luxury-swal-title",
      htmlContainer: "luxury-swal-text",
      confirmButton: "luxury-swal-confirm-btn",
    },
    showClass: {
      popup: "swal2-show luxury-swal-animate-in",
      backdrop: "swal2-backdrop-show",
    },
    hideClass: {
      popup: "swal2-hide luxury-swal-animate-out",
      backdrop: "swal2-backdrop-hide",
    },
  });
}
