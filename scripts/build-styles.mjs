// Assembles the published stylesheets in dist/:
// styles.css = fonts + tokens + components; each part, and tokens.json, on its own too, so apps
// can self-host the fonts or put the component styles in a cascade layer.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8").trim();

writeFileSync(
  "dist/styles.css",
  [read("src/styles/fonts.css"), read("src/styles/tokens.css"), read("src/styles/components.css")].join("\n\n") + "\n"
);
copyFileSync("src/styles/fonts.css", "dist/fonts.css");
copyFileSync("src/styles/tokens.css", "dist/tokens.css");
copyFileSync("src/styles/components.css", "dist/components.css");
copyFileSync("tokens/tokens.json", "dist/tokens.json");
console.log("dist: styles.css, fonts.css, tokens.css, components.css, tokens.json");
