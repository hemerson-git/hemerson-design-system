import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlowAvatar } from "./GlowAvatar";

const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#78718e"/><circle cx="48" cy="38" r="18" fill="#e4e3de"/><rect x="18" y="62" width="60" height="40" rx="30" fill="#e4e3de"/></svg>'
  );

const meta = {
  title: "Feedback/GlowAvatar",
  component: GlowAvatar,
  args: { src: photo, alt: "Hemerson Oliveira", size: 96 },
  decorators: [(Story) => <div style={{ padding: "var(--space-10)" }}>{Story()}</div>],
} satisfies Meta<typeof GlowAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 64 },
};
