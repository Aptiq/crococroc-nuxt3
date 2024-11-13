<template>
  <div class="space-y-4">
    <div class="text-center text-gray-500">
      {{ message || defaultMessage }}
    </div>
    
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-light-bulb" class="text-yellow-500" />
        <span>Bon éclairage requis</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-camera" class="text-blue-500" />
        <span>{{ isMobile ? '12MP minimum' : 'Webcam HD requise' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()

const isMobile = ref(/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent))
const defaultMessage = computed(() => 
  isMobile.value ? 
    'Utilisez la caméra arrière de votre téléphone' : 
    'Utilisez votre webcam pour prendre la photo'
)
</script> 