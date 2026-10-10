import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

// Do NOT add @vitejs/plugin-rsc here: vinext registers it automatically for app/ projects.
export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] } }),
  ],
});
