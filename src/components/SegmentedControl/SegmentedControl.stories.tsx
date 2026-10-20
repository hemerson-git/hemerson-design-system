import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Navigation/SegmentedControl",
  component: SegmentedControl,
  args: {
    label: "Idioma",
    options: [
      { value: "pt", label: "PT" },
      { value: "en", label: "EN" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Language: Story = {
  render: (args) => (
    <GlassScene minHeight={160}>
      <SegmentedControl {...args} />
    </GlassScene>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [view, setView] = useState("list");
    return (
      <GlassScene minHeight={160}>
        <SegmentedControl
          label="Visualização"
          value={view}
          onChange={setView}
          options={[
            { value: "list", label: "Lista" },
            { value: "month", label: "Mês" },
            { value: "year", label: "Ano" },
          ]}
        />
        <p style={{ margin: 0 }}>Selected: {view}</p>
      </GlassScene>
    );
  },
};
