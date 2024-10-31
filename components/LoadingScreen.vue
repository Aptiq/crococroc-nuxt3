<template>
  <div class="fixed inset-0 bg-gradient-to-b from-blue-50 to-white z-50 flex flex-col items-center justify-center">
    <div class="text-center px-4">
      <!-- Logo ou Titre -->
      <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        CrocoCroc
      </h1>
      
      <!-- Animation personnalisée -->
      <div class="mt-8 space-y-2">
        <div class="flex justify-center space-x-1">
          <div v-for="i in 3" :key="i" 
               class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
               :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
          />
        </div>
        <p class="text-sm text-gray-500 animate-pulse">Chargement...</p>
      </div>

      <!-- Message de chargement optionnel -->
      <p class="mt-4 text-gray-600 max-w-sm mx-auto">
        {{ loadingMessages[currentMessageIndex] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const loadingMessages = [
  'Préparation de l\'analyse...',
  'Calibration des couleurs...',
  'Chargement des données...',
  'Presque prêt...'
]

const currentMessageIndex = ref(0)

// Changer le message toutes les 2 secondes
onMounted(() => {
  const interval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.length
  }, 2000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>