import path from "node:path";
import { defineConfig } from "vitest/config";

// Deliberately separate from vite.config.ts: these tests run in plain Node (Node 24 has
// Request/Response/fetch natively), not the vinext/workerd build pipeline, so the vinext()
// and cloudflare() plugins must not be loaded here.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**", ".wrangler/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
