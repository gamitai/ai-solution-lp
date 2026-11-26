import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, "index.html"), preview: path.resolve(__dirname, "preview.html") } } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
