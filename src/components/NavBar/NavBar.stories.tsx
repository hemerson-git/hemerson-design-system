import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Printer } from "lucide-react";
import { NavBar } from "./NavBar";
import { Button } from "../Button/Button";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Navigation/NavBar",
  component: NavBar,
  args: { title: "Ticket Manager" },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GlassScene minHeight={200}>
      <NavBar
        {...args}
        actions={
          <>
            <Button variant="ghost" iconOnly icon={<Printer />} aria-label="Imprimir" style={{ borderRadius: "var(--radius-full)" }} />
            <Button variant="primary" icon={<Plus />} style={{ borderRadius: "var(--radius-full)" }}>
              Novo
            </Button>
          </>
        }
      >
        <NavBar.Link href="#boletos" active>
          Boletos
        </NavBar.Link>
        <NavBar.Link href="#relatorios">Relatórios</NavBar.Link>
        <NavBar.Link href="#ajustes">Ajustes</NavBar.Link>
      </NavBar>
    </GlassScene>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <GlassScene minHeight={160}>
      <NavBar {...args} actions={<Button variant="glass">Entrar</Button>} />
    </GlassScene>
  ),
};
