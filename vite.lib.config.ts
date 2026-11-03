import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        glass: "src/glass/index.ts",
        appearance: "src/appearance/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        // The components use hooks, so frameworks with React Server Components, such as Next.js,
        // must load the root entry as client code. The React-free entries stay usable on the server.
        banner: (chunk) => (chunk.isEntry && chunk.name === "index" ? '"use client";' : ""),
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
