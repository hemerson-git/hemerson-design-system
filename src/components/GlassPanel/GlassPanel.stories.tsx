import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlassPanel, type GlassTone } from "./GlassPanel";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Material/GlassPanel",
  component: GlassPanel,
  args: { tone: "regular" },
  argTypes: {
    tone: { control: "inline-radio", options: ["regular", "clear", "thick", "accent"] },
    as: { control: false },
  },
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle = { width: 190, padding: "var(--space-4)", borderRadius: "var(--radius-xl)" };

export const Regular: Story = {
  render: (args) => (
    <GlassScene>
      <GlassPanel {...args} style={panelStyle}>
        <strong>Regular glass</strong>
        <p style={{ margin: 0 }}>Readable text over any backdrop.</p>
      </GlassPanel>
    </GlassScene>
  ),
};

const notes: Record<GlassTone, string> = {
  regular: "Bars, menus, toasts: the tone for text.",
  clear: "Icon-only controls over the app's own surfaces.",
  thick: "Dialogs and sheets with forms.",
  accent: "One prominent floating control.",
};

export const Tones: Story = {
  render: () => (
    <GlassScene>
      {(Object.keys(notes) as GlassTone[]).map((tone) => (
        <GlassPanel key={tone} tone={tone} style={panelStyle}>
          <strong>{tone}</strong>
          <p style={{ margin: 0, fontSize: 14 }}>{notes[tone]}</p>
        </GlassPanel>
      ))}
    </GlassScene>
  ),
};
