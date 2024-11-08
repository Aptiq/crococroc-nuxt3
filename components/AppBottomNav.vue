<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <!-- Barre de navigation -->
    <div class="flex items-center justify-around h-16">
      <!-- Bouton Accueil -->
      <NuxtLink 
        to="/dashboard"
        class="flex items-center justify-center w-full h-full transition-colors"
        :class="[
          $route.path === '/dashboard'
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <UIcon
          name="i-heroicons-home"
          class="w-7 h-7"
        />
      </NuxtLink>

      <!-- Bouton Analyse -->
      <NuxtLink 
        to="/analyze"
        class="flex items-center justify-center w-full h-full transition-colors"
        :class="[
          $route.path === '/analyze'
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-primary-500 dark:text-primary-400'
        ]"
      >
        <UIcon
          name="i-heroicons-camera"
          class="w-7 h-7"
        />
      </NuxtLink>

      <!-- Bouton Matières -->
      <NuxtLink 
        to="/materials"
        class="flex items-center justify-center w-full h-full transition-colors"
        :class="[
          $route.path === '/materials'
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <UIcon
          name="i-heroicons-square-3-stack-3d"
          class="w-7 h-7"
        />
      </NuxtLink>
    </div>
  </nav>
</template>