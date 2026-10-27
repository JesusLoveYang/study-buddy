import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' —— 相对路径，部署在 Pages 根或任意子目录都能正确加载
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    chunkSizeWarningLimit: 1500
  }
})
