<template>
  <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <slot name="actions" />
      </div>
      <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script> 