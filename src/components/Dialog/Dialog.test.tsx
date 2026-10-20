import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

afterEach(cleanup);

function Example({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    onClose();
    setOpen(false);
  };
  return (
    <>
      <button onClick={() => setOpen(true)}>Excluir boleto</button>
      <Dialog
        open={open}
        onClose={close}
        title="Excluir boleto?"
        description="Essa ação não pode ser desfeita."
        footer={
          <>
            <button onClick={close}>Cancelar</button>
            <button onClick={close}>Excluir</button>
          </>
        }
      />
    </>
  );
}

const openDialog = () => fireEvent.click(screen.getByRole("button", { name: "Excluir boleto" }));
const pressKey = (key: string, shiftKey = false) => fireEvent.keyDown(document, { key, shiftKey });

describe("Dialog", () => {
  it("renders nothing while closed", () => {
    render(<Example />);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is a labelled, described modal of thick glass", () => {
    render(<Example />);
    openDialog();

    const dialog = screen.getByRole("dialog", { name: "Excluir boleto?" });

    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.classList.contains("hds-glass--thick")).toBe(true);
    expect(document.getElementById(dialog.getAttribute("aria-describedby")!)?.textContent).toBe("Essa ação não pode ser desfeita.");
  });

  it("moves focus inside when it opens", () => {
    render(<Example />);
    openDialog();

    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });

  it("keeps Tab inside the dialog in both directions", () => {
    render(<Example />);
    openDialog();
    const close = screen.getByRole("button", { name: "Fechar" });
    const confirm = screen.getByRole("button", { name: "Excluir" });

    confirm.focus();
    pressKey("Tab");
    expect(document.activeElement).toBe(close);

    pressKey("Tab", true);
    expect(document.activeElement).toBe(confirm);
  });

  it("closes on Escape and returns focus to the button that opened it", () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    const opener = screen.getByRole("button", { name: "Excluir boleto" });
    opener.focus();
    openDialog();

    act(() => pressKey("Escape"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("closes on a click outside the panel but not inside it", () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    openDialog();

    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(document.querySelector(".hds-scrim")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stops the page behind from scrolling while open", () => {
    render(<Example />);
    openDialog();
    expect(document.body.style.overflow).toBe("hidden");

    act(() => pressKey("Escape"));
    expect(document.body.style.overflow).toBe("");
  });
});
