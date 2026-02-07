import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [react()],
});
