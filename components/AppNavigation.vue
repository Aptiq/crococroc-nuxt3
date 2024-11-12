<template>
  <div>
    <UVerticalNavigation :links="navigationLinks" />
  </div>
</template>

<script setup>
const navigationLinks = [
  { label: 'Tableau de bord', icon: 'i-heroicons-home', to: '/dashboard' },
  { label: 'Analyses', icon: 'i-heroicons-chart-bar', to: '/analyses' },
  { label: 'Matières', icon: 'i-heroicons-cube', to: '/materials' }
]
</script> 