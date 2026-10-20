import { describe, expect, it } from "vitest";
import tokens from "../tokens/tokens.json";

// WCAG 2 contrast for every color pairing the design system promises, in every theme.

type ColorToken = { name: string; value: string | Record<string, string> };

const colors = new Map((tokens.color.tokens as ColorToken[]).map((token) => [token.name, token]));
const themes = tokens.color.themes.map((theme) => theme.id);

function resolve(name: string, theme: string): string {
  const token = colors.get(name);
  if (!token) throw new Error(`Unknown token ${name}`);
  const raw = typeof token.value === "string" ? token.value : (token.value[theme] ?? token.value[themes[0]]);
  const alias = /^\{(.+)\}$/.exec(raw);
  return alias ? resolve(alias[1], theme) : raw;
}

function rgba(hex: string): [number, number, number, number] {
  const value = hex.replace("#", "");
  const channel = (index: number) => parseInt(value.slice(index, index + 2), 16);
  return [channel(0), channel(2), channel(4), value.length === 8 ? channel(6) / 255 : 1];
}

/** Paints a translucent color over an opaque one. */
function over(top: string, bottom: [number, number, number]): [number, number, number] {
  const [r, g, b, a] = rgba(top);
  return [r * a + bottom[0] * (1 - a), g * a + bottom[1] * (1 - a), b * a + bottom[2] * (1 - a)];
}

function luminance([r, g, b]: [number, number, number]) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const solid = (name: string, theme: string) => over(resolve(name, theme), [0, 0, 0]);
const surfaces = ["surface", "surface-raised", "surface-sunken"];

describe.each(themes)("%s theme", (theme) => {
  it.each(["ink", "ink-muted", "accent", "secondary", "success", "warning", "danger"])(
    "%s text reads at 4.5:1 or more on every surface",
    (text) => {
      for (const surface of surfaces) {
        expect(contrast(solid(text, theme), solid(surface, theme)), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  );

  it.each(["line-strong", "focus-ring"])("%s stands out at 3:1 or more on every surface", (mark) => {
    for (const surface of surfaces) {
      expect(contrast(solid(mark, theme), solid(surface, theme)), `${mark} on ${surface}`).toBeGreaterThanOrEqual(3);
    }
  });

  it.each([
    ["on-accent", "accent-fill"],
    ["on-secondary", "secondary-fill"],
    ["on-danger", "danger"],
  ])("%s reads at 4.5:1 or more on %s", (text, fill) => {
    expect(contrast(solid(text, theme), solid(fill, theme))).toBeGreaterThanOrEqual(4.5);
  });

  // Glass sits over content nobody controls: check it over pure white and pure black
  it.each([
    ["glass-regular-tint", ["ink"], 7],
    ["glass-thick-tint", ["ink", "ink-muted", "accent"], 4.5],
  ] as const)("text on %s stays legible over any backdrop", (glass, texts, minimum) => {
    for (const backdrop of [
      [255, 255, 255],
      [0, 0, 0],
    ] as [number, number, number][]) {
      const ground = over(resolve(glass, theme), backdrop);
      for (const text of texts) {
        expect(contrast(solid(text, theme), ground), `${text} over ${backdrop.join(",")}`).toBeGreaterThanOrEqual(minimum);
      }
    }
  });
});
