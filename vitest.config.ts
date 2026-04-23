import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "."),
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
      include: ["components/**", "composables/**", "stores/**"],
    },
  },
});
