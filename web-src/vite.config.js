import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' —— 部署到 https://<user>.github.io/<repo>/web/ 也能正确加载资源
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: '../repo-stage/web',
    emptyOutDir: true,
    assetsDir: 'static',
    chunkSizeWarningLimit: 1500
  }
})
