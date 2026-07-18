import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      devOptions: {
        enabled: false, // Ensure PWA is NOT active in dev to prevent HMR caching bugs
      },
      manifest: {
        name: 'Farmy',
        short_name: 'Farmy',
        description: 'Offline-first farm diary and crop care companion.',
        theme_color: '#08a855',
        background_color: '#f7fbf5',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\/auth\//, /\/supabase\//],
        runtimeCaching: [
          // Network First for HTML to ensure users always get the latest version
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          // Stale While Revalidate for static assets
          {
            urlPattern: ({ request, url }) =>
              request.method === 'GET' &&
              !url.pathname.startsWith('/api/') &&
              !url.pathname.includes('/auth/') &&
              !url.hostname.includes('supabase'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'farmy-static-runtime',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    })
  ],
})
