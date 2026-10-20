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

  // Regular glass is see-through: ink must hold over mid-grey content, the middle of the range.
  // Brighter content in the dark theme (or darker in the light one) gets the other theme's glass.
  it("ink stays at 4.5:1 or more on regular glass over mid-grey content", () => {
    const ground = over(resolve("glass-regular-tint", theme), [128, 128, 128]);
    expect(contrast(solid("ink", theme), ground)).toBeGreaterThanOrEqual(4.5);
  });

  // Dialogs are see-through, so what matters is the app's own page behind the scrim: its surfaces,
  // and its text and colored fills (badges, buttons) as the blur spreads them, at half strength.
  // Rendered dialogs over a real table measure higher than this model.
  it("text on thick glass reads at 4.5:1 or more over the app's own content", () => {
    const mix = (a: [number, number, number], b: [number, number, number]) =>
      a.map((value, index) => (value + b[index]) / 2) as [number, number, number];
    const marks = ["ink", "ink-muted", "accent", "accent-fill", "secondary-fill", "danger", "success", "warning"];
    const backdrops = surfaces.flatMap((surface) => [
      solid(surface, theme),
      ...marks.map((mark) => mix(solid(mark, theme), solid(surface, theme))),
    ]);

    for (const backdrop of backdrops) {
      const ground = over(resolve("glass-thick-tint", theme), over(resolve("scrim", theme), backdrop));
      for (const text of ["ink", "ink-muted"]) {
        expect(contrast(solid(text, theme), ground), `${text} over ${backdrop.map(Math.round).join(",")}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("thick glass lets the page show through", () => {
    const [, , , alpha] = rgba(resolve("glass-thick-tint", theme));
    // 70% at most, give or take the rounding of a hex alpha
    expect(alpha).toBeLessThan(0.71);
  });
});
