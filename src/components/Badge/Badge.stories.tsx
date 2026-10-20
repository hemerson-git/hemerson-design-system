import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Content/Badge",
  component: Badge,
  args: { tone: "success", children: "Pago" },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "accent", "success", "warning", "danger"] },
    icon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", alignItems: "center" }}>
      <Badge tone="success">Pago</Badge>
      <Badge tone="warning">Vence em 3 dias</Badge>
      <Badge tone="danger">Vencido</Badge>
      <Badge tone="accent" icon={false}>
        Electron
      </Badge>
      <Badge>12 boletos</Badge>
    </div>
  ),
};
