import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Ellipsis, LogOut, Moon, Pencil, Trash2 } from "lucide-react";
import { fn } from "storybook/test";
import { Menu } from "./Menu";
import { Table } from "../Table/Table";
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

const boletos = [
  { id: 1, recipient: "Companhia de Energia", value: "R$ 1.234,56" },
  { id: 2, recipient: "Internet Fibra", value: "R$ 99,90" },
  { id: 3, recipient: "Condomínio", value: "R$ 640,00" },
];

/** The list renders above the page, so a scrolling table can't clip it, and it opens upward near the bottom of the window. */
export const InsideATable: Story = {
  render: (args) => (
    <GlassScene minHeight={300}>
      <div style={{ width: "100%", maxHeight: 180, overflow: "auto" }}>
        <Table
          caption="Boletos de outubro"
          rows={boletos}
          columns={[
            { key: "recipient", header: "Beneficiário" },
            { key: "value", header: "Valor", numeric: true },
            {
              key: "actions",
              header: "Ações",
              align: "center",
              render: (row) => <Menu {...args} align="end" iconOnly icon={<Ellipsis />} triggerVariant="ghost" label={`Ações de ${row.recipient}`} />,
            },
          ]}
        />
      </div>
    </GlassScene>
  ),
};

/** An account menu: the header names the signed-in user above the actions. */
export const WithHeader: Story = {
  args: {
    label: "Conta de Fulano de Tal",
    iconOnly: true,
    icon: <Ellipsis />,
    triggerVariant: "ghost",
    header: (
      <>
        <strong>Fulano de Tal</strong>
        <small>fulano@example.com</small>
      </>
    ),
    items: [
      { label: "Tema escuro", icon: <Moon /> },
      { separator: true },
      { label: "Sair", icon: <LogOut /> },
    ],
  },
  render: (args) => (
    <GlassScene minHeight={300}>
      <Menu {...args} />
    </GlassScene>
  ),
};
