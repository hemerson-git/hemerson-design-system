import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Typeahead } from "./Typeahead";
import { GlassScene } from "../../docs/GlassScene";

const recipients = [
  "Banco do Brasil",
  "Banco Inter",
  "Caixa Econômica Federal",
  "Companhia de Energia",
  "Condomínio Jardim das Flores",
  "Internet Fibra",
  "São Paulo Previdência",
];

/**
 * Suggests values as you type, such as names already used, in a glass list. Matches ignore case
 * and accents ("sao" finds "São Paulo"), those that start with the text come first, and the
 * matching part is bold. The arrow keys move through the list, Enter picks and Escape closes it.
 * Any text is still accepted.
 */
const meta = {
  title: "Forms/Typeahead",
  component: Typeahead,
  args: { label: "Beneficiário", suggestions: recipients },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
} satisfies Meta<typeof Typeahead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Type "ban" or "sao" to see the glass list over the scene. */
export const OverContent: Story = {
  decorators: [],
  render: function Render(args) {
    const [value, setValue] = useState("ban");
    return (
      <GlassScene minHeight={380}>
        <div style={{ width: 300 }}>
          <Typeahead {...args} value={value} onChange={setValue} />
        </div>
      </GlassScene>
    );
  },
};
