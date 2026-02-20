import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "./temp/**"],
    // Increase timeout for network tests
    testTimeout: 30000,
    // Retry failed tests (helpful for flaky network tests)
    retries: 1,
    // Show more detailed output
    verbose: true,
  },
});
