import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

import Swal from "sweetalert2";
import { confirmAction, notifySuccess, notifyError, notifyInfo } from "../confirmDialog";

describe("confirmDialog.ts - Custom Luxury Dialog Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("confirmAction", () => {
    it("should display danger modal with red confirm button when isDanger is true", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

      const confirmed = await confirmAction({
        title: "Xóa danh mục?",
        text: "Hành động này không thể hoàn tác",
        isDanger: true,
      });

      expect(confirmed).toBe(true);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Xóa danh mục?",
          text: "Hành động này không thể hoàn tác",
          icon: "warning",
          confirmButtonColor: "#99352A", // Ruby red
          customClass: expect.objectContaining({
            popup: "luxury-swal-popup",
            title: "luxury-swal-title",
          }),
        })
      );
    });

    it("should display gold button and question icon when isDanger is false", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false, isDenied: false, isDismissed: true });

      const confirmed = await confirmAction({
        title: "Lưu thay đổi?",
        text: "Bạn có muốn lưu thiết lập hiện tại?",
        isDanger: false,
      });

      expect(confirmed).toBe(false);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "question",
          confirmButtonColor: "#967840", // Champagne gold
        })
      );
    });
  });

  describe("notifySuccess", () => {
    it("should trigger Swal with success icon and auto-close timer", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

      await notifySuccess("Cập nhật thành công!", "Dữ liệu đã được lưu vào hệ thống.");

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Cập nhật thành công!",
          text: "Dữ liệu đã được lưu vào hệ thống.",
          icon: "success",
          timer: 2200,
          showConfirmButton: false,
          customClass: expect.objectContaining({
            popup: "luxury-swal-popup",
          }),
        })
      );
    });
  });

  describe("notifyError", () => {
    it("should trigger Swal with error icon and ruby button", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

      await notifyError("Lỗi hệ thống", "Không thể kết nối đến máy chủ.");

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Lỗi hệ thống",
          text: "Không thể kết nối đến máy chủ.",
          icon: "error",
          confirmButtonColor: "#99352A",
          confirmButtonText: "Đóng",
        })
      );
    });
  });

  describe("notifyInfo", () => {
    it("should trigger Swal with info icon and gold button", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });

      await notifyInfo("Hướng dẫn", "Vui lòng chọn khung giờ trống.");

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Hướng dẫn",
          text: "Vui lòng chọn khung giờ trống.",
          icon: "info",
          confirmButtonColor: "#967840",
          confirmButtonText: "Đã hiểu",
        })
      );
    });
  });
});
