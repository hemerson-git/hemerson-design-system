import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlassPanel } from "./GlassPanel";
import { NavBar } from "../NavBar/NavBar";
import { Sidebar } from "../Sidebar/Sidebar";
import { FloatingButton } from "../FloatingButton/FloatingButton";
import { Badge } from "../Badge/Badge";
import { enableGlassRefraction } from "../../glass/enableGlassRefraction";

afterEach(cleanup);

describe("GlassPanel", () => {
  it("renders the requested element with the tone's class", () => {
    render(
      <GlassPanel as="aside" tone="thick" aria-label="Painel">
        Conteúdo
      </GlassPanel>
    );
    const panel = screen.getByRole("complementary", { name: "Painel" });

    expect(panel.className).toBe("hds-glass hds-glass--thick");
  });

  it("uses plain hds-glass for the regular tone", () => {
    render(<GlassPanel data-testid="panel" />);

    expect(screen.getByTestId("panel").className).toBe("hds-glass");
  });
});

describe("NavBar", () => {
  it("is a glass banner with a named navigation and the current page marked", () => {
    render(
      <NavBar title="Ticket Manager" actions={<button>Novo</button>}>
        <NavBar.Link href="#boletos" active>
          Boletos
        </NavBar.Link>
        <NavBar.Link href="#relatorios">Relatórios</NavBar.Link>
      </NavBar>
    );

    expect(screen.getByRole("banner").classList.contains("hds-glass")).toBe(true);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Boletos" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Relatórios" }).getAttribute("aria-current")).toBeNull();
  });
});

describe("Sidebar", () => {
  it("names every icon item and marks the current one", () => {
    const onSettings = vi.fn();
    render(
      <Sidebar
        items={[
          { label: "Boletos", icon: <svg />, href: "#boletos", active: true },
          { label: "Ajustes", icon: <svg />, onClick: onSettings },
        ]}
      />
    );

    expect(screen.getByRole("navigation", { name: "Navegação" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Boletos" }).getAttribute("aria-current")).toBe("page");
    screen.getByRole("button", { name: "Ajustes" }).click();
    expect(onSettings).toHaveBeenCalledTimes(1);
  });
});

describe("FloatingButton", () => {
  it("is a named glass button at the chosen corner", () => {
    render(
      <FloatingButton label="Voltar ao topo" position="top-left">
        <svg />
      </FloatingButton>
    );
    const button = screen.getByRole("button", { name: "Voltar ao topo" });

    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("hds-glass");
    expect(button.className).toContain("hds-fab--top-left");
  });
});

describe("Badge", () => {
  it("shows the status icon by default and none for neutral", () => {
    render(
      <>
        <Badge tone="danger">Vencido</Badge>
        <Badge>12 boletos</Badge>
        <Badge tone="success" icon={false}>
          Pago
        </Badge>
      </>
    );

    expect(screen.getByText("Vencido").querySelector("svg")).not.toBeNull();
    expect(screen.getByText("12 boletos").querySelector("svg")).toBeNull();
    expect(screen.getByText("Pago").querySelector("svg")).toBeNull();
  });
});

describe("enableGlassRefraction", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-glass-refraction");
    document.getElementById("hds-glass-defs")?.remove();
  });

  it("does nothing outside Chromium, where it would break the blur", () => {
    expect(enableGlassRefraction()).toBe(false);
    expect(document.documentElement.hasAttribute("data-glass-refraction")).toBe(false);
    expect(document.getElementById("hds-glass-defs")).toBeNull();
  });

  it("adds the filter once in Chromium", () => {
    Object.defineProperty(navigator, "userAgentData", { value: { brands: [{ brand: "Chromium" }] }, configurable: true });

    expect(enableGlassRefraction()).toBe(true);
    enableGlassRefraction();

    expect(document.documentElement.hasAttribute("data-glass-refraction")).toBe(true);
    expect(document.querySelectorAll("#hds-glass-distortion")).toHaveLength(1);

    Reflect.deleteProperty(navigator, "userAgentData");
  });

  it("stays off when the user reduces transparency", () => {
    Object.defineProperty(navigator, "userAgentData", { value: { brands: [{ brand: "Chromium" }] }, configurable: true });
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduced-transparency") }));

    expect(enableGlassRefraction()).toBe(false);

    vi.unstubAllGlobals();
    Reflect.deleteProperty(navigator, "userAgentData");
  });
});
