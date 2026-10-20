import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles/fonts.css";
import "../src/styles/tokens.css";
import "../src/styles/components.css";

// Applies the toolbar's theme and transparency to <html>, as an app would
const withAppearance: Decorator = (Story, context) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", context.globals.theme);

  if (context.globals.transparency === "reduced") {
    root.setAttribute("data-transparency", "reduced");
  } else {
    root.removeAttribute("data-transparency");
  }

  return (
    <div className="hds-root" style={{ padding: "var(--space-6)" }}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withAppearance],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
    transparency: {
      description: "Reduced transparency turns every glass surface solid",
      toolbar: {
        title: "Transparency",
        icon: "eye",
        items: [
          { value: "full", title: "Glass" },
          { value: "reduced", title: "Reduced transparency" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
    transparency: "full",
  },
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    a11y: {
      // Accessibility violations fail the story's test, not just show a warning
      test: "error",
    },
  },
};

export default preview;
