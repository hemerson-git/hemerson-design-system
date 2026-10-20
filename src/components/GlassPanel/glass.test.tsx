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
  // jsdom has no layout, canvas or ResizeObserver: stand in for them, and load a fresh copy
  // of the module each time because the lens is turned on once per page
  const sizeOf = (element: HTMLElement, key: "width" | "height") => Number(element.dataset[key] ?? 0);
  let enable: typeof enableGlassRefraction;

  beforeEach(async () => {
    document.documentElement.removeAttribute("data-glass-refraction");
    document.getElementById("hds-glass-defs")?.remove();
    document.body.innerHTML = "";

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get() { return sizeOf(this, "width"); } });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get() { return sizeOf(this, "height"); } });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () =>
        ({
          createImageData: (width: number, height: number) => ({ data: new Uint8ClampedArray(width * height * 4) }),
          putImageData: () => {},
        }) as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,lens");
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );

    vi.resetModules();
    ({ enableGlassRefraction: enable } = await import("../../glass/enableGlassRefraction"));
  });

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
    Reflect.deleteProperty(HTMLElement.prototype, "offsetHeight");
    Reflect.deleteProperty(navigator, "userAgentData");
    vi.unstubAllGlobals();
  });

  const useChromium = () =>
    Object.defineProperty(navigator, "userAgentData", { value: { brands: [{ brand: "Chromium" }] }, configurable: true });

  const glass = (width: number, height: number, className = "hds-glass") => {
    const element = document.createElement("div");
    element.className = className;
    element.dataset.width = String(width);
    element.dataset.height = String(height);
    return element;
  };

  it("does nothing outside Chromium, where it would break the blur", () => {
    document.body.append(glass(600, 56));

    expect(enable()).toBe(false);
    expect(document.documentElement.hasAttribute("data-glass-refraction")).toBe(false);
    expect(document.getElementById("hds-glass-defs")).toBeNull();
  });

  it("stays off when the user reduces transparency", () => {
    useChromium();
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduced-transparency") }));

    expect(enable()).toBe(false);
  });

  it("gives every glass element a lens sized to it in Chromium", () => {
    useChromium();
    const bar = glass(600, 56);
    const knob = glass(120, 120);
    document.body.append(bar, knob);

    expect(enable()).toBe(true);

    expect(document.documentElement.hasAttribute("data-glass-refraction")).toBe(true);
    const barLens = bar.style.getPropertyValue("--hds-glass-lens");
    const knobLens = knob.style.getPropertyValue("--hds-glass-lens");
    expect(barLens).toMatch(/^url\(#hds-glass-lens-\d+\)$/);
    expect(knobLens).not.toBe(barLens);

    const filter = document.getElementById(barLens.slice(5, -1))!;
    expect(filter.getAttribute("width")).toBe("600");
    expect(filter.querySelector("feImage")?.getAttribute("href")).toBe("data:image/png;base64,lens");
  });

  it("shares one filter between glass elements of the same size", () => {
    useChromium();
    const first = glass(320, 48);
    const second = glass(320, 48);
    document.body.append(first, second);

    enable();

    expect(first.style.getPropertyValue("--hds-glass-lens")).toBe(second.style.getPropertyValue("--hds-glass-lens"));
    expect(document.querySelectorAll("#hds-glass-defs filter")).toHaveLength(1);
  });

  it("leaves thick glass alone: dialogs are too large to refract smoothly", () => {
    useChromium();
    const dialog = glass(560, 400, "hds-glass hds-glass--thick");
    document.body.append(dialog);

    enable();

    expect(dialog.style.getPropertyValue("--hds-glass-lens")).toBe("");
  });

  it("covers glass added after it was turned on", async () => {
    useChromium();
    enable();

    const toast = glass(380, 64);
    document.body.append(toast);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(toast.style.getPropertyValue("--hds-glass-lens")).toMatch(/^url\(#hds-glass-lens-\d+\)$/);
  });

  it("can be called more than once", () => {
    useChromium();
    document.body.append(glass(600, 56));

    expect(enable()).toBe(true);
    expect(enable()).toBe(true);
    expect(document.querySelectorAll("#hds-glass-defs")).toHaveLength(1);
  });
});
