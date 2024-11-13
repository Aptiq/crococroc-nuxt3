export default defineNuxtConfig({
  // Date de compatibilité
  compatibilityDate: '2024-04-03',

  // Configuration de base
  devtools: { enabled: false },

  // Configuration du serveur
  server: {
    maxHeaderSize: 32768 * 4 // Augmenté pour gérer les grandes images
  },
  
  // Variables d'environnement
  runtimeConfig: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    public: {}
  },
  
  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/color-mode'
  ],
  
  // Configuration UI
  ui: {
    global: true,
    icons: ['heroicons'],
    safelistColors: ['green', 'red', 'gray'],
    components: {
      global: true,
      dirs: ['~/components']
    },
    strategy: 'merge',
    prefix: 'U'
  },
  
  // Configuration Pinia
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },

  piniaPersistedstate: {
    storage: 'localStorage',
    debug: true
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
    pageTransition: { 
      name: 'page', 
      mode: 'out-in' 
    },
    layoutTransition: false,
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },

  // Configuration PWA
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CrocoCroc',
      short_name: 'CrocoCroc',
      description: 'Analyse de solidité des couleurs ISO 105-A02',
      theme_color: '#2E7D32',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'icons/icon-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      offlineStrategy: 'NetworkFirst',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.crococroc\.com\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24 heures
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module'
    }
  },

  // Configuration Nitro
  nitro: {
    compressPublicAssets: true,
    minify: true,
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  },

  // Configuration Image
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'jpg', 'png', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    dir: 'public'
  },

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
    shim: false
  },

  // Configuration Vite
  vite: {
    assetsInclude: ['**/*.svg'],
    build: {
      target: 'esnext',
      rollupOptions: {
        external: [
          '/assets/images/logo-dark.svg',
          '/assets/images/logo-light.svg'
        ]
      }
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    },
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  experimental: {
    componentIslands: false,
    viewTransition: true
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['swiper-container', 'swiper-slide'].includes(tag)
    }
  },

  build: {
    transpile: ['swiper']
  },

  components: {
    global: true,
    dirs: ['~/components'],
    exclude: ['~/components/AnalyzeForm.vue']
  },

  css: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination'
  ],

  colorMode: {
    classSuffix: ''
  }
})