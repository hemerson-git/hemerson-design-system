import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { matchSuggestions, Typeahead } from "./Typeahead";
import { Dialog } from "../Dialog/Dialog";

afterEach(cleanup);

const recipients = ["Banco do Brasil", "Banco Inter", "Caixa Econômica", "São Paulo Previdência", "Bradesco Seguros"];

function Controlled({ onChange = () => {}, suggestions = recipients }: { onChange?: (value: string) => void; suggestions?: string[] }) {
  const [value, setValue] = useState("");
  return (
    <Typeahead
      label="Beneficiário"
      suggestions={suggestions}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

const field = () => screen.getByRole("combobox", { name: "Beneficiário" }) as HTMLInputElement;
const type = (text: string) => fireEvent.change(field(), { target: { value: text } });
const options = () => screen.queryAllByRole("option").map((option) => option.textContent);
const press = (key: string) => fireEvent.keyDown(field(), { key });

describe("matchSuggestions", () => {
  it("finds suggestions containing the text, ignoring case and accents", () => {
    expect(matchSuggestions(recipients, "sao")).toEqual(["São Paulo Previdência"]);
    expect(matchSuggestions(recipients, "ECONOMICA")).toEqual(["Caixa Econômica"]);
  });

  it("puts suggestions that start with the text first", () => {
    // Alphabetically "Agência Brasil" would come first
    expect(matchSuggestions(["Agência Brasil", "Brasil Seguros"], "bras")).toEqual(["Brasil Seguros", "Agência Brasil"]);
  });

  it("shows each value once and leaves out what was already typed in full", () => {
    expect(matchSuggestions(["Banco Inter", "banco inter", "Banco Inter"], "ban")).toEqual(["Banco Inter"]);
    expect(matchSuggestions(["Banco Inter"], "banco inter")).toEqual([]);
  });

  it("shows at most the given number", () => {
    expect(matchSuggestions(recipients, "", "pt-BR", 2)).toHaveLength(2);
  });
});

describe("Typeahead", () => {
  it("is a combobox that stays closed until something is typed", () => {
    render(<Controlled />);

    expect(field().getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("suggests matches as the user types, with the matching part marked", () => {
    render(<Controlled />);

    type("ban");

    expect(field().getAttribute("aria-expanded")).toBe("true");
    expect(options()).toEqual(["Banco do Brasil", "Banco Inter"]);
    expect(screen.getAllByRole("option")[0].querySelector("mark")?.textContent).toBe("Ban");
    expect(screen.getByRole("listbox", { name: "Beneficiário" })).toBeTruthy();
  });

  it("reports every keystroke, so free text is kept", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type("Padaria do Zé");

    expect(onChange).toHaveBeenLastCalledWith("Padaria do Zé");
    expect(options()).toEqual([]);
  });

  it("moves through the suggestions with the arrows, wrapping, and picks with Enter", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    type("ban");

    press("ArrowDown");
    expect(field().getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[0].id);
    press("ArrowDown");
    press("ArrowDown");
    expect(screen.getAllByRole("option")[0].getAttribute("aria-selected")).toBe("true");
    press("ArrowUp");
    expect(screen.getAllByRole("option")[1].getAttribute("aria-selected")).toBe("true");

    press("Enter");

    expect(onChange).toHaveBeenLastCalledWith("Banco Inter");
    expect(field().value).toBe("Banco Inter");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens the whole list with the down arrow on an empty field", () => {
    render(<Controlled />);

    press("ArrowDown");

    expect(options()).toHaveLength(recipients.length);
  });

  it("picks a suggestion with a click", () => {
    render(<Controlled />);
    type("caixa");

    fireEvent.click(screen.getByRole("option", { name: "Caixa Econômica" }));

    expect(field().value).toBe("Caixa Econômica");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("lets Enter submit the form when no suggestion is highlighted", () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <Controlled />
      </form>
    );
    type("ban");

    const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    field().dispatchEvent(enter);

    expect(enter.defaultPrevented).toBe(false);
  });

  it("closes on Escape and on blur, keeping the text", () => {
    render(<Controlled />);
    type("ban");

    press("Escape");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field().value).toBe("ban");

    type("bra");
    fireEvent.blur(field());
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes only its list on Escape inside a dialog", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Novo boleto">
        <Controlled />
      </Dialog>
    );
    type("ban");

    press("Escape");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onClose).not.toHaveBeenCalled();

    press("Escape");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations with the list open", async () => {
    render(<Controlled />);
    type("ban");
    press("ArrowDown");

    const results = await axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
