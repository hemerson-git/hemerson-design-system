import { defineConfig } from "vitest/config";

// Checks dist/ the way apps receive it, so it runs after `npm run build`
export default defineConfig({
  test: {
    include: ["package-tests/**/*.test.ts"],
    // The built stylesheets are read as text
    css: { include: [/\.css\?raw$/] },
  },
});
