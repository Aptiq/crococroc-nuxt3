<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden">
    <div class="flex justify-around p-4">
      <NuxtLink 
        to="/dashboard"
        class="text-gray-400 hover:text-gray-100 transition-colors"
        active-class="text-gray-100"
      >
        <UIcon name="i-heroicons-home" class="w-6 h-6" />
      </NuxtLink>
      <NuxtLink 
        to="/analyze" 
        class="text-gray-400 hover:text-gray-100 transition-colors"
        active-class="text-gray-100"
      >
        <UIcon name="i-heroicons-camera" class="w-6 h-6" />
      </NuxtLink>
      <NuxtLink 
        to="/materials" 
        class="text-gray-400 hover:text-gray-100 transition-colors"
        active-class="text-gray-100"
      >
        <UIcon name="i-heroicons-square-3-stack-3d" class="w-6 h-6" />
      </NuxtLink>
    </div>
  </nav>
</template> 