import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil } from "lucide-react";
import { Table, type TableColumn } from "./Table";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { GlassScene } from "../../docs/GlassScene";

type Boleto = {
  id: number;
  recipient: string;
  due: string;
  value: string;
  status: "paid" | "soon" | "late";
};

const rows: Boleto[] = [
  { id: 1, recipient: "Companhia de Energia", due: "10/10/2026", value: "R$ 1.234,56", status: "paid" },
  { id: 2, recipient: "Internet Fibra", due: "15/10/2026", value: "R$ 99,90", status: "soon" },
  { id: 3, recipient: "Condomínio", due: "05/10/2026", value: "R$ 640,00", status: "late" },
];

const statusBadge = {
  paid: <Badge tone="success">Pago</Badge>,
  soon: <Badge tone="warning">Vence em 3 dias</Badge>,
  late: <Badge tone="danger">Vencido</Badge>,
};

const columns: TableColumn<Boleto>[] = [
  { key: "recipient", header: "Beneficiário" },
  { key: "due", header: "Vencimento", numeric: true },
  { key: "value", header: "Valor", numeric: true },
  { key: "status", header: "Situação", render: (row) => statusBadge[row.status] },
  {
    key: "actions",
    header: "Ações",
    align: "center",
    render: (row) => <Button variant="ghost" size="sm" iconOnly icon={<Pencil />} aria-label={`Editar ${row.recipient}`} />,
  },
];

const meta = {
  title: "Content/Table",
  component: Table<Boleto>,
  args: { caption: "Boletos de outubro", columns, rows },
} satisfies Meta<typeof Table<Boleto>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Boletos: Story = {};

export const Empty: Story = {
  args: { rows: [], empty: "Nenhum boleto neste mês." },
};

/** On glass, for a table that sits on the app's background rather than over other content. The header frosts the rows that scroll under it. */
export const OnGlass: Story = {
  args: { glass: true, maxHeight: 220 },
  render: (args) => (
    <GlassScene minHeight={300}>
      <div style={{ width: "100%" }}>
        <Table {...args} />
      </div>
    </GlassScene>
  ),
};
