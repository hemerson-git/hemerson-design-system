import { cleanup, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { BarChart } from "./BarChart";

afterEach(cleanup);

const byMonth = [
  { label: "set", values: [300, 100] },
  { label: "out", values: [0, 200] },
];
const series = [
  { name: "Pago", tone: "success" as const },
  { name: "A pagar", tone: "warning" as const },
];

const stackOf = (label: string) =>
  [...document.querySelectorAll(".hds-chart-column, .hds-chart-row")]
    .find((element) => element.querySelector(".hds-chart-label")?.textContent === label)!
    .querySelector(".hds-chart-stack") as HTMLElement;

describe("BarChart", () => {
  it("is a figure named by its title", () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} />);

    expect(screen.getByRole("figure", { name: "Valor por mês" })).toBeTruthy();
  });

  it("sizes each bar against the largest total", () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} />);

    expect(stackOf("set").style.height).toBe("100%");
    expect(stackOf("out").style.height).toBe("50%");
  });

  it("stacks the series in proportion, leaving out empty ones", () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} />);

    const september = [...stackOf("set").children] as HTMLElement[];
    expect(september.map((bar) => bar.style.flexGrow)).toEqual(["300", "100"]);
    expect(september[0].classList.contains("hds-chart-tone--success")).toBe(true);
    expect(stackOf("out").children).toHaveLength(1);
  });

  it("shows each total formatted, and a legend for several series", () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} formatValue={(v) => `R$ ${v}`} />);

    expect(screen.getAllByText("R$ 400").length).toBeGreaterThan(0);
    expect(document.querySelector(".hds-chart-legend")?.textContent).toBe("PagoA pagar");
  });

  it("gives screen readers the numbers as a table, and hides the bars", () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} formatValue={(v) => `R$ ${v}`} />);

    const table = screen.getByRole("table");
    const september = within(table).getByRole("rowheader", { name: "set" }).closest("tr")!;
    expect(within(september).getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["R$ 300", "R$ 100", "R$ 400"]);
    expect(document.querySelector(".hds-chart-columns")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws a ranking as horizontal bars, widths against the largest", () => {
    render(
      <BarChart
        title="Maiores beneficiários"
        orientation="horizontal"
        data={[
          { label: "Ana", values: [400] },
          { label: "Bruno", values: [100] },
        ]}
      />
    );

    expect(stackOf("Ana").style.width).toBe("100%");
    expect(stackOf("Bruno").style.width).toBe("25%");
    expect(document.querySelector(".hds-chart-legend")).toBeNull();
  });

  it("says so when there is nothing to draw", () => {
    const { rerender } = render(<BarChart title="Valor por mês" data={[]} empty="Nenhum boleto." />);
    expect(screen.getByText("Nenhum boleto.")).toBeTruthy();

    rerender(<BarChart title="Valor por mês" data={[{ label: "set", values: [0] }]} empty="Nenhum boleto." />);
    expect(screen.getByText("Nenhum boleto.")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("has no accessibility violations", async () => {
    render(<BarChart title="Valor por mês" data={byMonth} series={series} />);

    const results = await axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
