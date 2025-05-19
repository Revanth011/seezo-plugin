import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: ".",
        },
        {
          src: "src/favicon.svg", // Example: if you want to copy icons too
          dest: "src",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background.ts"),
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep original names for background and content scripts
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return `src/[name].js`;
          }
          return "assets/[name]-[hash].js"; // Default for other entries like popup
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]", // Simplified asset file naming
      },
    },
    outDir: "dist",
    emptyOutDir: true, // Ensure dist is cleaned before build
  },
});
