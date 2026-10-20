import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUp, Plus } from "lucide-react";
import { FloatingButton } from "./FloatingButton";
import { GlassScene } from "../../docs/GlassScene";

const meta = {
  title: "Navigation/FloatingButton",
  component: FloatingButton,
  args: { label: "Voltar ao topo", position: "bottom-right", children: <ArrowUp /> },
  argTypes: {
    position: { control: "inline-radio", options: ["bottom-right", "bottom-left", "top-right", "top-left"] },
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 280 } } },
} satisfies Meta<typeof FloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackToTop: Story = {
  render: (args) => (
    <GlassScene>
      <p style={{ margin: 0, maxWidth: 320 }}>The button floats at a corner of the viewport.</p>
      <FloatingButton {...args} />
    </GlassScene>
  ),
};

export const NewItem: Story = {
  args: { label: "Novo boleto", children: <Plus /> },
  render: BackToTop.render,
};
