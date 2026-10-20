import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Table, type TableColumn } from "./Table";

afterEach(cleanup);

type Row = { id: number; recipient: string; value: string; paid: boolean };

const columns: TableColumn<Row>[] = [
  { key: "recipient", header: "Beneficiário" },
  { key: "value", header: "Valor", numeric: true },
  { key: "paid", header: "Situação", render: (row) => (row.paid ? "Pago" : "Pendente") },
];

const rows: Row[] = [
  { id: 1, recipient: "Luz", value: "R$ 10,00", paid: true },
  { id: 2, recipient: "Água", value: "R$ 20,00", paid: false },
];

describe("Table", () => {
  it("is a focusable region named by its caption", () => {
    render(<Table caption="Boletos de outubro" columns={columns} rows={rows} />);
    const region = screen.getByRole("region", { name: "Boletos de outubro" });

    expect(region.tabIndex).toBe(0);
    expect(within(region).getByRole("table", { name: "Boletos de outubro" })).toBeTruthy();
  });

  it("shows one column header per column and one row per item, in order", () => {
    render(<Table caption="Boletos" columns={columns} rows={rows} />);

    expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual(["Beneficiário", "Valor", "Situação"]);
    expect(screen.getAllByRole("row").slice(1).map((row) => within(row).getAllByRole("cell").map((cell) => cell.textContent))).toEqual([
      ["Luz", "R$ 10,00", "Pago"],
      ["Água", "R$ 20,00", "Pendente"],
    ]);
  });

  it("aligns numeric columns, header included", () => {
    render(<Table caption="Boletos" columns={columns} rows={rows} />);

    expect(screen.getByRole("columnheader", { name: "Valor" }).classList.contains("hds-cell--numeric")).toBe(true);
    expect(screen.getByRole("cell", { name: "R$ 10,00" }).classList.contains("hds-cell--numeric")).toBe(true);
    expect(screen.getByRole("cell", { name: "Luz" }).classList.contains("hds-cell--numeric")).toBe(false);
  });

  it("shows its empty message across all columns when there are no rows", () => {
    render(<Table caption="Boletos" columns={columns} rows={[]} empty="Nenhum boleto." />);
    const cell = screen.getByRole("cell", { name: "Nenhum boleto." });

    expect(cell.getAttribute("colspan")).toBe("3");
  });

  it("can keep the caption for screen readers only", () => {
    render(<Table caption="Boletos" hideCaption columns={columns} rows={rows} />);

    expect(screen.getByText("Boletos", { selector: "caption" }).classList.contains("hds-visually-hidden")).toBe(true);
  });
});
