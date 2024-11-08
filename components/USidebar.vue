<template>
  <aside class="hidden md:flex flex-col w-64 bg-gray-800 h-screen fixed left-0 top-0">
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-xl font-bold text-gray-100">CrocoCroc</h1>
    </div>
    
    <nav class="flex-1 p-4 space-y-2">
      <NuxtLink 
        to="/dashboard" 
        class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
        active-class="bg-gray-700 text-gray-100"
      >
        <UIcon name="i-heroicons-home" class="w-6 h-6" />
        <span>Tableau de bord</span>
      </NuxtLink>

      <NuxtLink 
        to="/analyze" 
        class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
        active-class="bg-gray-700 text-gray-100"
      >
        <UIcon name="i-heroicons-camera" class="w-6 h-6" />
        <span>Nouvelle analyse</span>
      </NuxtLink>

      <NuxtLink 
        to="/materials" 
        class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
        active-class="bg-gray-700 text-gray-100"
      >
        <UIcon name="i-heroicons-square-3-stack-3d" class="w-6 h-6" />
        <span>Matières</span>
      </NuxtLink>
    </nav>
  </aside>
</template> 