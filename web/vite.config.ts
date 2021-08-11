import analyze from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import viteCompression from 'vite-plugin-compression'
import ViteFonts from 'vite-plugin-fonts'
import { minifyHtml } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import react from 'vite-preset-react'
import reactJsx from 'vite-react-jsx'
import tsconfigPaths from 'vite-tsconfig-paths'
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
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'GBFinder Omega - グラブル救援検索・マグナ',
        short_name: 'GBFinder Omega',
        description: 'A raid finder for granblue fantasy',
        theme_color: '#2172E5',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['src/statics/sounds/*.mp3', 'src/statics/sounds/**/*.jpg', 'src/statics/statics/**/*.webp'],
      },
    }),
  ],
})
