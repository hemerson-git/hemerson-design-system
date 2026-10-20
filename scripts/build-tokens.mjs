// Turns tokens/tokens.json into src/styles/tokens.css.
// The first theme applies by default; every theme block declares the full set of
// color and shadow tokens, so aliases resolve correctly in a nested [data-theme].
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const tokens = JSON.parse(readFileSync("tokens/tokens.json", "utf8"));
const themes = tokens.color.themes.map((theme) => theme.id);
const [firstTheme] = themes;

const alias = (value) => value.replace(/^\{(.+)\}$/, "var(--$1)");

function valueFor(token, theme) {
  if (typeof token.value === "string") return alias(token.value);
  return alias(token.value[theme] ?? token.value[firstTheme]);
}

function themeBlock(selector, theme) {
  const lines = [...tokens.color.tokens, ...(tokens.shadow?.tokens ?? [])].map(
    (token) => `  --${token.name}: ${valueFor(token, theme)};`
  );
  const scheme = theme === "light" ? "light" : "dark";
  return `${selector} {\n  color-scheme: ${scheme};\n${lines.join("\n")}\n}`;
}

const blocks = [
  "/* Generated from tokens/tokens.json by scripts/build-tokens.mjs. Do not edit. */",
  themeBlock(`:root,\n[data-theme="${firstTheme}"]`, firstTheme),
  ...themes.slice(1).map((theme) => themeBlock(`[data-theme="${theme}"]`, theme)),
];

const plain = ["spacing", "radius", "size", "backdrop"]
  .flatMap((family) => tokens[family]?.tokens ?? [])
  .map((token) => `  --${token.name}: ${token.value};`);
const families = Object.entries(tokens.type.families).map(([key, stack]) => `  --font-${key}: ${stack};`);
blocks.push(`:root {\n${[...plain, ...families].join("\n")}\n}`);

// One class per text style: .hds-text-<name>
for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    const family = style.family ?? group.family;
    const rules = [
      `font-family: var(--font-${family});`,
      `font-size: ${style.fontSize};`,
      `line-height: ${style.lineHeight};`,
      `font-weight: ${style.fontWeight};`,
      style.letterSpacing && `letter-spacing: ${style.letterSpacing};`,
    ].filter(Boolean);
    blocks.push(`.hds-text-${style.name} {\n  ${rules.join("\n  ")}\n}`);
  }
}

mkdirSync("src/styles", { recursive: true });
writeFileSync("src/styles/tokens.css", blocks.join("\n\n") + "\n");
console.log(`tokens.css: ${tokens.color.tokens.length} colors, ${themes.length} themes`);
