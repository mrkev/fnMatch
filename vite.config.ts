/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

// Runtime dependencies are kept external in the published package so consumers
// resolve them from their own node_modules (no double-shipping). The docs build
// (`vite build --mode docs`) bundles everything so the demo page runs standalone.
const external = ["astring", "cherow", "fast-deep-equal"];

export default defineConfig(({ mode }) => {
  const isDocs = mode === "docs";

  return {
    build: {
      outDir: isDocs ? "docs/js" : "dist",
      // Don't wipe sibling files (dist/index.d.ts, docs/js/viz.js, etc.).
      emptyOutDir: false,
      lib: {
        entry: "src/index.ts",
        name: "fnMatch",
        formats: ["umd"],
        fileName: () => "fnMatch.js",
      },
      rollupOptions: isDocs
        ? {}
        : {
            external,
            output: {
              globals: {
                astring: "astring",
                cherow: "cherow",
                "fast-deep-equal": "fast_deep_equal",
              },
            },
          },
    },
    plugins: isDocs ? [] : [dts({ include: ["src"] })],
    test: {
      globals: true,
      environment: "node",
      include: ["spec/**/*.{js,ts}"],
    },
  };
});
