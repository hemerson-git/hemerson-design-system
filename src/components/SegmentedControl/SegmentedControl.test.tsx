import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

afterEach(cleanup);

const options = [
  { value: "list", label: "Lista" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
];

const checked = () => screen.getAllByRole("radio").filter((radio) => radio.getAttribute("aria-checked") === "true");

describe("SegmentedControl", () => {
  it("is a named radio group with the first option selected by default", () => {
    render(<SegmentedControl label="Visualização" options={options} />);

    expect(screen.getByRole("radiogroup", { name: "Visualização" })).toBeTruthy();
    expect(checked().map((radio) => radio.textContent)).toEqual(["Lista"]);
  });

  it("starts from defaultValue and changes on click", () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Visualização" options={options} defaultValue="month" onChange={onChange} />);
    expect(checked()[0].textContent).toBe("Mês");

    fireEvent.click(screen.getByRole("radio", { name: "Ano" }));

    expect(checked()[0].textContent).toBe("Ano");
    expect(onChange).toHaveBeenCalledWith("year");
  });

  it("is one tab stop: only the selected option is focusable", () => {
    render(<SegmentedControl label="Visualização" options={options} defaultValue="month" />);

    expect(screen.getAllByRole("radio").map((radio) => radio.tabIndex)).toEqual([-1, 0, -1]);
  });

  it("selects with the arrow keys, moves focus and wraps around", () => {
    render(<SegmentedControl label="Visualização" options={options} />);
    const [first] = screen.getAllByRole("radio");
    first.focus();

    fireEvent.keyDown(first, { key: "ArrowLeft" });

    expect(checked()[0].textContent).toBe("Ano");
    expect(document.activeElement?.textContent).toBe("Ano");

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(checked()[0].textContent).toBe("Lista");
  });

  it("follows a controlled value and only reports changes", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SegmentedControl label="Visualização" options={options} value="list" onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "Mês" }));
    expect(onChange).toHaveBeenCalledWith("month");
    expect(checked()[0].textContent).toBe("Lista");

    rerender(<SegmentedControl label="Visualização" options={options} value="month" onChange={onChange} />);
    expect(checked()[0].textContent).toBe("Mês");
  });
});
