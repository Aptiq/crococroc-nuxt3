<template>
  <div class="min-h-screen flex flex-col">
    <!-- Sidebar (desktop) -->
    <AppSidebar 
      :is-open="isSidebarOpen" 
      @toggle="isSidebarOpen = !isSidebarOpen" 
      class="hidden lg:block"
    />

    <!-- Contenu principal -->
    <main class="flex-1 lg:pl-64">
      <div class="pb-16 lg:pb-0">
        <slot />
      </div>
    </main>

    <!-- Navigation mobile -->
    <AppBottomNav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden" />
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)
</script>

<style>
/* Retirer les marges par défaut */
body {
  margin: 0;
  padding: 0;
}

/* Ajuster l'espacement pour la navigation mobile */
@media (max-width: 1023px) {
  .main-content {
    margin-bottom: 4rem;
  }
}

/* Assurer que le contenu ne passe pas sous la navigation */
.pb-16 {
  padding-bottom: 4rem !important;
}
</style>