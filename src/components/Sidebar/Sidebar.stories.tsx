import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartColumn, House, ReceiptText, Settings } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { GlassScene } from "../../docs/GlassScene";

const items = [
  { label: "Início", icon: <House />, href: "#inicio" },
  { label: "Boletos", icon: <ReceiptText />, href: "#boletos", active: true },
  { label: "Relatórios", icon: <ChartColumn />, href: "#relatorios" },
];

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  args: { items },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rail: Story = {
  render: (args) => (
    <GlassScene minHeight={320}>
      <div style={{ height: 280 }}>
        <Sidebar
          {...args}
          footer={
            <a className="hds-sidebar-item" href="#ajustes" aria-label="Ajustes" title="Ajustes">
              <Settings />
            </a>
          }
        />
      </div>
    </GlassScene>
  ),
};

export const Floating: Story = {
  args: { floating: true },
  render: (args) => (
    <GlassScene minHeight={260}>
      <Sidebar {...args} />
    </GlassScene>
  ),
};
