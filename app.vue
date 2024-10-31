<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <transition name="page" mode="out-in">
      <NuxtPage />
    </transition>
    <UNotifications />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Charger le thème de base
useHead({
  title: 'CrocoCroc'
})
</script>

<style>
@import '@/assets/css/transitions.css';

/* Exemple de style de transition pour la page */
.page-enter-active, .page-leave-active {
  transition: opacity 0.5s ease;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
</style>