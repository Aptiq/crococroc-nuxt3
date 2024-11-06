<template>
  <div class="min-h-screen pb-16">
    <!-- Header (optionnel) -->
    <UHeader v-if="showHeader" />
    
    <!-- Main Content -->
    <main class="p-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">
// Vous pouvez contrôler l'affichage du header selon les besoins
const showHeader = ref(false)
</script>