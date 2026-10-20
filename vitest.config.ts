import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["src/**/*.test.tsx"],
      // Real CSS only for tests that read a stylesheet as text
      css: { include: [/\.css\?raw$/] },
    },
  })
);
