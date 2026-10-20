// Assembles the published stylesheets in dist/:
// styles.css = fonts + tokens + components; tokens.css and tokens.json on their own.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8").trim();

writeFileSync(
  "dist/styles.css",
  [read("src/styles/fonts.css"), read("src/styles/tokens.css"), read("src/styles/components.css")].join("\n\n") + "\n"
);
copyFileSync("src/styles/tokens.css", "dist/tokens.css");
copyFileSync("tokens/tokens.json", "dist/tokens.json");
console.log("dist: styles.css, tokens.css, tokens.json");
