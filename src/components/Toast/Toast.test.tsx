import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Toast", () => {
  it("renders nothing while closed", () => {
    render(<Toast open={false} title="Boleto salvo" />);

    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is announced politely, and danger immediately", () => {
    const { rerender } = render(<Toast open tone="success" title="Boleto salvo" />);
    expect(screen.getByRole("status").textContent).toContain("Boleto salvo");

    rerender(<Toast open tone="danger" title="Não foi possível salvar" />);
    expect(screen.getByRole("alert").textContent).toContain("Não foi possível salvar");
  });

  it("closes itself after its duration", () => {
    const onClose = vi.fn();
    render(<Toast open title="Boleto salvo" duration={3000} onClose={onClose} />);

    act(() => vi.advanceTimersByTime(2999));
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("waits while the pointer is on it", () => {
    const onClose = vi.fn();
    render(<Toast open title="Boleto salvo" duration={3000} onClose={onClose} />);

    fireEvent.mouseEnter(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(10000));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseLeave(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(3000));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open with duration 0", () => {
    const onClose = vi.fn();
    render(<Toast open title="Boleto salvo" duration={0} onClose={onClose} />);

    act(() => vi.advanceTimersByTime(60000));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("can be closed with its button", () => {
    const onClose = vi.fn();
    render(<Toast open title="Boleto salvo" duration={0} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Fechar aviso" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has no close button when nothing can close it", () => {
    render(<Toast open title="Sincronizando" duration={0} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
