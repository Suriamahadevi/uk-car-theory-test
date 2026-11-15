import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built site works from any folder (or opened via a static server).
  base: './',
  css: {
    preprocessorOptions: {
      scss: { loadPaths: ['node_modules'], quietDeps: true, silenceDeprecations: ['import'] },
    },
  },
  build: {
    // govuk-frontend ships an old IE hack ("min-width: 0\0") that lightningcss rejects.
    cssMinify: false,
  },
})
