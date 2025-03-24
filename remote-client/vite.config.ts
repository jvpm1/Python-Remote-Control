// Using Vite (recommended for Vue 3)
// vite.config.js

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), viteSingleFile(), tailwindcss()],
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    minify: true,
  },
});
