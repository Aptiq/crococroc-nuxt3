<template>
  <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <img src="/logo.svg" alt="CrocoCroc" class="h-8" />
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center px-3 py-2 rounded-lg"
          :class="[
            'text-gray-700 dark:text-gray-200',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            { 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400': isActiveRoute(item.to) }
          ]"
        >
          <UIcon :name="item.icon" class="h-5 w-5 mr-3" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="text-sm text-gray-500">
          CrocoCroc v1.0.0
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const navigationItems = [
  {
    label: 'Tableau de bord',
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