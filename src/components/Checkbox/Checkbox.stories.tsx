import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: { label: "Pago" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  args: { label: "Boleto on-line", hint: "Pago pelo app do banco" },
};

export const Disabled: Story = {
  args: { label: "Indisponível", disabled: true },
};
