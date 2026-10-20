import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  args: { open: true, onClose: () => {}, title: "Excluir boleto?" },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <GlassScene minHeight={380}>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Excluir boleto
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Excluir boleto?"
          description="O boleto 000123 de Fulano de Tal será removido. Essa ação não pode ser desfeita."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Excluir
              </Button>
            </>
          }
        />
      </GlassScene>
    );
  },
};

export const WithForm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <GlassScene minHeight={420}>
        <Button onClick={() => setOpen(true)}>Editar boleto</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Editar boleto"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setOpen(false)}>Salvar</Button>
            </>
          }
        >
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Input label="Beneficiário" defaultValue="Companhia de Energia" />
            <Input label="Valor" numeric defaultValue="1234.56" />
          </div>
        </Dialog>
      </GlassScene>
    );
  },
};
