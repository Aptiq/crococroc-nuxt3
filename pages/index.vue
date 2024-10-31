<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center max-w-2xl px-4">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        CrocoCroc
      </h1>
      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        Analysez et suivez l'évolution de vos matières avec précision grâce à notre outil de capture et d'analyse.
      </p>
      <UButton
        to="/dashboard"
        size="xl"
        color="primary"
        class="gap-2"
      >
        Accéder au tableau de bord
        <UIcon name="i-heroicons-arrow-right-20-solid" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})
</script>