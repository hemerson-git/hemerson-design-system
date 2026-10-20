import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APPEARANCE_STORAGE_KEYS, applyStoredAppearance, setTheme } from "./appearance";
import { ThemeToggle, TransparencyToggle } from "../components/AppearanceToggles/AppearanceToggles";

const root = document.documentElement;

beforeEach(() => {
  localStorage.clear();
  root.removeAttribute("data-theme");
  root.removeAttribute("data-transparency");
  // A visitor whose system is set to light
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("light"), addEventListener() {}, removeEventListener() {} }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("applyStoredAppearance", () => {
  it("opens in the dark theme when nothing is saved, even on a light system", () => {
    expect(applyStoredAppearance()).toEqual({ theme: "dark", transparency: "full" });
    expect(root.getAttribute("data-theme")).toBe("dark");
    expect(root.hasAttribute("data-transparency")).toBe(false);
  });

  it("restores the saved theme and reduced transparency", () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.theme, "light");
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.transparency, "reduced");

    applyStoredAppearance();

    expect(root.getAttribute("data-theme")).toBe("light");
    expect(root.getAttribute("data-transparency")).toBe("reduced");
  });

  it("ignores values it doesn't know", () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.theme, "sepia");

    expect(applyStoredAppearance().theme).toBe("dark");
  });

  it("falls back to dark when storage is blocked, and still switches for the visit", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(applyStoredAppearance().theme).toBe("dark");
    setTheme("light");
    expect(root.getAttribute("data-theme")).toBe("light");
  });
});

describe("ThemeToggle", () => {
  it("starts dark and offers the light theme", () => {
    render(<ThemeToggle />);

    expect(root.getAttribute("data-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Mudar para o tema claro" })).toBeTruthy();
  });

  it("switches the theme, remembers it and updates its own label", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Mudar para o tema claro" }));

    expect(root.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEYS.theme)).toBe("light");
    expect(screen.getByRole("button", { name: "Mudar para o tema escuro" })).toBeTruthy();
  });

  it("keeps the saved theme after the app reloads", () => {
    const first = render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Mudar para o tema claro" }));
    first.unmount();
    root.removeAttribute("data-theme");

    applyStoredAppearance();
    render(<ThemeToggle />);

    expect(root.getAttribute("data-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Mudar para o tema escuro" })).toBeTruthy();
  });

  it("stays in sync when the theme changes elsewhere", () => {
    render(
      <>
        <ThemeToggle />
        <ThemeToggle lightLabel="Claro" darkLabel="Escuro" />
      </>
    );

    act(() => setTheme("light"));

    expect(screen.getByRole("button", { name: "Mudar para o tema escuro" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Escuro" })).toBeTruthy();
  });
});

describe("TransparencyToggle", () => {
  it("turns glass solid, says so through its pressed state and remembers it", () => {
    render(<TransparencyToggle />);
    const button = screen.getByRole("button", { name: "Reduzir transparência" });
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);

    expect(root.getAttribute("data-transparency")).toBe("reduced");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEYS.transparency)).toBe("reduced");

    fireEvent.click(button);
    expect(root.hasAttribute("data-transparency")).toBe(false);
  });

  it("changes transparency without touching the theme", () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.theme, "light");
    applyStoredAppearance();
    render(<TransparencyToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Reduzir transparência" }));

    expect(root.getAttribute("data-theme")).toBe("light");
  });
});
