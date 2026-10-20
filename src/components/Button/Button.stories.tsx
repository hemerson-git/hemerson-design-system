import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: {
    children: "Novo boleto",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
      <Button {...args} variant="primary" icon={<Plus />}>
        Novo boleto
      </Button>
      <Button {...args} variant="secondary">
        Duplicar
      </Button>
      <Button {...args} variant="ghost" icon={<Printer />}>
        Imprimir
      </Button>
      <Button {...args} variant="danger" icon={<Trash2 />}>
        Excluir
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Button {...args} size="sm">
        Pequeno
      </Button>
      <Button {...args} size="md">
        Médio
      </Button>
      <Button {...args} size="lg">
        Download resume
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    iconOnly: true,
    icon: <Pencil />,
    "aria-label": "Editar boleto",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Salvando",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Indisponível",
  },
};

/** Glass buttons belong over content or inside glass bars. */
export const OnGlass: Story = {
  args: {
    variant: "glass",
    children: "Ver detalhes",
  },
  render: (args) => (
    <GlassScene>
      <Button {...args} />
      <Button {...args} iconOnly icon={<Printer />} aria-label="Imprimir" />
    </GlassScene>
  ),
};
