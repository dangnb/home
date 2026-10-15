import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "../BookingForm";
import Swal from "sweetalert2";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("BookingForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render booking form fields and submit button", () => {
    render(<BookingForm standalone cruiseName="Chăm Sóc Móng Tay" />);

    expect(screen.getByText("Đặt Lịch Hẹn Làm Móng")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0796 768 636")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xác Nhận Đặt Lịch" })).toBeInTheDocument();
  });

  it("should submit form data successfully and trigger luxury SweetAlert modal", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    render(<BookingForm cruiseName="Sơn Gel" />);

    fireEvent.change(screen.getByPlaceholderText("Nguyễn Văn A"), { target: { value: "Nguyễn Hương Giang" } });
    fireEvent.change(screen.getByPlaceholderText("0796 768 636"), { target: { value: "0988654321" } });
    fireEvent.change(screen.getByPlaceholderText("email@example.com (không bắt buộc)"), { target: { value: "giang@example.com" } });

    // Date input
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: tomorrowStr } });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Xác Nhận Đặt Lịch" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/bookings", expect.objectContaining({
        method: "POST",
      }));
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Đặt lịch thành công!",
          icon: "success",
        })
      );
    });
  });

  it("should display error banner when server rejects booking", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Số điện thoại không hợp lệ" }),
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    render(<BookingForm cruiseName="Sơn Gel" />);

    fireEvent.change(screen.getByPlaceholderText("Nguyễn Văn A"), { target: { value: "Trần A" } });
    fireEvent.change(screen.getByPlaceholderText("0796 768 636"), { target: { value: "0123" } });

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: tomorrowStr } });

    fireEvent.click(screen.getByRole("button", { name: "Xác Nhận Đặt Lịch" }));

    await waitFor(() => {
      expect(screen.getByText("Số điện thoại không hợp lệ")).toBeInTheDocument();
    });
  });
});
