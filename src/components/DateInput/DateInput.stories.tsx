import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateInput } from "./DateInput";
import { GlassScene } from "../../docs/GlassScene";

/**
 * Type the date as day/month/year, or open the calendar with the button. In the calendar, the
 * arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Enter
 * picks and Escape closes. The value is "yyyy-mm-dd", like a native date input.
 */
const meta = {
  title: "Forms/DateInput",
  component: DateInput,
  args: { label: "Vencimento", defaultValue: "2026-10-10" },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRange: Story = {
  args: { label: "Vencimento até", min: "2026-10-05", max: "2026-10-25", hint: "Entre 05/10 e 25/10" },
};

/** The calendar is glass: open it over the scene to see the shapes behind. */
export const OverContent: Story = {
  decorators: [],
  render: function Render(args) {
    const [value, setValue] = useState(args.defaultValue ?? "");
    return (
      <GlassScene minHeight={440}>
        <div style={{ width: 280 }}>
          <DateInput {...args} defaultValue={undefined} value={value} onChange={setValue} />
          <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-mono)" }}>value: {value || "—"}</p>
        </div>
      </GlassScene>
    );
  },
};
