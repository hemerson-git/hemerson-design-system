import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./Separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)", maxWidth: 420 }}>
      <span>Boletos impressos</span>
      <Separator />
      <span>Boletos on-line</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", height: 32 }}>
      <span>Editar</span>
      <Separator orientation="vertical" />
      <span>Duplicar</span>
      <Separator orientation="vertical" />
      <span>Excluir</span>
    </div>
  ),
};
