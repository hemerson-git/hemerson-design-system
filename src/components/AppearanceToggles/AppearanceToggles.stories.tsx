import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle, TransparencyToggle } from "./AppearanceToggles";
import { GlassPanel } from "../GlassPanel/GlassPanel";
import { GlassScene } from "../../docs/GlassScene";

/**
 * Apps open in the dark theme and switch to light only when the visitor asks.
 * Both toggles save the choice and stay in sync with each other.
 * In Storybook, the toolbar sets the theme of each story, so these change the page until you reload.
 */
const meta = {
  title: "Actions/Appearance toggles",
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InAToolbar: Story = {
  render: (args) => (
    <GlassScene minHeight={200}>
      <GlassPanel style={{ display: "flex", gap: "var(--space-1)", padding: "var(--space-2)", borderRadius: "var(--radius-full)" }}>
        <ThemeToggle {...args} />
        <TransparencyToggle />
      </GlassPanel>
    </GlassScene>
  ),
};
