export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  
  ui: {
    global: true,
    icons: ['heroicons']
  },
  
  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ]
  },

  piniaPersistedstate: {
    storage: 'localStorage',
    debug: true
  },

  build: {
    transpile: ['pinia']
  },
  
  app: {
    head: {
      title: 'CrocoCroc',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CrocoCroc - Votre application de gestion' },
        { name: 'theme-color', content: '#2E7D32' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/pwa-192x192.png' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  pwa: {
    manifest: {
      name: 'CrocoCroc',
      short_name: 'CrocoCroc',
      description: 'CrocoCroc - Votre application de gestion',
      theme_color: '#2E7D32',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\..*\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    }
  },

  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  typescript: {
    strict: false,
    typeCheck: false,
    shim: false
  },

  experimental: {
    payloadExtraction: false
  },

  routeRules: {
    '/api/**': { cors: true }
  }
})