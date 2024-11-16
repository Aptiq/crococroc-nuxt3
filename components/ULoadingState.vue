<template>
  <div class="flex flex-col items-center justify-center py-12">
    <ULoadingBar />
    <p v-if="message" class="mt-4 text-sm text-gray-500">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script> 