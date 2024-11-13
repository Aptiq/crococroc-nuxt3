<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
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
</template>

<script setup lang="ts">
const route = useRoute()

const navigationItems = [
  {
    label: 'Accueil',
    to: '/dashboard',
    icon: 'i-heroicons-home'
  },
  {
    label: 'Matières',
    to: '/materials',
    icon: 'i-heroicons-square-3-stack-3d'
  },
  {
    label: 'Analyses',
    to: '/analyses',
    icon: 'i-heroicons-chart-bar'
  }
]

const isActiveRoute = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  if (path === '/analyses') return route.path.startsWith('/analyses')
  if (path === '/materials') return route.path.startsWith('/materials')
  return false
}
</script>