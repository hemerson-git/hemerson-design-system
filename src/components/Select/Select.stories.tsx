import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  args: {
    label: "Situação",
    defaultValue: "unpaid",
    options: [
      { value: "all", label: "Todos" },
      { value: "paid", label: "Pago" },
      { value: "unpaid", label: "Pendente" },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderAndError: Story = {
  args: {
    label: "Forma de pagamento",
    placeholder: "Escolha",
    defaultValue: "",
    error: "Escolha a forma de pagamento",
    options: [
      { value: "online", label: "On-line" },
      { value: "printed", label: "Impresso" },
    ],
  },
};
