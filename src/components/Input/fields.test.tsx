import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "./Input";
import { Select } from "../Select/Select";
import { Checkbox } from "../Checkbox/Checkbox";

afterEach(cleanup);

const describedTexts = (element: HTMLElement) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent);

describe("Input", () => {
  it("is found by its label", () => {
    render(<Input label="Beneficiário" />);

    expect(screen.getByLabelText("Beneficiário").tagName).toBe("INPUT");
  });

  it("links its hint and error and marks the value invalid", () => {
    render(<Input label="Valor" hint="Em reais" error="Informe o valor" />);
    const input = screen.getByLabelText("Valor");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(describedTexts(input)).toEqual(["Em reais", "Informe o valor"]);
  });

  it("is valid and undescribed without an error or hint", () => {
    render(<Input label="Valor" />);
    const input = screen.getByLabelText("Valor");

    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(input.getAttribute("aria-describedby")).toBeNull();
  });

  it("asks for a decimal keyboard and tabular figures when numeric", () => {
    render(<Input label="Valor" numeric />);
    const input = screen.getByLabelText("Valor");

    expect(input.getAttribute("inputmode")).toBe("decimal");
    expect(input.classList.contains("hds-input--numeric")).toBe(true);
  });

  it("keeps a given id and passes native props through", () => {
    const onChange = vi.fn();
    render(<Input label="Beneficiário" id="recipient" required onChange={onChange} />);
    const input = screen.getByLabelText("Beneficiário");

    fireEvent.change(input, { target: { value: "Luz" } });

    expect(input.id).toBe("recipient");
    expect(input).toHaveProperty("required", true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("gives every field its own id", () => {
    render(
      <>
        <Input label="Beneficiário" />
        <Input label="Valor" />
      </>
    );

    expect(screen.getByLabelText("Beneficiário").id).not.toBe(screen.getByLabelText("Valor").id);
  });
});

describe("Select", () => {
  const options = [
    { value: "paid", label: "Pago" },
    { value: "unpaid", label: "Pendente" },
  ];

  it("is found by its label and lists its options after a disabled placeholder", () => {
    render(<Select label="Situação" options={options} placeholder="Escolha" defaultValue="" />);
    const select = screen.getByLabelText("Situação") as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => [option.text, option.disabled])).toEqual([
      ["Escolha", true],
      ["Pago", false],
      ["Pendente", false],
    ]);
  });

  it("reports the chosen value", () => {
    const onChange = vi.fn((event: { target: { value: string } }) => event.target.value);
    render(<Select label="Situação" options={options} defaultValue="paid" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Situação"), { target: { value: "unpaid" } });

    expect(onChange).toHaveReturnedWith("unpaid");
  });

  it("links its error and marks the value invalid", () => {
    render(<Select label="Forma" options={options} error="Escolha a forma" />);
    const select = screen.getByLabelText("Forma");

    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(describedTexts(select)).toEqual(["Escolha a forma"]);
  });
});

describe("Checkbox", () => {
  it("toggles when its label text is clicked", () => {
    render(<Checkbox label="Pago" />);
    const checkbox = screen.getByRole("checkbox", { name: "Pago" });

    fireEvent.click(screen.getByText("Pago"));
    expect(checkbox).toHaveProperty("checked", true);

    fireEvent.click(screen.getByText("Pago"));
    expect(checkbox).toHaveProperty("checked", false);
  });

  it("is described by its hint", () => {
    render(<Checkbox label="On-line" hint="Pago pelo app do banco" />);

    expect(describedTexts(screen.getByRole("checkbox", { name: /On-line/ }))).toEqual(["Pago pelo app do banco"]);
  });

  it("stays put when disabled", () => {
    render(<Checkbox label="Indisponível" disabled />);
    const checkbox = screen.getByRole("checkbox", { name: "Indisponível" });

    fireEvent.click(screen.getByText("Indisponível"));

    expect(checkbox).toHaveProperty("checked", false);
  });
});
