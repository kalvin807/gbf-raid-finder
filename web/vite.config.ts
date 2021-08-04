import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

import tsconfigPaths from 'vite-tsconfig-paths'
import analyze from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
    rollupOptions: {
      plugins: [analyze()],
    },
  },
  plugins: [tsconfigPaths(), reactRefresh()],
})
