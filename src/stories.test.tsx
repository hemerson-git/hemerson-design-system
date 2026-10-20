import { composeStories, setProjectAnnotations } from "@storybook/react-vite";
import { act, cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as previewAnnotations from "../.storybook/preview";

// Every story renders with the same decorators as in Storybook, without errors,
// and passes the axe accessibility rules that can run without a real layout.
setProjectAnnotations(previewAnnotations);

const storyFiles = import.meta.glob<Record<string, unknown>>("./components/**/*.stories.tsx", { eager: true });

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe.each(Object.entries(storyFiles))("%s", (_path, storyFile) => {
  const stories = Object.entries(composeStories(storyFile as Parameters<typeof composeStories>[0])) as Array<
    [string, { run: () => Promise<void> }]
  >;

  it.each(stories)("%s renders and passes axe", async (_name, Story) => {
    const errors: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args));

    await act(async () => {
      await Story.run();
    });
    const { baseElement } = render(<></>);

    expect(errors).toEqual([]);

    // WCAG A and AA rules. Page-level best practices (landmarks, one h1) don't apply to a
    // component on its own, and jsdom has no layout to measure contrast, so the tokens are
    // checked for contrast separately.
    const results = await axe.run(baseElement, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
      rules: { "color-contrast": { enabled: false } },
    });
    const violations = results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);

    expect(violations).toEqual([]);
  });
});
