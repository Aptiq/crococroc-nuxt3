export default defineNuxtPlugin((nuxtApp) => {
    const loading = ref(false)
  
    nuxtApp.hook('page:start', () => {
      loading.value = true
    })
  
    nuxtApp.hook('page:finish', () => {
      loading.value = false
    })
  
    nuxtApp.hook('app:error', () => {
      loading.value = false
    })
  
    return {
      provide: {
        loading: readonly(loading)
      }
    }
  })