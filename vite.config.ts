import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/uk-car-theory-test/',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules'],
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    cssMinify: false,
  },
})