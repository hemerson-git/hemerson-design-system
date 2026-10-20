import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Menu } from "./Menu";

// jsdom has no layout: give the trigger a position and the list a size
const VIEWPORT_HEIGHT = 600;
let triggerRect = { top: 100, bottom: 140, left: 200, right: 300 };

beforeEach(() => {
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: VIEWPORT_HEIGHT });
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return this.getAttribute("role") === "menu" ? 120 : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return this.getAttribute("role") === "menu" ? 180 : 0;
    },
  });
  HTMLElement.prototype.getBoundingClientRect = function () {
    return { ...triggerRect, width: triggerRect.right - triggerRect.left, height: triggerRect.bottom - triggerRect.top, x: triggerRect.left, y: triggerRect.top, toJSON() {} } as DOMRect;
  };
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document.documentElement, "clientHeight");
  Reflect.deleteProperty(document.documentElement, "clientWidth");
  Reflect.deleteProperty(HTMLElement.prototype, "offsetHeight");
  Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
  triggerRect = { top: 100, bottom: 140, left: 200, right: 300 };
});

const items = [{ label: "Editar" }, { separator: true as const }, { label: "Excluir", danger: true }];

function openMenuInside(container: "table" | "plain", align: "start" | "end" = "end") {
  render(
    container === "table" ? (
      <div data-testid="scroller" style={{ overflow: "auto", maxHeight: 80 }}>
        <Menu label="Ações" items={items} align={align} />
      </div>
    ) : (
      <Menu label="Ações" items={items} align={align} />
    )
  );
  fireEvent.click(screen.getByRole("button", { name: "Ações" }));
  return screen.getByRole("menu");
}

describe("Menu placement", () => {
  it("renders the list into <body>, so a scroll container can't clip it", () => {
    const menu = openMenuInside("table");

    expect(menu.parentElement).toBe(document.body);
    expect(screen.getByTestId("scroller").contains(menu)).toBe(false);
  });

  it("opens below the trigger when there is room", () => {
    const menu = openMenuInside("plain");

    expect(menu.style.top).toBe(`${140 + 8}px`);
    expect(menu.dataset.side).toBe("bottom");
  });

  it("opens above the trigger near the bottom of the window", () => {
    triggerRect = { top: 520, bottom: 560, left: 200, right: 300 };

    const menu = openMenuInside("plain");

    expect(menu.style.top).toBe(`${520 - 8 - 120}px`);
    expect(menu.dataset.side).toBe("top");
  });

  it("lines up with the trigger's right edge by default and its left edge with align start", () => {
    expect(openMenuInside("plain", "end").style.left).toBe(`${300 - 180}px`);
    cleanup();
    expect(openMenuInside("plain", "start").style.left).toBe("200px");
  });

  it("stays inside the window near its edges", () => {
    triggerRect = { top: 100, bottom: 140, left: 0, right: 40 };

    expect(openMenuInside("plain", "end").style.left).toBe("8px");
  });

  it("returns focus to the trigger on Tab, since the list sits at the end of the page", () => {
    openMenuInside("plain");

    fireEvent.keyDown(document.activeElement!, { key: "Tab" });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Ações" }));
  });

  it("does not close when clicking inside the list", () => {
    const menu = openMenuInside("plain");

    fireEvent.mouseDown(menu);

    expect(screen.queryByRole("menu")).not.toBeNull();
  });
});
