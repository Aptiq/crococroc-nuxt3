<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <!-- Bouton Analyse surélevé et circulaire -->
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
      <NuxtLink 
        to="/analyze"
        class="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors p-3"
      >
        <UIcon
          name="i-heroicons-plus-circle"
          class="w-7 h-7"
        />
        <span class="text-[10px] mt-0.5">Analyse</span>
      </NuxtLink>
    </div>

    <!-- Barre de navigation -->
    <div class="flex items-center justify-around h-16">
      <!-- Bouton Accueil -->
      <NuxtLink 
        to="/dashboard"
        class="flex flex-col items-center justify-center w-full h-full"
        :class="[
          'text-sm font-medium transition-colors',
          $route.path === '/dashboard'
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <UIcon
          name="i-heroicons-home"
          class="w-6 h-6 mb-1"
        />
        <span class="text-xs">Accueil</span>
      </NuxtLink>

      <!-- Espace pour le bouton Analyse -->
      <div class="w-full h-full"></div>

      <!-- Bouton Matières -->
      <NuxtLink 
        to="/materials"
        class="flex flex-col items-center justify-center w-full h-full"
        :class="[
          'text-sm font-medium transition-colors',
          $route.path === '/materials'
            ? 'text-primary-500 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <UIcon
          name="i-heroicons-square-3-stack-3d"
          class="w-6 h-6 mb-1"
        />
        <span class="text-xs">Matières</span>
      </NuxtLink>
    </div>
  </nav>
</template>