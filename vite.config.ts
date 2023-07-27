/// <reference types="vitest" />

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#14b8a6",
        background_color: "#000000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "Library",
        name: "Library - Your books",
        icons: [
          {
            src: "/favicon.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "c8",
      reporter: ["html", "lcov"],
    },
    passWithNoTests: true,
  },
});
