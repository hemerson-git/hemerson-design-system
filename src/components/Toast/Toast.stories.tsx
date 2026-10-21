import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Toast, type ToastTone } from "./Toast";
import { Button } from "../Button/Button";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Overlays/Toast",
  component: Toast,
  args: {
    open: true,
    tone: "success",
    title: "Boleto salvo",
    description: "Fulano de Tal · R$ 1.234,56 · vence em 10/10/2026",
    duration: 0,
    onClose: () => {},
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "success", "warning", "danger"] },
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 240 } } },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: (args) => (
    <GlassScene minHeight={200}>
      <Toast {...args} />
    </GlassScene>
  ),
};

export const Danger: Story = {
  args: { tone: "danger", title: "Não foi possível salvar", description: "Verifique os campos e tente de novo." },
  render: Success.render,
};

const messages: Record<ToastTone, string> = {
  neutral: "Lista atualizada",
  success: "Boleto salvo",
  warning: "2 boletos vencem nesta semana",
  danger: "Não foi possível salvar",
};

export const TryEachTone: Story = {
  render: function Render() {
    const [tone, setTone] = useState<ToastTone | null>(null);
    return (
      <GlassScene minHeight={220}>
        {(Object.keys(messages) as ToastTone[]).map((option) => (
          <Button key={option} variant="secondary" size="sm" onClick={() => setTone(option)}>
            {option}
          </Button>
        ))}
        <Toast open={tone !== null} tone={tone ?? "neutral"} title={tone ? messages[tone] : ""} onClose={() => setTone(null)} />
      </GlassScene>
    );
  },
};

/** With an action, such as an undo. Without a duration it stays 10 seconds, and the timer pauses on hover and focus. */
export const WithAction: Story = {
  args: {
    tone: "success",
    title: "Boleto excluído",
    description: "Companhia de Energia · R$ 187,42",
    action: { label: "Desfazer", onAction: () => {} },
  },
  render: Success.render,
};
