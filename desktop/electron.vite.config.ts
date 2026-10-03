import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/main.ts')
      },
      rollupOptions: {
        external: (id) => {
          if (id.includes('generated-client')) return true
          const builtins = ['electron', 'bcryptjs', 'path', 'fs', 'http', 'https', 'crypto', 'dotenv', 'events', 'util', 'stream', 'os']
          return builtins.includes(id)
        }
      }
    }
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/preload.ts')
      },
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'index.html')
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [react()]
  }
})
