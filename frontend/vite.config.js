// vite.config.js
import { defineConfig } from "vite"
import react             from "@vitejs/plugin-react"
import path              from "path"
import tailwindcss       from "tailwindcss"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets")
    }
  },
  css: {
    postcss: { plugins: [tailwindcss()] }
  },
  assetsInclude: ["**/*.gif"]
})
