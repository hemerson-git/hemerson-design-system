import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const reais = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/**
 * Bars for a few values. Vertical for time, horizontal for rankings; several series stack in
 * each bar with a legend. Screen readers get the numbers as a table instead of the bars.
 */
const meta = {
  title: "Content/BarChart",
  component: BarChart,
  args: {
    title: "Valor por mês de vencimento",
    formatValue: reais,
    series: [
      { name: "Pago", tone: "success" },
      { name: "A pagar", tone: "warning" },
    ],
    data: [
      { label: "jul/26", values: [87000, 0] },
      { label: "ago/26", values: [45000, 19990] },
      { label: "set/26", values: [202800, 64000] },
      { label: "out/26", values: [20000, 123456] },
      { label: "nov/26", values: [0, 99900] },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}>{Story()}</div>],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ByMonth: Story = {};

export const Ranking: Story = {
  args: {
    title: "Maiores beneficiários",
    orientation: "horizontal",
    series: [{ name: "Valor" }],
    data: [
      { label: "Confirmação de novo", values: [202800] },
      { label: "Só um teste", values: [174000] },
      { label: "Banco do Brasil", values: [20000] },
      { label: "One More 4", values: [1999] },
    ],
  },
};

export const Empty: Story = {
  args: { data: [], empty: "Nenhum boleto na lista." },
};
