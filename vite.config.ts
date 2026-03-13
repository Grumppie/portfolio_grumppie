import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return

          if (id.includes("@splinetool") || id.includes("three")) {
            return "three-stack"
          }

          if (
            id.includes("framer-motion") ||
            id.includes("/motion/") ||
            id.includes("lucide-react") ||
            id.includes("@radix-ui")
          ) {
            return "vendor"
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
