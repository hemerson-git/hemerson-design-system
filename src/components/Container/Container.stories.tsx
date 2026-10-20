import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";
import { SectionTitle } from "../SectionTitle/SectionTitle";

const meta = {
  title: "Layout/Container",
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Section: Story = {
  render: (args) => (
    <Container {...args} style={{ outline: "1px dashed var(--line-strong)", outlineOffset: -1 }}>
      <SectionTitle index={2}>Projetos</SectionTitle>
      <p style={{ color: "var(--ink-muted)", margin: "var(--space-4) 0 0" }}>
        Content is centred and capped at content-max (dashed outline), with a section's vertical padding.
      </p>
    </Container>
  ),
};
