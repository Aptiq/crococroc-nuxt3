<template>
  <div class="space-y-4">
    <UCard v-if="selectedMaterial" class="border rounded-lg">
      <div class="flex items-center gap-4">
        <img
          :src="selectedMaterial.image"
          :alt="selectedMaterial.name"
          class="w-20 h-20 object-cover rounded"
        />
        <div class="flex-1">
          <h4 class="font-medium">{{ selectedMaterial.name }}</h4>
          <p class="text-sm text-gray-500">{{ selectedMaterial.description }}</p>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="$emit('unselect')"
        />
      </div>
    </UCard>

    <div v-else>
      <UButton
        block
        color="primary"
        icon="i-heroicons-square-3-stack-3d"
        @click="$emit('open-selector')"
      >
        Sélectionner une matière
      </UButton>
    </div>
  </div>
</template> 