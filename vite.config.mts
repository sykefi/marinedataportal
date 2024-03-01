import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from 'path'


export default defineConfig(({ command, mode }) => {
  return {
    base: '',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    server: {
      port: 8080,
    },
    plugins: [vue()],
    build: {
      sourcemap: mode !== 'production',
    }
  }
})
