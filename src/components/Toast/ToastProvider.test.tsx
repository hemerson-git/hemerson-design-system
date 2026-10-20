import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast, type ToastApi } from "./ToastProvider";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

let toast: ToastApi;

function Capture() {
  const api = useToast();
  useEffect(() => {
    toast = api;
  }, [api]);
  return null;
}

function renderProvider(max?: number) {
  render(
    <ToastProvider max={max}>
      <Capture />
    </ToastProvider>
  );
}

const shown = () => Array.from(document.querySelectorAll(".hds-toast-title")).map((title) => title.textContent);

describe("ToastProvider", () => {
  it("shows nothing until a toast is raised", () => {
    renderProvider();

    expect(document.querySelector(".hds-toast-region")).toBeNull();
  });

  it("announces success politely and errors immediately, each with its tone", () => {
    renderProvider();

    act(() => {
      toast.success("Boleto salvo", "Fulano de Tal · R$ 10,00");
      toast.error("Não foi possível salvar");
    });

    const status = screen.getByRole("status");
    expect(within(status).getByText("Boleto salvo")).toBeTruthy();
    expect(within(status).getByText("Fulano de Tal · R$ 10,00")).toBeTruthy();
    expect(status.classList.contains("hds-toast--success")).toBe(true);
    expect(screen.getByRole("alert").classList.contains("hds-toast--danger")).toBe(true);
  });

  it("maps warning and info to their tones", () => {
    renderProvider();

    act(() => {
      toast.warning("Vence amanhã");
      toast.info("Lista atualizada");
    });

    expect(screen.getByText("Vence amanhã").closest(".hds-toast")?.classList.contains("hds-toast--warning")).toBe(true);
    expect(screen.getByText("Lista atualizada").closest(".hds-toast")?.classList.contains("hds-toast--neutral")).toBe(true);
  });

  it("stacks toasts in one region, newest last", () => {
    renderProvider();

    act(() => {
      toast.info("Primeiro");
      toast.info("Segundo");
    });

    expect(document.querySelectorAll(".hds-toast-region")).toHaveLength(1);
    expect(shown()).toEqual(["Primeiro", "Segundo"]);
  });

  it("keeps at most three, dropping the oldest", () => {
    renderProvider();

    act(() => {
      ["1", "2", "3", "4"].forEach((title) => toast.info(title));
    });

    expect(shown()).toEqual(["2", "3", "4"]);
  });

  it("can show more at once when asked", () => {
    renderProvider(5);

    act(() => {
      ["1", "2", "3", "4"].forEach((title) => toast.info(title));
    });

    expect(shown()).toEqual(["1", "2", "3", "4"]);
  });

  it("closes each toast on its own timer", () => {
    renderProvider();

    act(() => {
      toast.show({ title: "Curto", duration: 1000 });
      toast.show({ title: "Longo", duration: 5000 });
    });
    act(() => vi.advanceTimersByTime(1000));

    expect(shown()).toEqual(["Longo"]);

    act(() => vi.advanceTimersByTime(4000));
    expect(document.querySelector(".hds-toast-region")).toBeNull();
  });

  it("keeps a toast with duration 0 until it is dismissed, by id or by its button", () => {
    renderProvider();
    let id = "";

    act(() => {
      id = toast.show({ title: "Sincronizando", duration: 0 });
      toast.show({ title: "Fixo", duration: 0 });
    });
    act(() => vi.advanceTimersByTime(60000));
    expect(shown()).toEqual(["Sincronizando", "Fixo"]);

    act(() => toast.dismiss(id));
    expect(shown()).toEqual(["Fixo"]);

    fireEvent.click(screen.getByRole("button", { name: "Fechar aviso" }));
    expect(shown()).toEqual([]);
  });

  it("pauses a toast's timer while the pointer is on it", () => {
    renderProvider();

    act(() => {
      toast.show({ title: "Leia com calma", duration: 2000 });
    });
    fireEvent.mouseEnter(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(10000));

    expect(shown()).toEqual(["Leia com calma"]);
  });

  it("tells the developer when useToast is used outside a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Capture />)).toThrow("useToast must be used inside a ToastProvider.");
  });
});
