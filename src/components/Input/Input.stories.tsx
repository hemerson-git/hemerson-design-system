import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: { label: "Beneficiário", placeholder: "Ex.: Companhia de Energia" },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Como aparece no boleto" },
};

export const Numeric: Story = {
  args: { label: "Valor", numeric: true, defaultValue: "1234.56", placeholder: undefined },
};

export const WithError: Story = {
  args: { label: "Número do documento", required: true, error: "Informe o número do documento", placeholder: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Companhia de Energia" },
};
