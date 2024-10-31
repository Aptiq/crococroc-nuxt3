export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Mise à jour du chemin de l'alias Pinia pour Docker
  alias: {
    pinia: '/app/node_modules/pinia/dist/pinia.mjs'
  },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  ui: {
    global: true,
    icons: ['heroicons']
  },
  
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },
  
  app: {
    head: {
      title: 'CrocoCroc',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  // Optimisations pour Docker
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // Configuration pour le développement dans Docker
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: '0.0.0.0',
        port: 24678
      }
    }
  }
})