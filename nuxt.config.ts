export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  ui: {
    global: true,
    safelistColors: ['primary', 'gray', 'green', 'yellow', 'red'],
  },
  colorMode: {
    classSuffix: '',
  },
  app: {
    pageTransition: { name: 'page' }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})