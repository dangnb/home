import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminLoading from "../Admin/AdminLoading";

describe("AdminLoading component", () => {
  it("should render page variant with default label", () => {
    render(<AdminLoading variant="page" />);
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("should render table variant with custom label", () => {
    render(<AdminLoading variant="table" label="Đang tải danh sách lịch hẹn..." />);
    expect(screen.getByText("Đang tải danh sách lịch hẹn...")).toBeInTheDocument();
  });

  it("should render cards variant", () => {
    render(<AdminLoading variant="cards" label="Đang tải danh mục..." />);
    expect(screen.getByText("Đang tải danh mục...")).toBeInTheDocument();
  });

  it("should render grid variant without crashing", () => {
    render(<AdminLoading variant="grid" label="Đang tải bảng giá..." />);
    expect(screen.getByText("Đang tải bảng giá...")).toBeInTheDocument();
  });

  it("should render form variant", () => {
    render(<AdminLoading variant="form" label="Đang chuẩn bị form..." />);
    expect(screen.getByText("Đang chuẩn bị form...")).toBeInTheDocument();
  });
});
