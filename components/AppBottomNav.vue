<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
    <!-- Bouton Nouvelle Analyse (masqué sur la page de création) -->
    <div v-if="!isAnalyzePage" class="px-4 pb-2">
      <UButton
        to="/analyses/new"
        block
        color="primary"
        icon="i-heroicons-camera"
        size="lg"
        class="font-semibold shadow-lg"
      >
        Nouvelle analyse
      </UButton>
    </div>

    <!-- Navigation -->
    <nav class="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="grid grid-cols-3 gap-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center py-3 px-2"
          :class="[
            'text-gray-500 dark:text-gray-400',
            'hover:text-primary-500 dark:hover:text-primary-400',
            { 'text-primary-500 dark:text-primary-400': isActiveRoute(item.to) }
          ]"
        >
          <UIcon :name="item.icon" class="h-6 w-6" />
          <span class="text-xs mt-1">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Vérifier si on est sur la page de création d'analyse
const isAnalyzePage = computed(() => route.path === '/analyses/new')

const navigationItems = [
  {
    label: 'Accueil',
    to: '/dashboard',
    icon: 'i-heroicons-home'
  },
  {
    label: 'Analyses',
    to: '/analyses',
    icon: 'i-heroicons-chart-bar'
  },
  {
    label: 'Matières',
    to: '/materials',
    icon: 'i-heroicons-square-3-stack-3d'
  }
]

const isActiveRoute = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  if (path === '/analyses') return route.path === '/analyses'
  if (path === '/materials') return route.path === '/materials'
  return false
}
</script>