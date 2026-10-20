import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateInput } from "./DateInput";
import { Dialog } from "../Dialog/Dialog";
import { parseTyped } from "./dates";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 20, 12, 0));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Controlled({ initial = "", onChange = () => {}, ...props }: { initial?: string; onChange?: (value: string) => void; min?: string; max?: string; name?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <form aria-label="Boleto">
      <DateInput
        {...props}
        label="Vencimento"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
      />
      <output>{value}</output>
    </form>
  );
}

const field = () => screen.getByLabelText("Vencimento") as HTMLInputElement;
const openCalendar = () => fireEvent.click(screen.getByRole("button", { name: "Abrir calendário" }));
const calendar = () => screen.getByRole("dialog");
const day = (name: RegExp) => within(calendar()).getByRole("button", { name });
const press = (key: string, shiftKey = false) => fireEvent.keyDown(document.activeElement!, { key, shiftKey });

describe("DateInput typing", () => {
  it("shows the value as dd/mm/aaaa", () => {
    render(<Controlled initial="2026-03-05" />);

    expect(field().value).toBe("05/03/2026");
  });

  it("reports a whole typed date as yyyy-mm-dd", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    fireEvent.change(field(), { target: { value: "10/1" } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(field(), { target: { value: "10/11/2026" } });
    expect(onChange).toHaveBeenLastCalledWith("2026-11-10");
  });

  it.each([
    ["1/2/2026", "2026-02-01"],
    ["01022026", "2026-02-01"],
    ["29/02/2028", "2028-02-29"],
    ["31/04/2026", null],
    ["29/02/2026", null],
    ["2026-02-01", null],
  ])("reads %s as %s", (typed, expected) => {
    expect(parseTyped(typed)).toBe(expected);
  });

  it("goes back to the last valid date when left with an impossible one", () => {
    const onChange = vi.fn();
    render(<Controlled initial="2026-10-10" onChange={onChange} />);

    fireEvent.change(field(), { target: { value: "31/04/2026" } });
    fireEvent.blur(field());

    expect(onChange).not.toHaveBeenCalled();
    expect(field().value).toBe("10/10/2026");
  });

  it("clears the value when the field is emptied", () => {
    const onChange = vi.fn();
    render(<Controlled initial="2026-10-10" onChange={onChange} />);

    fireEvent.change(field(), { target: { value: "" } });

    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("refuses typed dates outside min and max", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} min="2026-10-05" max="2026-10-25" />);

    fireEvent.change(field(), { target: { value: "01/10/2026" } });
    fireEvent.change(field(), { target: { value: "26/10/2026" } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(field(), { target: { value: "05/10/2026" } });
    expect(onChange).toHaveBeenLastCalledWith("2026-10-05");
  });

  it("follows a value changed from outside", () => {
    const { rerender } = render(<DateInput label="Vencimento" value="2026-10-10" onChange={() => {}} />);

    rerender(<DateInput label="Vencimento" value="2026-12-25" onChange={() => {}} />);

    expect(field().value).toBe("25/12/2026");
  });

  it("sends yyyy-mm-dd with the form under its name", () => {
    render(<Controlled initial="2026-10-10" name="expiryDate" />);

    const data = new FormData(screen.getByRole("form", { name: "Boleto" }) as HTMLFormElement);

    expect(data.get("expiryDate")).toBe("2026-10-10");
  });
});

describe("DateInput calendar", () => {
  it("opens on the month of the value, with that day selected and today marked", () => {
    render(<Controlled initial="2026-10-10" />);

    openCalendar();

    expect(within(calendar()).getByRole("heading").textContent).toBe("Outubro de 2026");
    expect(day(/^sábado, 10 de outubro de 2026$/).closest("td")?.getAttribute("aria-selected")).toBe("true");
    expect(day(/^terça-feira, 20 de outubro de 2026$/).getAttribute("aria-current")).toBe("date");
    expect(document.activeElement).toBe(day(/^sábado, 10 de outubro de 2026$/));
  });

  it("opens on today when empty", () => {
    render(<Controlled />);

    openCalendar();

    expect(document.activeElement).toBe(day(/^terça-feira, 20 de outubro de 2026$/));
  });

  it("picks a day with a click, closes and returns focus to the button", () => {
    const onChange = vi.fn();
    render(<Controlled initial="2026-10-10" onChange={onChange} />);

    openCalendar();
    fireEvent.click(day(/ 15 de outubro de 2026$/));

    expect(onChange).toHaveBeenLastCalledWith("2026-10-15");
    expect(field().value).toBe("15/10/2026");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir calendário" }));
  });

  it("moves by day, week and month with the keyboard", () => {
    render(<Controlled initial="2026-10-10" />);
    openCalendar();

    act(() => press("ArrowRight"));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/ 11 de outubro de 2026$/);

    act(() => press("ArrowDown"));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/ 18 de outubro de 2026$/);

    act(() => press("PageDown"));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/ 18 de novembro de 2026$/);
    expect(within(calendar()).getByRole("heading").textContent).toBe("Novembro de 2026");

    act(() => press("PageUp", true));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/ 18 de novembro de 2025$/);
  });

  it("keeps the day within shorter months", () => {
    render(<Controlled initial="2026-01-31" />);
    openCalendar();

    act(() => press("PageDown"));

    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/ 28 de fevereiro de 2026$/);
  });

  it("jumps to the start and end of the week, Sunday to Saturday", () => {
    render(<Controlled initial="2026-10-14" />);
    openCalendar();

    act(() => press("Home"));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/^domingo, 11 de outubro/);

    act(() => press("End"));
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/^sábado, 17 de outubro/);
  });

  it("changes month with the arrow buttons", () => {
    render(<Controlled initial="2026-10-10" />);
    openCalendar();

    fireEvent.click(screen.getByRole("button", { name: "Próximo mês" }));
    expect(within(calendar()).getByRole("heading").textContent).toBe("Novembro de 2026");

    fireEvent.click(screen.getByRole("button", { name: "Mês anterior" }));
    fireEvent.click(screen.getByRole("button", { name: "Mês anterior" }));
    expect(within(calendar()).getByRole("heading").textContent).toBe("Setembro de 2026");
  });

  it("closes on Escape without changing the value", () => {
    const onChange = vi.fn();
    render(<Controlled initial="2026-10-10" onChange={onChange} />);
    openCalendar();

    act(() => press("Escape"));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir calendário" }));
  });

  it("closes on a click outside", () => {
    render(<Controlled initial="2026-10-10" />);
    openCalendar();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("won't pick days outside min and max", () => {
    const onChange = vi.fn();
    render(<Controlled initial="2026-10-10" onChange={onChange} min="2026-10-05" max="2026-10-25" />);
    openCalendar();

    const early = day(/ 4 de outubro de 2026$/);
    expect(early.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(early);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("disables both the field and the calendar button", () => {
    render(<DateInput label="Vencimento" disabled />);

    expect(field().disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Abrir calendário" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("has no accessibility violations with the calendar open", async () => {
    vi.useRealTimers();
    render(<Controlled initial="2026-10-10" />);
    openCalendar();

    const results = await axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

describe("DateInput in a dialog", () => {
  function InDialog({ onClose }: { onClose: () => void }) {
    return (
      <Dialog open onClose={onClose} title="Novo boleto">
        <DateInput label="Vencimento" defaultValue="2026-10-10" />
      </Dialog>
    );
  }

  it("closes only the calendar on Escape", () => {
    const onClose = vi.fn();
    render(<InDialog onClose={onClose} />);
    openCalendar();

    fireEvent.keyDown(document.activeElement!, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /Outubro/ })).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Novo boleto" })).toBeTruthy();
  });

  it("closes the dialog on the next Escape", () => {
    const onClose = vi.fn();
    render(<InDialog onClose={onClose} />);
    openCalendar();

    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps focus inside the dialog on Tab", () => {
    render(<InDialog onClose={() => {}} />);
    openCalendar();

    fireEvent.keyDown(document.activeElement!, { key: "Tab" });

    expect(screen.getByRole("dialog", { name: "Novo boleto" }).contains(document.activeElement)).toBe(true);
  });
});
