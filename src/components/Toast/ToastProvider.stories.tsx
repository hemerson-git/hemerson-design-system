import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastProvider, useToast } from "./ToastProvider";
import { Button } from "../Button/Button";
import { GlassScene } from "../../docs/GlassScene";

function Actions() {
  const toast = useToast();
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => toast.success("Boleto salvo", "Fulano de Tal · R$ 1.234,56")}>
        success
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast.warning("2 boletos vencem nesta semana")}>
        warning
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast.error("Não foi possível salvar", "Verifique os campos e tente de novo.")}>
        error
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast.info("Lista atualizada")}>
        info
      </Button>
    </>
  );
}

/**
 * Wrap the app once in `ToastProvider`, then call `useToast()` anywhere below it.
 * Toasts stack in one region, at most three at a time, each with its own timer.
 */
const meta = {
  title: "Overlays/ToastProvider",
  component: ToastProvider,
  args: { max: 3, children: null },
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stacking: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <GlassScene minHeight={320}>
        <Actions />
      </GlassScene>
    </ToastProvider>
  ),
};
