import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Menu } from "./Menu";

afterEach(cleanup);

const renderAccountMenu = () =>
  render(
    <Menu
      label="Conta de Ana Paula"
      header={
        <>
          <strong>Ana Paula</strong>
          <small>ana@example.com</small>
        </>
      }
      items={[{ label: "Tema claro" }, { separator: true }, { label: "Sair" }]}
    />
  );

const open = () => fireEvent.click(screen.getByRole("button", { name: "Conta de Ana Paula" }));

describe("Menu header", () => {
  it("shows the header above the actions", () => {
    renderAccountMenu();
    open();

    const menu = screen.getByRole("menu");
    expect(within(menu).getByText("Ana Paula")).toBeTruthy();
    expect(within(menu).getByText("ana@example.com")).toBeTruthy();
  });

  it("describes the menu with it, for screen readers", () => {
    renderAccountMenu();
    open();

    const menu = screen.getByRole("menu");
    const description = document.getElementById(menu.getAttribute("aria-describedby") ?? "");
    expect(description?.textContent).toBe("Ana Paulaana@example.com");
  });

  it("is not an item: focus starts on the first action and arrows skip the header", () => {
    renderAccountMenu();
    open();

    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Tema claro", "Sair"]);
    expect(document.activeElement?.textContent).toBe("Tema claro");

    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
    expect(document.activeElement?.textContent).toBe("Sair");
  });

  it("leaves menus without a header as they were", () => {
    render(<Menu label="Ações" items={[{ label: "Editar" }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Ações" }));

    expect(screen.getByRole("menu").hasAttribute("aria-describedby")).toBe(false);
    expect(screen.queryAllByRole("separator")).toHaveLength(0);
  });

  it("keeps the menu free of accessibility violations", async () => {
    renderAccountMenu();
    open();

    const results = await axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
