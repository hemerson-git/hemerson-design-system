import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { fn } from "storybook/test";
import { Menu } from "./Menu";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Navigation/Menu",
  component: Menu,
  args: {
    label: "Ações",
    align: "start",
    items: [
      { label: "Editar", icon: <Pencil />, onSelect: fn() },
      { label: "Duplicar", icon: <Copy />, onSelect: fn() },
      { separator: true },
      { label: "Excluir", icon: <Trash2 />, danger: true, onSelect: fn() },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GlassScene minHeight={300}>
      <Menu {...args} />
    </GlassScene>
  ),
};

export const IconTrigger: Story = {
  args: { iconOnly: true, icon: <Ellipsis />, label: "Mais ações", triggerVariant: "ghost" },
  render: (args) => (
    <GlassScene minHeight={300}>
      <Menu {...args} />
    </GlassScene>
  ),
};
