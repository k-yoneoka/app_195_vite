import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "dist", // plugin/dist ではなく直下の dist に変更
    rollupOptions: {
      input: resolve(__dirname, "src/desktop/index.tsx"),
      output: {
        format: "iife",
        entryFileNames: "desktop.js",
        assetFileNames: "style.[ext]", // CSSの名前を固定
        name: "kintoneCustomize",
      },
    },
  },
});
