import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Button", () => {
  it("is a plain button by default, so it never submits a form by accident", () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <Button>Salvar</Button>
      </form>
    );

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByRole("button")).toHaveProperty("type", "button");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits when asked to", () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
        <Button type="submit">Salvar</Button>
      </form>
    );

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("runs its action when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Novo boleto</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Novo boleto" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("blocks clicks and reports progress while loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Salvando
      </Button>
    );

    const button = screen.getByRole("button", { name: "Salvando" });
    fireEvent.click(button);

    expect(button).toHaveProperty("disabled", true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("names an icon-only button by its aria-label and hides the text", () => {
    render(
      <Button iconOnly aria-label="Editar" icon={<svg data-testid="icon" />}>
        Editar boleto
      </Button>
    );

    const button = screen.getByRole("button", { name: "Editar" });

    expect(button.textContent).toBe("");
    expect(screen.getByTestId("icon")).toBeTruthy();
  });

  it("warns when an icon-only button has no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Button iconOnly icon={<svg />} />);

    expect(warn).toHaveBeenCalledWith("Button: an icon-only button needs an aria-label.");
  });

  it("is made of glass only in the glass variant", () => {
    render(
      <>
        <Button variant="glass">Vidro</Button>
        <Button variant="primary">Sólido</Button>
      </>
    );

    expect(screen.getByRole("button", { name: "Vidro" }).classList.contains("hds-glass")).toBe(true);
    expect(screen.getByRole("button", { name: "Sólido" }).classList.contains("hds-glass")).toBe(false);
  });

  it("forwards its ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Foco</Button>);

    expect(ref.current).toBe(screen.getByRole("button", { name: "Foco" }));
  });
});
