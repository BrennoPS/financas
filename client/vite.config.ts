import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Hosted on GitHub Pages under /financas/. Fully client-side PWA: all data is stored
// on the device, and the service worker caches everything so it works offline once
// installed to the home screen.
const BASE = '/financas/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        navigateFallback: `${BASE}index.html`,
      },
      manifest: {
        name: 'Controle Financeiro',
        short_name: 'Finanças',
        description: 'Controle de gastos e receitas, no seu bolso.',
        lang: 'pt-BR',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f7f6fc',
        theme_color: '#f7f6fc',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    // GitHub Pages serves the site from /docs on the main branch
    outDir: '../docs',
    emptyOutDir: true,
  },
})
