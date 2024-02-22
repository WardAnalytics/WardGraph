import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "./public",
  build: {
    chunkSizeWarningLimit: 1600,
    sourcemap: true, // Enable devtool for debugging
    // Relative to the root
    outDir: "./build",
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames() {
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  plugins: [
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: "**/*.{jsx,tsx}",
    }),
    EnvironmentPlugin("all"),
    compression(),
  ],
  server: {
    port: 3000,
    open: true,
  },
});
