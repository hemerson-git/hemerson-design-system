import { describe, expect, it } from "vitest";
import pkg from "../package.json";
import { appearanceScript } from "../src/appearance/appearance";

// The built package as apps receive it, so run `npm run build` first.

const dist = import.meta.glob<string>("../dist/**/*.{js,ts,css,json}", { query: "?raw", import: "default", eager: true });
const builtAppearance = Object.values(import.meta.glob<Record<string, unknown>>("../dist/appearance.js", { eager: true }))[0];

function file(path: string) {
  const text = dist[`../${path.replace(/^\.\//, "")}`];
  if (text === undefined) throw new Error(`${path} is missing: run npm run build first`);
  return text;
}

const startsAsClientCode = (source: string) => /^\s*["']use client["'];/.test(source);

describe("the published files", () => {
  const targets = Object.entries(pkg.exports).flatMap(([entry, target]) =>
    (typeof target === "string" ? [target] : Object.values(target)).map((path) => [entry, path])
  );

  it.each(targets)("%s points at a built file (%s)", (_entry, path) => {
    expect(file(path).length).toBeGreaterThan(0);
  });

  it("styles.css is still fonts, tokens and components, in that order", () => {
    const parts = ["dist/fonts.css", "dist/tokens.css", "dist/components.css"].map((path) => file(path).trim());

    expect(file("dist/styles.css")).toBe(parts.join("\n\n") + "\n");
  });

  it.each(["dist/tokens.css", "dist/components.css"])("%s can be imported into a cascade layer: no @import, no @layer", (path) => {
    expect(file(path)).not.toMatch(/@import|@layer/);
  });
});

describe("React Server Components", () => {
  it("loads the root entry, which holds the components, as client code", () => {
    expect(startsAsClientCode(file("dist/index.js"))).toBe(true);
  });

  it("keeps the React-free entries and shared chunks usable from server code", () => {
    const others = Object.keys(dist).filter((path) => path.endsWith(".js") && path !== "../dist/index.js");

    expect(others.length).toBeGreaterThan(0);
    for (const path of others) expect(startsAsClientCode(dist[path]), path).toBe(false);
  });

  it("offers the tested appearance script from the server-safe entry", () => {
    expect(builtAppearance?.appearanceScript).toBe(appearanceScript);
  });
});
