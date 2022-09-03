import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  plugins: [
    tsconfigPaths(),
    react(),
    macrosPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'safari-pinned-tab.svg', 'locales/*.json'],
      manifest: {
        name: 'GBFinder Omega - グラブル救援検索・マグナ',
        short_name: 'GBFinder',
        description: 'A raid finder for granblue fantasy グラブル救援検索',
        theme_color: '#e1f5fe',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,mp3,jpg,web,png,svg,woff2,woff}'],
      },
    }),
  ],
})
