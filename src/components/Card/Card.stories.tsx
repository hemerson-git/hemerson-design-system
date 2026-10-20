import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "Content/Card",
  component: Card,
  args: {
    eyebrow: "Projeto",
    title: "Ticket Manager",
    children: "Desktop app to register, track and print boletos, with Google sign-in and a local database.",
  },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Project: Story = {
  args: {
    footer: (
      <>
        <Badge tone="accent" icon={false}>
          Electron
        </Badge>
        <Badge tone="accent" icon={false}>
          React
        </Badge>
        <Badge tone="accent" icon={false}>
          Prisma
        </Badge>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    as: "a",
    href: "#resumo",
    interactive: true,
    eyebrow: "Resumo",
    title: "R$ 4.229,00 a pagar",
    children: "6 boletos pendentes · 2 vencem nesta semana",
    style: { textDecoration: "none" },
  },
};
