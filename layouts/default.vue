<template>
  <div class="min-h-screen">
    <!-- Sidebar desktop -->
    <AppSidebar class="hidden lg:block" />

    <!-- Contenu principal -->
    <div class="lg:pl-64">
      <!-- Header -->
      <UHeader
        :ui="{
          wrapper: 'relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
          container: 'mx-auto px-4 sm:px-6 lg:px-8',
          inner: 'flex items-center justify-between py-4',
        }"
      >
        <template #left>
          <h1 class="text-lg font-semibold">CrocoCroc</h1>
        </template>
        
        <template #right>
          <UDropdown
            :items="userMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-user-circle"
            />
          </UDropdown>
        </template>
      </UHeader>

      <!-- Contenu principal -->
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>

    <!-- Navigation mobile -->
    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">
const userMenuItems = [
  [{
    label: 'Profil',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  },
  {
    label: 'Paramètres',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
  }],
  [{
    label: 'Déconnexion',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => {
      // Logique de déconnexion
    }
  }]
]
</script>

<style scoped>
/* Ajuster l'espacement pour la navigation mobile */
@media (max-width: 1024px) {
  main {
    padding-bottom: 4rem;
  }
}
</style>