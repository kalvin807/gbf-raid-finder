import analyze from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import viteCompression from 'vite-plugin-compression';
import ViteFonts from 'vite-plugin-fonts'
import react from 'vite-preset-react'
import reactJsx from 'vite-react-jsx'
import tsconfigPaths from 'vite-tsconfig-paths'
import { minifyHtml } from 'vite-plugin-html';
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
  plugins: [
    tsconfigPaths(),
    react({
      injectReact: false,
    }),
    macrosPlugin(),
    ViteFonts({
      google: {
        families: ['Inter'],
      },
    }),
    reactJsx(),
    viteCompression(),
    minifyHtml(),
  ],
})
