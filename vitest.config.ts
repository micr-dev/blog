import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/link": path.resolve(__dirname, "./node_modules/next/link.js"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    server: {
      deps: {
        // react-tweet ships CSS modules from its package entrypoint. Inline the
        // dependency so Vite transforms those imports for Node-based MDX tests.
        inline: ["react-tweet"],
      },
    },
  },
});
