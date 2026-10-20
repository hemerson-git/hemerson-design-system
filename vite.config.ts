import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Shared by Storybook and Vitest; the library build lives in vite.lib.config.ts
export default defineConfig({
  plugins: [react()],
});
