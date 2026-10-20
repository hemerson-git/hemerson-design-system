import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Layout/SectionTitle",
  component: SectionTitle,
  args: { index: 1, children: "Sobre mim" },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Indexed: Story = {};

export const WithoutIndex: Story = {
  args: { index: undefined, children: "Contato" },
};
