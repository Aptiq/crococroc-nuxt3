export default defineNuxtConfig({
  devtools: { enabled: true },
  
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

  build: {
    transpile: ['pinia']
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

  nitro: {
    compressPublicAssets: true,
    minify: true
  }
})