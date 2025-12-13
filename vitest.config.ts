import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    globals: true,
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
