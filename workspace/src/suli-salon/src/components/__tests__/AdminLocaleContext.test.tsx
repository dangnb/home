import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AdminLocaleProvider,
  useAdminLocale,
  AdminLanguageSelector,
} from "../Admin/AdminLocaleContext";

function TestConsumer() {
  const { locale, setLocale, t, tOther, splitBilingual, joinBilingual } = useAdminLocale();

  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="text-t">{t("Móng Tay Đẹp | Beautiful Nails")}</span>
      <span data-testid="text-tOther">{tOther("Móng Tay Đẹp | Beautiful Nails")}</span>
      <span data-testid="split-vi">{splitBilingual("Sơn Gel | Gel Polish").vi}</span>
      <span data-testid="split-en">{splitBilingual("Sơn Gel | Gel Polish").en}</span>
      <span data-testid="joined">{joinBilingual("Đắp Bột", "Acrylic")}</span>
      <button data-testid="btn-vi" onClick={() => setLocale("vi")}>VI</button>
      <button data-testid="btn-en" onClick={() => setLocale("en")}>EN</button>
      <AdminLanguageSelector />
    </div>
  );
}

describe("AdminLocaleContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default locale 'vi'", () => {
    render(
      <AdminLocaleProvider>
        <TestConsumer />
      </AdminLocaleProvider>
    );

    expect(screen.getByTestId("current-locale").textContent).toBe("vi");
    expect(screen.getByTestId("text-t").textContent).toBe("Móng Tay Đẹp");
    expect(screen.getByTestId("text-tOther").textContent).toBe("Beautiful Nails");
  });

  it("should switch to 'en' and update translations accordingly", async () => {
    const user = userEvent.setup();

    render(
      <AdminLocaleProvider>
        <TestConsumer />
      </AdminLocaleProvider>
    );

    await user.click(screen.getByTestId("btn-en"));

    expect(screen.getByTestId("current-locale").textContent).toBe("en");
    expect(screen.getByTestId("text-t").textContent).toBe("Beautiful Nails");
    expect(screen.getByTestId("text-tOther").textContent).toBe("Móng Tay Đẹp");
    expect(localStorage.getItem("moc_admin_locale")).toBe("en");
  });

  it("should split and join bilingual strings correctly", () => {
    render(
      <AdminLocaleProvider>
        <TestConsumer />
      </AdminLocaleProvider>
    );

    expect(screen.getByTestId("split-vi").textContent).toBe("Sơn Gel");
    expect(screen.getByTestId("split-en").textContent).toBe("Gel Polish");
    expect(screen.getByTestId("joined").textContent).toBe("Đắp Bột | Acrylic");
  });

  it("should support switching locale via AdminLanguageSelector", async () => {
    const user = userEvent.setup();

    render(
      <AdminLocaleProvider>
        <TestConsumer />
      </AdminLocaleProvider>
    );

    const enSelectorBtn = screen.getByRole("button", { name: /English/i });
    await user.click(enSelectorBtn);

    expect(screen.getByTestId("current-locale").textContent).toBe("en");
  });

  it("should provide safe fallbacks when useAdminLocale is used outside of provider", () => {
    function StandaloneComponent() {
      const { locale, t, splitBilingual, joinBilingual } = useAdminLocale();
      return (
        <div>
          <span data-testid="fallback-locale">{locale}</span>
          <span data-testid="fallback-t">{t("Móng | Nails")}</span>
          <span data-testid="fallback-split">{splitBilingual("Móng").vi}</span>
          <span data-testid="fallback-join">{joinBilingual("A", "B")}</span>
        </div>
      );
    }

    render(<StandaloneComponent />);
    expect(screen.getByTestId("fallback-locale").textContent).toBe("vi");
    expect(screen.getByTestId("fallback-t").textContent).toBe("Móng");
    expect(screen.getByTestId("fallback-split").textContent).toBe("Móng");
    expect(screen.getByTestId("fallback-join").textContent).toBe("A | B");
  });
});
