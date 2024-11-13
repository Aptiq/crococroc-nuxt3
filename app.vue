<template>
  <div>
    <!-- Bannière hors ligne -->
    <div 
      v-if="!isOnline" 
      class="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50"
    >
      Mode hors ligne - Synchronisation en attente
    </div>

    <!-- Bannière d'installation -->
    <div 
      v-if="deferredPrompt" 
      class="fixed bottom-20 left-4 right-4 lg:bottom-8 bg-white shadow-lg rounded-lg p-4 flex items-center justify-between z-40"
    >
      <div>
        <h3 class="font-semibold">Installer CrocoCroc</h3>
        <p class="text-sm text-gray-600">Pour un accès rapide et hors ligne</p>
      </div>
      <UButton 
        color="primary"
        @click="promptInstall"
      >
        Installer
      </UButton>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'CrocoCroc',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'CrocoCroc - Votre application de gestion' },
    { name: 'theme-color', content: '#ffffff' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/pwa-192x192.png' }
  ]
})

// Vérifier si l'app peut être installée
const deferredPrompt = ref<any>(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

// Proposer l'installation si possible
const promptInstall = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null
  }
}

// Vérifier la connexion
const isOnline = ref(true)
onMounted(() => {
  isOnline.value = navigator.onLine
  window.addEventListener('online', () => isOnline.value = true)
  window.addEventListener('offline', () => isOnline.value = false)
})
</script>

<style>
@import '@/assets/css/transitions.css';

.page-enter-active, .page-leave-active {
  transition: opacity 0.5s ease;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
</style>