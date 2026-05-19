import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// 固定設定 base 路徑，避免因為本地打包時環境變數不存在導致 PWA manifest 路徑解析至根目錄
const base = '/positive_psychology_project/'

export default defineConfig({
  base,
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      // Use relative paths so icons resolve correctly on any base path (e.g. GitHub Pages sub-path)
      manifest: {
        name: 'debug your life',
        short_name: 'DebugLife',
        description: '透過儀式感進入心流，並透過感恩強化正向循環。',
        theme_color: '#009688',
        background_color: '#F5F5F5',
        display: 'standalone',
        start_url: base,
        scope: base,
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache all static assets for offline support (required for installability)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jsdelivr-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ],
})
