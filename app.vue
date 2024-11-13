<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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