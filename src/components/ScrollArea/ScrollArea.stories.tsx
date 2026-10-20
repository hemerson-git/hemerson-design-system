import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./ScrollArea";

const items = Array.from({ length: 12 }, (_, index) => ({
  number: String(index + 1).padStart(3, "0"),
  value: ((index + 1) * 37.5).toFixed(2).replace(".", ","),
}));

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  args: { label: "Boletos recentes", maxHeight: 180 },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ width: 320, paddingRight: "var(--space-3)" }}>
      {items.map((item) => (
        <p key={item.number} style={{ margin: 0, padding: "var(--space-2) 0", borderBottom: "1px solid var(--line)" }}>
          Boleto {item.number} · R$ {item.value}
        </p>
      ))}
    </ScrollArea>
  ),
};
