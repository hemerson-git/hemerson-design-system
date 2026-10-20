import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loading } from "./Loading";

const meta = {
  title: "Feedback/Loading",
  component: Loading,
  args: { size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
      <Loading size="sm" />
      <Loading size="md" />
      <Loading size="lg" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { showLabel: true, label: "Carregando boletos…" },
};
