export default defineNuxtConfig({
  // Configuration de base
  devtools: { enabled: false }, // Désactivé pour éviter les conflits

  // Configuration du serveur
  server: {
    maxHeaderSize: 32768
  },
  
  // Variables d'environnement
  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    
    // Variables publiques (accessibles côté client)
    public: {
      // Ajoutez ici les variables publiques si nécessaire
    }
  },
  
  // Modules
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  
  // Configuration UI
  ui: {
    global: true,
    icons: ['heroicons']
  },
  
  // Configuration Pinia
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
  
  // Configuration de l'application
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

  // Configuration PWA
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

  // Configuration Nitro
  nitro: {
    compressPublicAssets: true,
    minify: true,
    compatibilityDate: '2024-04-03'
  },

  // Configuration TypeScript
  typescript: {
    strict: false,
    typeCheck: false,
    shim: false
  },

  // Configuration expérimentale
  experimental: {
    payloadExtraction: false
  },

  // Règles de routage
  routeRules: {
    '/api/**': { cors: true }
  },

  // Configuration Vite pour résoudre les problèmes d'inspecteur
  vite: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }
  }
})