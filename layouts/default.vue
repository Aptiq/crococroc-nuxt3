<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <USidebar />
    <div class="md:ml-64 pb-24 md:pb-8">
      <UHeader />
      <main class="container mx-auto px-4 py-8">
        <slot />
      </main>
    </div>
    <UBottomNavigation />
  </div>
</template>

<script setup lang="ts">
// Le composant UHeader est global via @nuxt/ui
</script>