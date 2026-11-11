import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import componentsCss from "../../styles/components.css?raw";
import { Checkbox } from "./Checkbox";

afterEach(cleanup);

/** The declarations the sheet gives an element, last rule winning, as a browser would at equal specificity. */
function styleOf(element: Element) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(componentsCss.replace(/@import[^;]+;/g, ""));
  const style: Record<string, string> = {};
  for (const rule of Array.from(sheet.cssRules)) {
    if (!(rule instanceof CSSStyleRule) || !element.matches(rule.selectorText)) continue;
    for (const property of Array.from(rule.style)) style[property] = rule.style.getPropertyValue(property);
  }
  return style;
}

const boxOf = (checkbox: HTMLElement) => checkbox.nextElementSibling!;

describe("Checkbox, partly checked", () => {
  it("is partly checked when told, and stops when told", () => {
    const { rerender } = render(<Checkbox label="Parcelas pagas" indeterminate />);
    const checkbox = screen.getByRole("checkbox", { name: "Parcelas pagas" });
    expect(checkbox).toHaveProperty("indeterminate", true);

    rerender(<Checkbox label="Parcelas pagas" indeterminate={false} />);
    expect(checkbox).toHaveProperty("indeterminate", false);

    rerender(<Checkbox label="Parcelas pagas" indeterminate />);
    rerender(<Checkbox label="Parcelas pagas" />);
    expect(checkbox).toHaveProperty("indeterminate", false);
  });

  it("isn't, unless told", () => {
    render(<Checkbox label="Pago" />);

    expect(screen.getByRole("checkbox", { name: "Pago" })).toHaveProperty("indeterminate", false);
  });

  it("a click checks it, as the browser does; still partly checked, it shows so again as it renders", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Parcelas pagas" indeterminate onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Parcelas pagas" });

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toHaveProperty("checked", true);
    expect(checkbox).toHaveProperty("indeterminate", false);

    rerender(<Checkbox label="Parcelas pagas" indeterminate onChange={onChange} />);
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("still hands its input to a ref, as an object or a function, once", () => {
    const object = createRef<HTMLInputElement>();
    const callback = vi.fn();
    const { rerender } = render(
      <>
        <Checkbox label="Um" ref={object} indeterminate />
        <Checkbox label="Dois" ref={callback} />
      </>
    );
    rerender(
      <>
        <Checkbox label="Um" ref={object} />
        <Checkbox label="Dois" ref={callback} indeterminate />
      </>
    );

    expect(object.current).toBe(screen.getByRole("checkbox", { name: "Um" }));
    expect(callback.mock.calls).toEqual([[screen.getByRole("checkbox", { name: "Dois" })]]);
  });

  it("is drawn as a box half filled on the diagonal, with no check", () => {
    render(<Checkbox label="Parcelas pagas" indeterminate />);
    const box = boxOf(screen.getByRole("checkbox", { name: "Parcelas pagas" }));

    const style = styleOf(box);
    expect(style["border-color"]).toBe("var(--accent-fill)");
    expect(style["background"]).toMatch(/^linear-gradient\(to top right, var\(--accent-fill\) calc\(50% - 0\.5px\), var\(--surface-sunken\) calc\(50% \+ 0\.5px\)\)$/);
    expect(styleOf(box.querySelector(".hds-icon")!)["opacity"]).toBe("0");
  });

  it("checked and partly checked at once, as after a click, it's drawn partly checked, with no check", () => {
    render(<Checkbox label="Parcelas pagas" defaultChecked indeterminate />);
    const box = boxOf(screen.getByRole("checkbox", { name: "Parcelas pagas" }));

    expect(styleOf(box)["background"]).toMatch(/^linear-gradient\(to top right/);
    expect(styleOf(box.querySelector(".hds-icon")!)["opacity"]).toBe("0");
  });

  it("drawn the same from plain markup, with the input's own indeterminate state", () => {
    document.body.innerHTML = `
      <span class="hds-checkbox-control">
        <input type="checkbox" class="hds-checkbox-input" aria-label="Plain">
        <span class="hds-checkbox-box"><svg class="hds-icon"></svg></span>
      </span>`;
    const input = screen.getByRole("checkbox", { name: "Plain" }) as HTMLInputElement;
    input.indeterminate = true;

    expect(styleOf(boxOf(input))["background"]).toMatch(/^linear-gradient\(to top right/);
    expect(styleOf(boxOf(input).querySelector(".hds-icon")!)["opacity"]).toBe("0");
  });

  it("checked, or neither, it's drawn as before", () => {
    render(
      <>
        <Checkbox label="Pago" defaultChecked />
        <Checkbox label="Pendente" />
      </>
    );
    const checked = boxOf(screen.getByRole("checkbox", { name: "Pago" }));
    const unchecked = boxOf(screen.getByRole("checkbox", { name: "Pendente" }));

    expect(styleOf(checked)["background"]).toBe("var(--accent-fill)");
    expect(styleOf(checked.querySelector(".hds-icon")!)["opacity"]).toBe("1");
    expect(styleOf(unchecked)["background"]).toBe("var(--surface-sunken)");
    expect(styleOf(unchecked.querySelector(".hds-icon")!)["opacity"]).toBe("0");
  });
});
