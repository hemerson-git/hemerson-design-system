import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu } from "./Menu";

afterEach(cleanup);

function setup() {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  render(
    <>
      <Menu
        label="Ações"
        items={[
          { label: "Editar", onSelect: onEdit },
          { label: "Duplicar" },
          { separator: true },
          { label: "Excluir", danger: true, onSelect: onDelete },
        ]}
      />
      <p>Fora do menu</p>
    </>
  );
  const trigger = screen.getByRole("button", { name: "Ações" });
  return { trigger, onEdit, onDelete };
}

const press = (key: string) => fireEvent.keyDown(document.activeElement!, { key });

describe("Menu", () => {
  it("announces a collapsed menu on its trigger", () => {
    const { trigger } = setup();

    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens and focuses the first item", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Editar" }));
  });

  it("moves with the arrow keys, skipping separators, and wraps around", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    press("ArrowDown");
    expect(document.activeElement?.textContent).toBe("Duplicar");
    press("ArrowDown");
    expect(document.activeElement?.textContent).toBe("Excluir");
    press("ArrowDown");
    expect(document.activeElement?.textContent).toBe("Editar");
    press("ArrowUp");
    expect(document.activeElement?.textContent).toBe("Excluir");
  });

  it("jumps to the ends with Home and End", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    press("End");
    expect(document.activeElement?.textContent).toBe("Excluir");
    press("Home");
    expect(document.activeElement?.textContent).toBe("Editar");
  });

  it("runs the chosen action, closes and returns focus to the trigger", () => {
    const { trigger, onDelete } = setup();
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole("menuitem", { name: "Excluir" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    press("Escape");

    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when clicking outside", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    fireEvent.mouseDown(screen.getByText("Fora do menu"));

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("marks destructive items", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);

    expect(screen.getByRole("menuitem", { name: "Excluir" }).classList.contains("hds-menu-item--danger")).toBe(true);
  });
});
